import { describe, it, expect } from "vitest";
import { evaluateKaplanMeierStatisticAccessRule } from "../evaluateKaplanMeierStatisticAccessRule";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import type {
  KaplanMeierStatisticAccessRule,
  KaplanMeierAllowedPath,
} from "@oxfordia/stat-plugin-kaplan-meier_core";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePath(tag: string): GraphPath {
  return {
    "@id": `#path-${tag}`,
    start: { "@id": `#s-${tag}`, rdfType: [`http://example.org/${tag}`] },
  } as unknown as GraphPath;
}

const TIME_PATH = makePath("Time");
const EVENT_PATH = makePath("Event");
const GROUP_PATH = makePath("Group");
const OTHER_PATH = makePath("Other");

function makeAllowedPath(
  timePath: GraphPath,
  eventPath: GraphPath,
  groupPaths?: GraphPath[],
): KaplanMeierAllowedPath {
  return {
    "@id": "#ap",
    timeGraphPath: timePath,
    eventGraphPath: eventPath,
    groupByGraphPath: groupPaths ?? [],
  } as unknown as KaplanMeierAllowedPath;
}

function makeAccessRule(
  allowedPaths: KaplanMeierAllowedPath[],
): KaplanMeierStatisticAccessRule {
  return {
    "@id": "#rule",
    allowedPath: allowedPaths,
  } as unknown as KaplanMeierStatisticAccessRule;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("evaluateKaplanMeierStatisticAccessRule", () => {
  it("returns an Error when there are no allowed paths", () => {
    const rule = makeAccessRule([]);
    const result = evaluateKaplanMeierStatisticAccessRule(
      TIME_PATH,
      EVENT_PATH,
      undefined,
      rule,
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("No allowed paths");
  });

  it("returns true when timePath and eventPath both match", () => {
    const rule = makeAccessRule([makeAllowedPath(TIME_PATH, EVENT_PATH)]);
    expect(
      evaluateKaplanMeierStatisticAccessRule(
        TIME_PATH,
        EVENT_PATH,
        undefined,
        rule,
      ),
    ).toBe(true);
  });

  it("returns Error with timePath message when timePath does not match", () => {
    const rule = makeAccessRule([makeAllowedPath(TIME_PATH, EVENT_PATH)]);
    const result = evaluateKaplanMeierStatisticAccessRule(
      OTHER_PATH,
      EVENT_PATH,
      undefined,
      rule,
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("timePath");
  });

  it("returns Error with eventPath message when eventPath does not match", () => {
    const rule = makeAccessRule([makeAllowedPath(TIME_PATH, EVENT_PATH)]);
    const result = evaluateKaplanMeierStatisticAccessRule(
      TIME_PATH,
      OTHER_PATH,
      undefined,
      rule,
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("eventPath");
  });

  it("returns Error about combination when each path individually matches but not together", () => {
    const rule = makeAccessRule([
      makeAllowedPath(TIME_PATH, OTHER_PATH),
      makeAllowedPath(OTHER_PATH, EVENT_PATH),
    ]);
    const result = evaluateKaplanMeierStatisticAccessRule(
      TIME_PATH,
      EVENT_PATH,
      undefined,
      rule,
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toMatch(/combination/i);
  });

  it("returns true when an optional groupByPath matches an allowed entry", () => {
    const rule = makeAccessRule([
      makeAllowedPath(TIME_PATH, EVENT_PATH, [GROUP_PATH]),
    ]);
    expect(
      evaluateKaplanMeierStatisticAccessRule(
        TIME_PATH,
        EVENT_PATH,
        GROUP_PATH,
        rule,
      ),
    ).toBe(true);
  });

  it("returns Error with groupByPath message when groupBy does not match", () => {
    const rule = makeAccessRule([
      makeAllowedPath(TIME_PATH, EVENT_PATH, [GROUP_PATH]),
    ]);
    const result = evaluateKaplanMeierStatisticAccessRule(
      TIME_PATH,
      EVENT_PATH,
      OTHER_PATH,
      rule,
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain("groupByPath");
  });

  it("returns true when no groupByPath is requested (undefined) even if entry has groupPaths", () => {
    const rule = makeAccessRule([
      makeAllowedPath(TIME_PATH, EVENT_PATH, [GROUP_PATH]),
    ]);
    expect(
      evaluateKaplanMeierStatisticAccessRule(
        TIME_PATH,
        EVENT_PATH,
        undefined,
        rule,
      ),
    ).toBe(true);
  });

  it("finds a match when the second allowed entry matches", () => {
    const rule = makeAccessRule([
      makeAllowedPath(OTHER_PATH, OTHER_PATH),
      makeAllowedPath(TIME_PATH, EVENT_PATH),
    ]);
    expect(
      evaluateKaplanMeierStatisticAccessRule(
        TIME_PATH,
        EVENT_PATH,
        undefined,
        rule,
      ),
    ).toBe(true);
  });
});
