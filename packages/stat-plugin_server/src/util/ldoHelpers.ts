export type IriObject = { "@id": string };
export type ScalarLiteral = string | number | boolean;

/**
 * Normalize LDO collection values (single item, array, or iterable) into a plain array.
 * Handles LdSet and other iterable wrappers produced by LDO proxy objects.
 */
export function toCollectionArray<T>(
  value: T | T[] | Iterable<T> | undefined,
): T[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value as T];
  if (typeof value === "object" && Symbol.iterator in (value as object)) {
    return Array.from(value as Iterable<T>);
  }
  return [value as T];
}

export function isIriObject(value: unknown): value is IriObject {
  if (!value || typeof value !== "object") return false;
  const maybe = value as Record<string, unknown>;
  return typeof maybe["@id"] === "string";
}

export function getIriValue(
  value: string | IriObject | undefined,
): string | undefined {
  if (typeof value === "string") return value;
  if (isIriObject(value)) return value["@id"];
  return undefined;
}

export function isScalarLiteral(value: unknown): value is ScalarLiteral {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function toRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") return undefined;
  return value as Record<string, unknown>;
}

/**
 * Read a property from an LDO proxy record, trying the short (JS) key first
 * then falling back to the full (IRI) key. LDO proxies resolve properties
 * through getters without reporting them via `in`.
 */
export function readProperty<T>(
  record: Record<string, unknown>,
  shortKey: string,
  fullKey: string,
): T | undefined {
  const shortValue = record[shortKey];
  if (shortValue !== undefined) return shortValue as T;
  const fullValue = record[fullKey];
  if (fullValue !== undefined) return fullValue as T;
  return undefined;
}

export function scalarLiteralSortKey(value: ScalarLiteral): string {
  return `${typeof value}:${String(value)}`;
}

export function compareByKey<T>(
  toKey: (value: T) => string,
): (a: T, b: T) => number {
  return (a: T, b: T): number => toKey(a).localeCompare(toKey(b));
}
