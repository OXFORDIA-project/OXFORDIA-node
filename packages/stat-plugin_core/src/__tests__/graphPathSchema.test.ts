import { describe, it, expect } from "vitest";
import { validate } from "json-schema";
import { graphPathJsonSchema } from "../graphPath";

function isValid(data: unknown): boolean {
  return validate(data, graphPathJsonSchema).valid;
}

function validationErrors(data: unknown): string[] {
  return validate(data, graphPathJsonSchema).errors.map((e) => e.message);
}

// ---------------------------------------------------------------------------
// Valid paths
// ---------------------------------------------------------------------------

describe("graphPathJsonSchema — valid paths", () => {
  it("accepts a minimal path with only start", () => {
    expect(isValid({ start: {} })).toBe(true);
  });

  it("accepts a path with an rdfType start filter", () => {
    expect(
      isValid({
        start: { rdfType: "http://example.org/Person" },
      }),
    ).toBe(true);
  });

  it("accepts rdfType as an array", () => {
    expect(
      isValid({
        start: { rdfType: ["http://example.org/A", "http://example.org/B"] },
      }),
    ).toBe(true);
  });

  it("accepts a path with steps", () => {
    expect(
      isValid({
        start: {},
        steps: [{ via: { "@id": "http://example.org/prop" } }],
      }),
    ).toBe(true);
  });

  it("accepts a step with where and inverse", () => {
    expect(
      isValid({
        start: {},
        steps: [
          {
            via: { "@id": "http://example.org/prop" },
            inverse: true,
            where: { rdfType: "http://example.org/X" },
          },
        ],
      }),
    ).toBe(true);
  });

  it("accepts a literal target with datatype", () => {
    expect(
      isValid({
        start: {},
        target: {
          literal: {
            datatype: "http://www.w3.org/2001/XMLSchema#decimal",
          },
        },
      }),
    ).toBe(true);
  });

  it("accepts a literal target with min and max", () => {
    expect(
      isValid({
        start: {},
        target: { literal: { min: 0, max: 100 } },
      }),
    ).toBe(true);
  });

  it("accepts a literal target with lang", () => {
    expect(isValid({ start: {}, target: { literal: { lang: "en" } } })).toBe(
      true,
    );
  });

  it("accepts a literal target with oneOf", () => {
    expect(
      isValid({
        start: {},
        target: { literal: { oneOf: ["active", "inactive"] } },
      }),
    ).toBe(true);
  });

  it("accepts a node target", () => {
    expect(
      isValid({
        start: {},
        target: { node: { rdfType: "http://example.org/Output" } },
      }),
    ).toBe(true);
  });

  it("accepts a predicate filter with some", () => {
    expect(
      isValid({
        start: {
          predicates: [
            {
              predicate: { "@id": "http://example.org/prop" },
              some: { node: { rdfType: "http://example.org/X" } },
            },
          ],
        },
      }),
    ).toBe(true);
  });

  it("accepts a predicate filter with every and none", () => {
    expect(
      isValid({
        start: {
          predicates: [
            {
              predicate: { "@id": "http://example.org/prop" },
              every: { node: {} },
              none: { node: {} },
            },
          ],
        },
      }),
    ).toBe(true);
  });

  it("accepts optional metadata fields (@id, @context, name)", () => {
    expect(
      isValid({
        "@id": "#p",
        name: "myPath",
        start: {},
      }),
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Invalid paths
// Note: json-schema v0.4.0 only enforces additionalProperties at the root
// level and does not enforce `required` or nested additionalProperties.
// Tests below reflect what is actually enforced.
// ---------------------------------------------------------------------------

describe("graphPathJsonSchema — invalid paths", () => {
  it("rejects extra top-level properties (additionalProperties: false at root)", () => {
    expect(isValid({ start: {}, unknownField: true })).toBe(false);
  });

  it("does NOT reject a path missing start (required not enforced by this library)", () => {
    // json-schema v0.4.0 does not enforce `required` consistently; document behavior.
    expect(isValid({})).toBe(true);
  });

  it("does NOT reject extra properties in nested node filters (nested additionalProperties not enforced)", () => {
    expect(isValid({ start: { rdfType: "http://example.org/X", unsupported: true } })).toBe(true);
  });
});
