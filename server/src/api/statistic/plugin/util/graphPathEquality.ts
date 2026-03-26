import type {
  GraphLiteralFilter,
  GraphNodeFilter,
  GraphPath,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
} from "@oxfordia/plugins";
import { oxfordiaContext } from "@oxfordia/plugins";
import {
  compareByKey,
  type IriObject,
  getIriValue,
  isScalarLiteral,
  scalarLiteralSortKey,
  toCollectionArray,
  toRecord,
} from "./ldoHelpers";

type ComparableGraphPath = {
  start: ComparableNodeFilter;
  steps: ComparableStep[];
  target?: ComparableValueSelector;
};

type ComparableNodeFilter = {
  rdfType: string[];
  iri: string[];
  categories: string[];
  predicates: ComparablePredicateFilter[];
};

type ComparablePredicateFilter = {
  predicate?: string;
  inverse: boolean;
  some?: ComparableValueSelector;
  every?: ComparableValueSelector;
  none?: ComparableValueSelector;
};

type ComparableStep = {
  via?: string;
  inverse: boolean;
  where?: ComparableNodeFilter;
};

type ComparableValueSelector =
  | { node: ComparableNodeFilter }
  | { literal: ComparableLiteralFilter };

type ComparableLiteralFilter = {
  datatype: string[];
  lang: string[];
  equals?: string | number | boolean;
  oneOf: Array<string | number | boolean>;
  min?: number;
  max?: number;
};

function contextIdFor(key: string): string | undefined {
  const contextValue = oxfordiaContext[key];
  if (typeof contextValue === "string") return contextValue;
  if (
    contextValue &&
    typeof contextValue === "object" &&
    "@id" in contextValue &&
    typeof contextValue["@id"] === "string"
  ) {
    return contextValue["@id"];
  }
  return undefined;
}

const COMPACT_TERM_MAP = Object.entries(oxfordiaContext).reduce<
  Record<string, string>
>((acc, [key]) => {
  const id = contextIdFor(key);
  if (id) acc[key] = id;
  return acc;
}, {});

function getField<T>(value: unknown, key: string): T | undefined {
  const record = toRecord(value);
  if (!record) return undefined;
  const shortValue = record[key];
  if (shortValue !== undefined) return shortValue as T;
  const iriKey = contextIdFor(key);
  if (!iriKey) return undefined;
  const iriValue = record[iriKey];
  if (iriValue !== undefined) return iriValue as T;
  return undefined;
}

function normalizeIri(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.includes("://")) return value;
  if (value.startsWith("urn:")) return value;
  if (value.startsWith("#")) return value;
  return COMPACT_TERM_MAP[value] ?? value;
}

function normalizeIriObject(
  value: string | IriObject | undefined,
): string | undefined {
  return normalizeIri(getIriValue(value));
}

function normalizeIriCollection(value: unknown): string[] {
  return toCollectionArray(
    value as string | string[] | Iterable<string> | undefined,
  )
    .map((item) => normalizeIri(item) ?? item)
    .sort();
}

function normalizeLiteralFilter(
  filter: GraphLiteralFilter | undefined,
): ComparableLiteralFilter {
  const equals = getField<unknown>(filter, "equals");
  const oneOf = toCollectionArray(
    getField<unknown[] | Iterable<unknown> | unknown>(filter, "oneOf"),
  ).filter(isScalarLiteral);

  oneOf.sort(compareByKey(scalarLiteralSortKey));

  return {
    datatype: normalizeIriCollection(getField(filter, "datatype")),
    lang: normalizeIriCollection(getField(filter, "lang")),
    equals: isScalarLiteral(equals) ? equals : undefined,
    oneOf,
    min: getField<number>(filter, "min"),
    max: getField<number>(filter, "max"),
  };
}

function normalizeValueSelector(
  selector: GraphValueSelector | undefined,
): ComparableValueSelector | undefined {
  const node = getField<GraphNodeFilter>(selector, "node");
  if (node) {
    return { node: normalizeNodeFilter(node) };
  }

  const literal = getField<GraphLiteralFilter>(selector, "literal");
  if (literal) {
    return { literal: normalizeLiteralFilter(literal) };
  }

  return undefined;
}

function normalizePredicateFilter(
  filter: GraphPredicateFilter,
): ComparablePredicateFilter {
  return {
    predicate: normalizeIriObject(
      getField<string | IriObject>(filter, "predicate"),
    ),
    inverse: Boolean(getField<boolean>(filter, "inverse")),
    some: normalizeValueSelector(getField<GraphValueSelector>(filter, "some")),
    every: normalizeValueSelector(
      getField<GraphValueSelector>(filter, "every"),
    ),
    none: normalizeValueSelector(getField<GraphValueSelector>(filter, "none")),
  };
}

function normalizeNodeFilter(
  filter: GraphNodeFilter | undefined,
): ComparableNodeFilter {
  const predicates = toCollectionArray(
    getField<
      | GraphPredicateFilter[]
      | Iterable<GraphPredicateFilter>
      | GraphPredicateFilter
    >(filter, "predicates"),
  )
    .map((item) => normalizePredicateFilter(item))
    .sort(compareByKey((value) => JSON.stringify(value)));

  return {
    rdfType: normalizeIriCollection(getField(filter, "rdfType")),
    iri: normalizeIriCollection(getField(filter, "iri")),
    categories: normalizeIriCollection(getField(filter, "categories")),
    predicates,
  };
}

function normalizeTraversalStep(step: GraphTraversalStep): ComparableStep {
  return {
    via: normalizeIriObject(getField<string | IriObject>(step, "via")),
    inverse: Boolean(getField<boolean>(step, "inverse")),
    where: (() => {
      const where = getField<GraphNodeFilter>(step, "where");
      return where ? normalizeNodeFilter(where) : undefined;
    })(),
  };
}

function normalizeGraphPath(graphPath: GraphPath): ComparableGraphPath {
  const steps = toCollectionArray(
    getField<
      GraphTraversalStep[] | Iterable<GraphTraversalStep> | GraphTraversalStep
    >(graphPath, "steps"),
  )
    .map((step) => normalizeTraversalStep(step))
    .sort(compareByKey((value) => JSON.stringify(value)));

  return {
    start: normalizeNodeFilter(
      getField<GraphNodeFilter>(graphPath, "start") ?? {},
    ),
    steps,
    target: normalizeValueSelector(
      getField<GraphValueSelector>(graphPath, "target"),
    ),
  };
}

export function graphPathsAreEqual(left: GraphPath, right: GraphPath): boolean {
  return (
    JSON.stringify(normalizeGraphPath(left)) ===
    JSON.stringify(normalizeGraphPath(right))
  );
}

export function graphPathDebugString(graphPath: GraphPath): string {
  return JSON.stringify(normalizeGraphPath(graphPath));
}
