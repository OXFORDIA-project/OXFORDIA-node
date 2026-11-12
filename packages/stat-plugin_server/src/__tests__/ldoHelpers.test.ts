import { describe, it, expect } from "vitest";
import {
  toCollectionArray,
  isIriObject,
  getIriValue,
  isScalarLiteral,
  toRecord,
  readProperty,
  compareByKey,
  scalarLiteralSortKey,
} from "../util/ldoHelpers";

describe("toCollectionArray", () => {
  it("returns [] for undefined", () => {
    expect(toCollectionArray(undefined)).toEqual([]);
  });

  it("returns [] for null", () => {
    expect(toCollectionArray(null as unknown as undefined)).toEqual([]);
  });

  it("wraps a single non-array non-string value in an array", () => {
    expect(toCollectionArray(42)).toEqual([42]);
  });

  it("returns an array as-is", () => {
    expect(toCollectionArray(["a", "b"])).toEqual(["a", "b"]);
  });

  it("wraps a single string as a single-element array", () => {
    expect(toCollectionArray("hello")).toEqual(["hello"]);
  });

  it("converts a Set (iterable) to an array", () => {
    const s = new Set([1, 2, 3]);
    expect(toCollectionArray(s)).toEqual([1, 2, 3]);
  });

  it("converts a custom iterable to an array", () => {
    function* gen() {
      yield "x";
      yield "y";
    }
    expect(toCollectionArray(gen())).toEqual(["x", "y"]);
  });
});

describe("isIriObject", () => {
  it("returns true for objects with a string @id", () => {
    expect(isIriObject({ "@id": "http://example.org/" })).toBe(true);
  });

  it("returns false for plain strings", () => {
    expect(isIriObject("http://example.org/")).toBe(false);
  });

  it("returns false for objects without @id", () => {
    expect(isIriObject({ name: "foo" })).toBe(false);
  });

  it("returns false for null", () => {
    expect(isIriObject(null)).toBe(false);
  });

  it("returns false for objects where @id is not a string", () => {
    expect(isIriObject({ "@id": 42 })).toBe(false);
  });
});

describe("getIriValue", () => {
  it("returns a plain string unchanged", () => {
    expect(getIriValue("http://example.org/")).toBe("http://example.org/");
  });

  it("returns the @id from an IRI object", () => {
    expect(getIriValue({ "@id": "http://example.org/" })).toBe(
      "http://example.org/",
    );
  });

  it("returns undefined for undefined", () => {
    expect(getIriValue(undefined)).toBeUndefined();
  });
});

describe("isScalarLiteral", () => {
  it("accepts strings", () => {
    expect(isScalarLiteral("hello")).toBe(true);
  });

  it("accepts numbers", () => {
    expect(isScalarLiteral(3.14)).toBe(true);
  });

  it("accepts booleans", () => {
    expect(isScalarLiteral(false)).toBe(true);
  });

  it("rejects objects", () => {
    expect(isScalarLiteral({})).toBe(false);
  });

  it("rejects null", () => {
    expect(isScalarLiteral(null)).toBe(false);
  });

  it("rejects undefined", () => {
    expect(isScalarLiteral(undefined)).toBe(false);
  });
});

describe("toRecord", () => {
  it("returns the object itself for plain objects", () => {
    const obj = { a: 1 };
    expect(toRecord(obj)).toBe(obj);
  });

  it("returns undefined for null", () => {
    expect(toRecord(null)).toBeUndefined();
  });

  it("returns undefined for strings", () => {
    expect(toRecord("hello")).toBeUndefined();
  });

  it("returns undefined for numbers", () => {
    expect(toRecord(42)).toBeUndefined();
  });
});

describe("readProperty", () => {
  it("returns value from the short key first", () => {
    const record = { name: "short", "https://example.org/name": "long" };
    expect(readProperty(record, "name", "https://example.org/name")).toBe(
      "short",
    );
  });

  it("falls back to the full IRI key", () => {
    const record = { "https://example.org/name": "long" };
    expect(readProperty(record, "name", "https://example.org/name")).toBe(
      "long",
    );
  });

  it("returns undefined when neither key exists", () => {
    expect(readProperty({}, "name", "https://example.org/name")).toBeUndefined();
  });
});

describe("scalarLiteralSortKey", () => {
  it("prefixes strings with 'string:'", () => {
    expect(scalarLiteralSortKey("hello")).toBe("string:hello");
  });

  it("prefixes numbers with 'number:'", () => {
    expect(scalarLiteralSortKey(42)).toBe("number:42");
  });

  it("prefixes booleans with 'boolean:'", () => {
    expect(scalarLiteralSortKey(true)).toBe("boolean:true");
  });
});

describe("compareByKey", () => {
  it("sorts an array of strings by a key function", () => {
    const items = ["banana", "apple", "cherry"];
    const sorted = [...items].sort(compareByKey((s) => s));
    expect(sorted).toEqual(["apple", "banana", "cherry"]);
  });

  it("returns negative when a comes before b", () => {
    const cmp = compareByKey((s: string) => s);
    expect(cmp("apple", "banana")).toBeLessThan(0);
  });

  it("returns positive when a comes after b", () => {
    const cmp = compareByKey((s: string) => s);
    expect(cmp("cherry", "apple")).toBeGreaterThan(0);
  });

  it("returns zero for equal keys", () => {
    const cmp = compareByKey((s: string) => s);
    expect(cmp("same", "same")).toBe(0);
  });
});
