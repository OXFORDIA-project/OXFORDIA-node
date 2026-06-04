import { describe, it, expect } from "vitest";
import {
  graphPathsAreEqual,
  graphPathDebugString,
} from "../util/graphPathEquality";
import type { GraphPath } from "@oxfordia/stat-plugin_core";

function simplePath(extra?: Partial<GraphPath>): GraphPath {
  return {
    "@id": "#p",
    start: { "@id": "#s" },
    ...extra,
  } as unknown as GraphPath;
}

describe("graphPathsAreEqual", () => {
  it("considers two identical minimal paths equal", () => {
    const a = simplePath();
    const b = simplePath();
    expect(graphPathsAreEqual(a, b)).toBe(true);
  });

  it("considers paths with the same rdfType equal regardless of @id", () => {
    const a: GraphPath = {
      "@id": "#p1",
      start: { "@id": "#s1", rdfType: ["http://example.org/Person"] },
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p2",
      start: { "@id": "#s2", rdfType: ["http://example.org/Person"] },
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(true);
  });

  it("returns false for paths with different rdfType", () => {
    const a: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s", rdfType: ["http://example.org/Person"] },
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s", rdfType: ["http://example.org/Animal"] },
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(false);
  });

  it("treats rdfType arrays as unordered (sorts before comparing)", () => {
    const a: GraphPath = {
      "@id": "#p",
      start: {
        "@id": "#s",
        rdfType: ["http://example.org/B", "http://example.org/A"],
      },
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: {
        "@id": "#s",
        rdfType: ["http://example.org/A", "http://example.org/B"],
      },
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(true);
  });

  it("considers paths with iri filters equal when iris match", () => {
    const a: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s", iri: ["http://example.org/foo"] },
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s", iri: ["http://example.org/foo"] },
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(true);
  });

  it("returns false when iri filters differ", () => {
    const a: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s", iri: ["http://example.org/foo"] },
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s", iri: ["http://example.org/bar"] },
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(false);
  });

  it("considers paths equal when steps match", () => {
    const step = {
      "@id": "#step",
      via: { "@id": "http://example.org/hasProp" },
    };
    const a: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s" },
      steps: [step],
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s" },
      steps: [step],
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(true);
  });

  it("returns false when step predicates differ", () => {
    const a: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s" },
      steps: [{ "@id": "#step", via: { "@id": "http://example.org/propA" } }],
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s" },
      steps: [{ "@id": "#step", via: { "@id": "http://example.org/propB" } }],
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(false);
  });

  it("considers an inverse step distinct from a non-inverse step", () => {
    const a: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s" },
      steps: [
        {
          "@id": "#step",
          via: { "@id": "http://example.org/prop" },
          inverse: true,
        },
      ],
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s" },
      steps: [{ "@id": "#step", via: { "@id": "http://example.org/prop" } }],
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(false);
  });

  it("considers paths equal when literal target filters match", () => {
    const target = {
      "@id": "#t",
      literal: {
        "@id": "#lit",
        datatype: "http://www.w3.org/2001/XMLSchema#decimal",
      },
    };
    const a: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s" },
      target,
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s" },
      target,
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(true);
  });

  it("treats missing steps and an empty steps array as equal", () => {
    const a: GraphPath = { "@id": "#p", start: { "@id": "#s" } } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s" },
      steps: [],
    } as unknown as GraphPath;
    expect(graphPathsAreEqual(a, b)).toBe(true);
  });
});

describe("graphPathDebugString", () => {
  it("returns a stable string for the same path", () => {
    const path = simplePath();
    expect(graphPathDebugString(path)).toBe(graphPathDebugString(path));
  });

  it("returns the same string for two equivalent paths", () => {
    const a = simplePath();
    const b = simplePath();
    expect(graphPathDebugString(a)).toBe(graphPathDebugString(b));
  });

  it("returns different strings for different paths", () => {
    const a: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s", rdfType: ["http://example.org/A"] },
    } as unknown as GraphPath;
    const b: GraphPath = {
      "@id": "#p",
      start: { "@id": "#s", rdfType: ["http://example.org/B"] },
    } as unknown as GraphPath;
    expect(graphPathDebugString(a)).not.toBe(graphPathDebugString(b));
  });

  it("returns valid JSON", () => {
    const path = simplePath();
    expect(() => JSON.parse(graphPathDebugString(path))).not.toThrow();
  });
});
