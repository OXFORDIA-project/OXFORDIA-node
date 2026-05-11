import { describe, it, expect } from "vitest";
import { findMatchingAllowedPath } from "../util/evaluateAllowedPaths";
import type { GraphPath } from "@oxfordia/stat-plugin_core";

function makePath(rdfType: string): GraphPath {
  return {
    "@id": "#p",
    start: { "@id": "#s", rdfType: [rdfType] },
  } as unknown as GraphPath;
}

describe("findMatchingAllowedPath", () => {
  it("finds an entry whose graphPath matches the query path", () => {
    const queryPath = makePath("http://example.org/Person");
    const entry = { graphPath: makePath("http://example.org/Person"), minCount: 5 };
    const result = findMatchingAllowedPath(queryPath, [entry]);
    expect(result).toBe(entry);
  });

  it("returns undefined when no entry matches", () => {
    const queryPath = makePath("http://example.org/Animal");
    const entry = { graphPath: makePath("http://example.org/Person") };
    expect(findMatchingAllowedPath(queryPath, [entry])).toBeUndefined();
  });

  it("returns undefined for an empty allowed list", () => {
    const queryPath = makePath("http://example.org/Person");
    expect(findMatchingAllowedPath(queryPath, [])).toBeUndefined();
  });

  it("returns undefined for entries without a graphPath", () => {
    const queryPath = makePath("http://example.org/Person");
    const entry = { graphPath: undefined };
    expect(findMatchingAllowedPath(queryPath, [entry])).toBeUndefined();
  });

  it("finds the first matching entry when there are multiple", () => {
    const queryPath = makePath("http://example.org/Person");
    const first = {
      graphPath: makePath("http://example.org/Person"),
      minCount: 1,
    };
    const second = {
      graphPath: makePath("http://example.org/Person"),
      minCount: 2,
    };
    expect(findMatchingAllowedPath(queryPath, [first, second])).toBe(first);
  });

  it("skips non-matching entries and returns a later match", () => {
    const queryPath = makePath("http://example.org/Person");
    const nonMatch = { graphPath: makePath("http://example.org/Animal") };
    const match = { graphPath: makePath("http://example.org/Person") };
    expect(findMatchingAllowedPath(queryPath, [nonMatch, match])).toBe(match);
  });
});
