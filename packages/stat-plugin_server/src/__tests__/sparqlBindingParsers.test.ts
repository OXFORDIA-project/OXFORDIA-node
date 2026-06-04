import { describe, it, expect } from "vitest";
import {
  parseNumericBindingValue,
  parseStringBindingValue,
} from "../util/sparqlBindingParsers";

describe("parseNumericBindingValue", () => {
  it("returns a direct number binding", () => {
    expect(parseNumericBindingValue({ mean: 3.14 }, "mean")).toBe(3.14);
  });

  it("parses a string numeric binding", () => {
    expect(parseNumericBindingValue({ mean: "2.5" }, "mean")).toBe(2.5);
  });

  it("handles a SPARQL result object with a value field", () => {
    expect(
      parseNumericBindingValue({ mean: { value: "42.0" } }, "mean"),
    ).toBe(42);
  });

  it("returns undefined for Infinity", () => {
    expect(parseNumericBindingValue({ mean: Infinity }, "mean")).toBeUndefined();
  });

  it("returns undefined for NaN string", () => {
    expect(parseNumericBindingValue({ mean: "NaN" }, "mean")).toBeUndefined();
  });

  it("returns undefined when the key is missing", () => {
    expect(parseNumericBindingValue({}, "mean")).toBeUndefined();
  });

  it("returns undefined for a non-numeric string", () => {
    expect(parseNumericBindingValue({ mean: "hello" }, "mean")).toBeUndefined();
  });

  it("falls back to a ?-prefixed key", () => {
    expect(parseNumericBindingValue({ "?count": 7 }, "count")).toBe(7);
  });

  it("falls back to a top-level value field", () => {
    expect(parseNumericBindingValue({ value: 99 } as Record<string, unknown>, "anything")).toBe(99);
  });

  it("handles zero", () => {
    expect(parseNumericBindingValue({ x: 0 }, "x")).toBe(0);
  });
});

describe("parseStringBindingValue", () => {
  it("returns a direct string binding", () => {
    expect(parseStringBindingValue({ label: "hello" }, "label")).toBe("hello");
  });

  it("handles a SPARQL result object with a value field", () => {
    expect(
      parseStringBindingValue({ label: { value: "world" } }, "label"),
    ).toBe("world");
  });

  it("returns undefined when the key is missing", () => {
    expect(parseStringBindingValue({}, "label")).toBeUndefined();
  });

  it("returns undefined for a numeric binding", () => {
    expect(parseStringBindingValue({ label: 42 }, "label")).toBeUndefined();
  });

  it("falls back to a ?-prefixed key", () => {
    expect(parseStringBindingValue({ "?name": "alice" }, "name")).toBe("alice");
  });

  it("returns empty string for an empty string binding", () => {
    expect(parseStringBindingValue({ x: "" }, "x")).toBe("");
  });
});
