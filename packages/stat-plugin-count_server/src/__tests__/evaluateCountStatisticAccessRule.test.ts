import { describe, it, expect } from "vitest";
import {
  evaluateCountStatisticAccessRule,
  evaluateCountStatisticAccessRulePostQuery,
} from "../evaluateCountStatisticAccessRule";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import type {
  CountStatisticAccessRule,
  CountAllowedPath,
} from "@oxfordia/stat-plugin-count_core";

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
): CountAllowedPath {
  return { "@id": "#ap", graphPath, minCount } as unknown as CountAllowedPath;
}

function makeAccessRule(
  allowedPath: CountAllowedPath[],
): CountStatisticAccessRule {
  return {
    "@id": "#rule",
    allowedPath,
  } as unknown as CountStatisticAccessRule;
}

// ---------------------------------------------------------------------------
// evaluateCountStatisticAccessRule (pre-query)
// ---------------------------------------------------------------------------

describe("evaluateCountStatisticAccessRule", () => {
  it("returns an Error when there are no allowed paths", () => {
    const rule = makeAccessRule([]);
    const result = evaluateCountStatisticAccessRule(PERSON_PATH, rule);
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("No allowed");
  });

  it("returns true when the query path matches an allowed path", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5)]);
    expect(evaluateCountStatisticAccessRule(PERSON_PATH, rule)).toBe(true);
  });

  it("returns an Error when the query path does not match any allowed path", () => {
    const rule = makeAccessRule([makeAllowedPath(ANIMAL_PATH, 5)]);
    const result = evaluateCountStatisticAccessRule(PERSON_PATH, rule);
    expect(result).toBeInstanceOf(Error);
  });

  it("finds a match when there are multiple allowed paths and the last matches", () => {
    const rule = makeAccessRule([
      makeAllowedPath(ANIMAL_PATH, 5),
      makeAllowedPath(PERSON_PATH, 10),
    ]);
    expect(evaluateCountStatisticAccessRule(PERSON_PATH, rule)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// evaluateCountStatisticAccessRulePostQuery (post-query)
// ---------------------------------------------------------------------------

describe("evaluateCountStatisticAccessRulePostQuery", () => {
  it("returns true when count meets minCount", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5)]);
    expect(
      evaluateCountStatisticAccessRulePostQuery(PERSON_PATH, rule, { count: 5 }),
    ).toBe(true);
  });

  it("returns true when count exceeds minCount", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 5)]);
    expect(
      evaluateCountStatisticAccessRulePostQuery(PERSON_PATH, rule, { count: 100 }),
    ).toBe(true);
  });

  it("returns an Error when count is below minCount", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 10)]);
    const result = evaluateCountStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      { count: 4 },
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("4");
    expect((result as Error).message).toContain("10");
  });

  it("suppresses a count of 0 when minCount is positive", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 1)]);
    expect(
      evaluateCountStatisticAccessRulePostQuery(PERSON_PATH, rule, { count: 0 }),
    ).toBeInstanceOf(Error);
  });

  it("returns an Error when the allowed path has no valid minCount", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, "not-a-number")]);
    const result = evaluateCountStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      { count: 99 },
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toMatch(/missing a valid minCount/i);
  });

  it("returns an Error when minCount is missing", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, undefined)]);
    const result = evaluateCountStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      { count: 99 },
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toMatch(/missing a valid minCount/i);
  });

  it("returns an Error when the query path is not in the allowed list", () => {
    const rule = makeAccessRule([makeAllowedPath(ANIMAL_PATH, 5)]);
    const result = evaluateCountStatisticAccessRulePostQuery(
      PERSON_PATH,
      rule,
      { count: 99 },
    );
    expect(result).toBeInstanceOf(Error);
  });

  it("floors a decimal minCount", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, 4.9)]);
    // floor(4.9) = 4, so count=4 should pass
    expect(
      evaluateCountStatisticAccessRulePostQuery(PERSON_PATH, rule, { count: 4 }),
    ).toBe(true);
  });

  it("treats a negative minCount as 0 (clamps)", () => {
    const rule = makeAccessRule([makeAllowedPath(PERSON_PATH, -10)]);
    expect(
      evaluateCountStatisticAccessRulePostQuery(PERSON_PATH, rule, { count: 0 }),
    ).toBe(true);
  });
});
