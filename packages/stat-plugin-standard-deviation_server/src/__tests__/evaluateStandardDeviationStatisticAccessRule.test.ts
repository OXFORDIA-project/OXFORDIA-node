import { describe, it, expect } from "vitest";
import {
  evaluateStandardDeviationStatisticAccessRule,
  evaluateStandardDeviationStatisticAccessRulePostQuery,
} from "../evaluateStandardDeviationStatisticAccessRule";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import type {
  StandardDeviationStatisticAccessRule,
  StandardDeviationAllowedPath,
} from "@oxfordia/stat-plugin-standard-deviation_core";

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
  minCount: unknown,
  minDistinctValues: unknown = 1,
): StandardDeviationAllowedPath {
  return {
    "@id": "#ap",
    graphPath,
    minCount,
    minDistinctValues,
  } as unknown as StandardDeviationAllowedPath;
}

function makeAccessRule(
  allowedPath: StandardDeviationAllowedPath[],
): StandardDeviationStatisticAccessRule {
  return {
    "@id": "#rule",
    allowedPath,
  } as unknown as StandardDeviationStatisticAccessRule;
}

function output(count: number, distinctCount = count) {
  return { count, distinctCount };
}

// ---------------------------------------------------------------------------
// evaluateStandardDeviationStatisticAccessRule (pre-query)
// ---------------------------------------------------------------------------

describe("evaluateStandardDeviationStatisticAccessRule", () => {
  it("returns an Error when there are no allowed paths", () => {
    const rule = makeAccessRule([]);
    const result = evaluateStandardDeviationStatisticAccessRule(
      PERSON_PATH,
      rule,
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("No allowed");
  });

  it("returns true when the query path matches an allowed path", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5)]);
    expect(
      evaluateStandardDeviationStatisticAccessRule(PERSON_PATH, rule),
    ).toBe(true);
  });

  it("returns an Error when the query path does not match any allowed path", () => {
    const rule = makeAccessRule([makeAllowedPath(ANIMAL_PATH, 5)]);
    const result = evaluateStandardDeviationStatisticAccessRule(
      PERSON_PATH,
      rule,
    );
    expect(result).toBeInstanceOf(Error);
  });

  it("finds a match when there are multiple allowed paths and the last matches", () => {
    const rule = makeAccessRule([
      makeAllowedPath(ANIMAL_PATH, 5),
      makeAllowedPath(PERSON_PATH, 10),
    ]);
    expect(
      evaluateStandardDeviationStatisticAccessRule(PERSON_PATH, rule),
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// evaluateStandardDeviationStatisticAccessRulePostQuery (post-query)
// ---------------------------------------------------------------------------

describe("evaluateStandardDeviationStatisticAccessRulePostQuery", () => {
  it("returns true when count and distinct count meet their minimums", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5, 3)]);
    expect(
      evaluateStandardDeviationStatisticAccessRulePostQuery(
        PERSON_PATH,
        rule,
        output(5, 3),
      ),
    ).toBe(true);
  });

  it("returns true when count and distinct count exceed their minimums", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5, 3)]);
    expect(
      evaluateStandardDeviationStatisticAccessRulePostQuery(
        PERSON_PATH,
        rule,
        output(100, 40),
      ),
    ).toBe(true);
  });

  it("returns an Error when count is below minCount", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 10)]);
    const result = evaluateStandardDeviationStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      output(4),
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("4");
    expect((result as Error).message).toContain("10");
  });

  it("returns an Error when distinct count is below minDistinctValues", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5, 3)]);
    const result = evaluateStandardDeviationStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      output(50, 2),
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toMatch(/distinct/i);
    expect((result as Error).message).toContain("2");
    expect((result as Error).message).toContain("3");
  });

  it("rejects a sample where every value is identical when minDistinctValues is 2", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5, 2)]);
    expect(
      evaluateStandardDeviationStatisticAccessRulePostQuery(
        PERSON_PATH,
        rule,
        output(50, 1),
      ),
    ).toBeInstanceOf(Error);
  });

  it("rejects fewer than two values even when minCount allows it", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 0, 0)]);
    const result = evaluateStandardDeviationStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      output(1),
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toMatch(/undefined/i);
  });

  it("returns an Error when the allowed path has no valid minCount", () => {
    const rule = makeAccessRule([
      makeAllowedPath(PERSON_PATH, "not-a-number"),
    ]);
    const result = evaluateStandardDeviationStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      output(99),
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toMatch(/missing a valid minCount/i);
  });

  it("returns an Error when the allowed path has no valid minDistinctValues", () => {
    const entry = {
      "@id": "#ap",
      graphPath: PERSON_PATH,
      minCount: 5,
    } as unknown as StandardDeviationAllowedPath;
    const rule = makeAccessRule([entry]);
    const result = evaluateStandardDeviationStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      output(99),
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toMatch(
      /missing a valid minDistinctValues/i,
    );
  });

  it("returns an Error when the query path is not in the allowed list", () => {
    const rule = makeAccessRule([makeAllowedPath(ANIMAL_PATH, 5)]);
    const result = evaluateStandardDeviationStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      output(99),
    );
    expect(result).toBeInstanceOf(Error);
  });

  it("floors decimal thresholds", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 4.9, 2.9)]);
    // floor(4.9) = 4 and floor(2.9) = 2
    expect(
      evaluateStandardDeviationStatisticAccessRulePostQuery(
        PERSON_PATH,
        rule,
        output(4, 2),
      ),
    ).toBe(true);
  });

  it("treats negative thresholds as 0 (clamps) but keeps the floor of two values", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, -10, -10)]);
    expect(
      evaluateStandardDeviationStatisticAccessRulePostQuery(
        PERSON_PATH,
        rule,
        output(2, 0),
      ),
    ).toBe(true);
  });
});
