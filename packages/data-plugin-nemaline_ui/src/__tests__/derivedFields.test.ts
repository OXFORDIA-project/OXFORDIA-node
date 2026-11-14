import { describe, it, expect } from "vitest";
import { ukWhoZScore } from "../lmsZScore";
import { AMBULATION_AGE_IF_UNKNOWN, deriveFields } from "../derivedFields";
import sitar from "./sitarLms2zCases.json";

describe("ukWhoZScore", () => {
  // Expected values come from sitar::LMS2z(..., "ukwhopt") itself, including
  // the segment boundaries at 2 weeks, 2 years and 4 years.
  it.each(sitar.cases)("matches sitar at age $age ($sex)", (c) => {
    const sex = c.sex === "Male" ? "male" : "female";
    const zH = ukWhoZScore("ht", sex, c.age, c.height);
    const zW = ukWhoZScore("wt", sex, c.age, c.weight);
    if (c.zH === null) expect(zH).toBeUndefined();
    else expect(zH).toBeCloseTo(c.zH, 9);
    if (c.zW === null) expect(zW).toBeUndefined();
    else expect(zW).toBeCloseTo(c.zW, 9);
  });
});

function derive(
  categories: Record<string, string>,
  numbers: Record<string, number> = {},
) {
  const result = deriveFields({
    categories: new Map(Object.entries(categories)),
    numbers: new Map(Object.entries(numbers)),
  });
  return {
    numbers: Object.fromEntries(result.numbers),
    categories: Object.fromEntries(result.categories),
  };
}

describe("deriveFields", () => {
  it("computes Z-scores for children with a recorded sex", () => {
    const { numbers } = derive(
      { GenderAssignedAtBirth: "GenderFemale" },
      { BaselineAge: 1.5, Height: 88.4, Weight: 12.3 },
    );
    expect(numbers.ZScoreH).toBeCloseTo(ukWhoZScore("ht", "female", 1.5, 88.4)!, 12);
    expect(numbers.ZScoreW).toBeCloseTo(ukWhoZScore("wt", "female", 1.5, 12.3)!, 12);
  });

  it("gives no Z-score for adults, or when sex is unknown/other", () => {
    expect(derive({ GenderAssignedAtBirth: "GenderMale" }, { BaselineAge: 25, Height: 170 }).numbers)
      .not.toHaveProperty("ZScoreH");
    expect(derive({ GenderAssignedAtBirth: "GenderUnknown" }, { BaselineAge: 5, Height: 100 }).numbers)
      .not.toHaveProperty("ZScoreH");
  });

  it.each([
    ["AmbulantAtBaselineYes", undefined, "CurrentFunctionWalker"],
    ["AmbulantAtBaselineYes", "SittingAtBaselineNo", "CurrentFunctionWalker"],
    ["AmbulantAtBaselineNo", "SittingAtBaselineYes", "CurrentFunctionSitter"],
    ["AmbulantAtBaselineNo", "SittingAtBaselineNo", "CurrentFunctionNonSitter"],
    // R's ifelse() propagates NA from whichever condition it has to evaluate.
    ["AmbulantAtBaselineNo", undefined, undefined],
    [undefined, "SittingAtBaselineYes", undefined],
  ])("CurrentFN: ambulant=%s sitting=%s → %s", (ambulant, sitting, expected) => {
    const categories: Record<string, string> = {};
    if (ambulant) categories.AmbulantAtBaseline = ambulant;
    if (sitting) categories.IndependentSittingAtBaseline = sitting;
    expect(derive(categories).categories.CurrentFN).toBe(expected);
  });

  it("AmbGain: walkers use their age at ambulation, or 18 if not recorded", () => {
    expect(derive({ EverAchievedAmbulation: "EverAmbulantYes" }, { AgeAmbulationAchieved: 1.5, BaselineAge: 6 }).numbers)
      .toEqual({ AmbGainEvent: 1, AmbGainTime: 1.5 });
    expect(derive({ EverAchievedAmbulation: "EverAmbulantYes" }, { BaselineAge: 6 }).numbers)
      .toEqual({ AmbGainEvent: 1, AmbGainTime: AMBULATION_AGE_IF_UNKNOWN });
  });

  it("AmbGain: everyone else is censored at baseline age", () => {
    expect(derive({ EverAchievedAmbulation: "EverAmbulantNo" }, { BaselineAge: 6 }).numbers)
      .toEqual({ AmbGainEvent: 0, AmbGainTime: 6 });
    expect(derive({ EverAchievedAmbulation: "EverAmbulantNotApplicable" }, { BaselineAge: 0.5 }).numbers)
      .toEqual({ AmbGainEvent: 0, AmbGainTime: 0.5 });
    // No baseline age: event recorded, time missing (as in R).
    expect(derive({ EverAchievedAmbulation: "EverAmbulantNo" }).numbers).toEqual({ AmbGainEvent: 0 });
  });

  it("AmbGain: nothing when 'Ever achieved ambulation?' is blank", () => {
    expect(derive({}, { BaselineAge: 6, AgeAmbulationAchieved: 1 }).numbers).toEqual({});
  });
});
