import { describe, it, expect } from "vitest";
import {
  evaluateMeanStatisticAccessRule,
  evaluateMeanStatisticAccessRulePostQuery,
} from "../evaluateMeanStatisticAccessRule";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import type {
  MeanStatisticAccessRule,
  MeanAllowedPath,
} from "@oxfordia/stat-plugin-mean_core";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePath(rdfType: string): GraphPath {
  return {
    "@id": "#p",
    start: { "@id": "#s", rdfType: [rdfType] },
  } as unknown as GraphPath;
}

const PERSON_PATH = makePath("http://example.org/Person");
const ANIMAL_PATH = makePath("http://example.org/Animal");

function makeAllowedPath(
  graphPath: GraphPath,
  minCount: number,
): MeanAllowedPath {
  return { "@id": "#ap", graphPath, minCount } as unknown as MeanAllowedPath;
}

function makeAccessRule(
  allowedPath: MeanAllowedPath[],
): MeanStatisticAccessRule {
  return {
    "@id": "#rule",
    allowedPath,
  } as unknown as MeanStatisticAccessRule;
}

// ---------------------------------------------------------------------------
// evaluateMeanStatisticAccessRule (pre-query)
// ---------------------------------------------------------------------------

describe("evaluateMeanStatisticAccessRule", () => {
  it("returns an Error when there are no allowed paths", () => {
    const rule = makeAccessRule([]);
    const result = evaluateMeanStatisticAccessRule(PERSON_PATH, rule);
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("No allowed");
  });

  it("returns true when the query path matches an allowed path", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5)]);
    expect(evaluateMeanStatisticAccessRule(PERSON_PATH, rule)).toBe(true);
  });

  it("returns an Error when the query path does not match any allowed path", () => {
    const rule = makeAccessRule([makeAllowedPath(ANIMAL_PATH, 5)]);
    const result = evaluateMeanStatisticAccessRule(PERSON_PATH, rule);
    expect(result).toBeInstanceOf(Error);
  });

  it("finds a match when there are multiple allowed paths and the last matches", () => {
    const rule = makeAccessRule([
      makeAllowedPath(ANIMAL_PATH, 5),
      makeAllowedPath(PERSON_PATH, 10),
    ]);
    expect(evaluateMeanStatisticAccessRule(PERSON_PATH, rule)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// evaluateMeanStatisticAccessRulePostQuery (post-query)
// ---------------------------------------------------------------------------

describe("evaluateMeanStatisticAccessRulePostQuery", () => {
  it("returns true when count meets minCount", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5)]);
    expect(
      evaluateMeanStatisticAccessRulePostQuery(PERSON_PATH, rule, { count: 5 }),
    ).toBe(true);
  });

  it("returns true when count exceeds minCount", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5)]);
    expect(
      evaluateMeanStatisticAccessRulePostQuery(PERSON_PATH, rule, { count: 100 }),
    ).toBe(true);
  });

  it("returns an Error when count is below minCount", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 10)]);
    const result = evaluateMeanStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      { count: 4 },
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("4");
    expect((result as Error).message).toContain("10");
  });

  it("returns an Error when the allowed path has no valid minCount", () => {
    const invalidEntry = {
      "@id": "#ap",
      graphPath: PERSON_PATH,
      minCount: "not-a-number",
    } as unknown as MeanAllowedPath;
    const rule = makeAccessRule([invalidEntry]);
    const result = evaluateMeanStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      { count: 99 },
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toMatch(/missing a valid minCount/i);
  });

  it("returns an Error when the query path is not in the allowed list", () => {
    const rule = makeAccessRule([makeAllowedPath(ANIMAL_PATH, 5)]);
    const result = evaluateMeanStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      { count: 99 },
    );
    expect(result).toBeInstanceOf(Error);
  });

  it("floors a decimal minCount", () => {
    const entry = {
      "@id": "#ap",
      graphPath: PERSON_PATH,
      minCount: 4.9,
    } as unknown as MeanAllowedPath;
    const rule = makeAccessRule([entry]);
    // floor(4.9) = 4, so count=4 should pass
    expect(
      evaluateMeanStatisticAccessRulePostQuery(PERSON_PATH, rule, { count: 4 }),
    ).toBe(true);
  });

  it("treats a negative minCount as 0 (clamps)", () => {
    const entry = {
      "@id": "#ap",
      graphPath: PERSON_PATH,
      minCount: -10,
    } as unknown as MeanAllowedPath;
    const rule = makeAccessRule([entry]);
    expect(
      evaluateMeanStatisticAccessRulePostQuery(PERSON_PATH, rule, { count: 0 }),
    ).toBe(true);
  });
});
