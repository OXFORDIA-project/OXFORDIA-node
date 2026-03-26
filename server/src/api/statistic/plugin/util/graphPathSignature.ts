import type {
  GraphLiteralFilter,
  GraphNodeFilter,
  GraphPath,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
} from "@oxfordia/types";
import {
  type IriObject,
  type ScalarLiteral,
  toCollectionArray,
  getIriValue,
  toRecord,
  readProperty,
  scalarLiteralSortKey,
  compareByKey,
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
  equals?: ScalarLiteral;
  oneOf: ScalarLiteral[];
  min?: number;
  max?: number;
};

const STATP_PREFIX = "https://oxfordia.setmeld.com/statistics#";
const STATP_START_KEY = `${STATP_PREFIX}start`;
const STATP_STEPS_KEY = `${STATP_PREFIX}steps`;
const STATP_TARGET_KEY = `${STATP_PREFIX}target`;
const STATP_RDF_TYPE_KEY = `${STATP_PREFIX}rdfType`;
const STATP_IRI_KEY = `${STATP_PREFIX}iri`;
const STATP_CATEGORIES_KEY = `${STATP_PREFIX}categories`;
const STATP_PREDICATES_KEY = `${STATP_PREFIX}predicates`;
const STATP_PREDICATE_KEY = `${STATP_PREFIX}predicate`;
const STATP_SOME_KEY = `${STATP_PREFIX}some`;
const STATP_EVERY_KEY = `${STATP_PREFIX}every`;
const STATP_NONE_KEY = `${STATP_PREFIX}none`;
const STATP_VIA_KEY = `${STATP_PREFIX}via`;
const STATP_WHERE_KEY = `${STATP_PREFIX}where`;
const STATP_INVERSE_KEY = `${STATP_PREFIX}inverse`;
const STATP_NODE_KEY = `${STATP_PREFIX}node`;
const STATP_LITERAL_KEY = `${STATP_PREFIX}literal`;
const STATP_DATATYPE_KEY = `${STATP_PREFIX}datatype`;
const STATP_LANG_KEY = `${STATP_PREFIX}lang`;
const STATP_EQUALS_KEY = `${STATP_PREFIX}equals`;
const STATP_ONE_OF_KEY = `${STATP_PREFIX}oneOf`;
const STATP_MIN_KEY = `${STATP_PREFIX}min`;
const STATP_MAX_KEY = `${STATP_PREFIX}max`;

const COMPACT_IRI_MAP: Record<string, string> = {
  type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
  rdfType: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
  isCategorizedBy:
    "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
  hasParticipant:
    "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
  hasMagnitude: "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
  hasAspect: "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
  numericValue: "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
  produces: "https://w3id.org/semanticarts/ns/ontology/gist/produces",
};

function normalizeIri(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.includes("://")) return value;
  if (value.startsWith("urn:")) return value;
  if (value.startsWith("#")) return value;
  return COMPACT_IRI_MAP[value] ?? value;
}

function normalizeLiteralFilter(
  filter: GraphLiteralFilter | undefined,
): ComparableLiteralFilter {
  const filterRecord = toRecord(filter);
  const oneOf = toCollectionArray(
    filterRecord
      ? readProperty<unknown>(filterRecord, "oneOf", STATP_ONE_OF_KEY)
      : filter?.oneOf,
  ).filter(
    (value): value is ScalarLiteral =>
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean",
  );
  oneOf.sort(compareByKey(scalarLiteralSortKey));
  const equalsValue = filterRecord
    ? readProperty<unknown>(filterRecord, "equals", STATP_EQUALS_KEY)
    : filter?.equals;
  return {
    datatype: toCollectionArray(
      filterRecord
        ? readProperty<string | string[] | Iterable<string>>(
            filterRecord,
            "datatype",
            STATP_DATATYPE_KEY,
          )
        : filter?.datatype,
    ).sort(),
    lang: toCollectionArray(
      filterRecord
        ? readProperty<string | string[] | Iterable<string>>(
            filterRecord,
            "lang",
            STATP_LANG_KEY,
          )
        : filter?.lang,
    ).sort(),
    equals:
      typeof equalsValue === "string" ||
      typeof equalsValue === "number" ||
      typeof equalsValue === "boolean"
        ? equalsValue
        : undefined,
    oneOf,
    min: filterRecord
      ? readProperty<number>(filterRecord, "min", STATP_MIN_KEY)
      : filter?.min,
    max: filterRecord
      ? readProperty<number>(filterRecord, "max", STATP_MAX_KEY)
      : filter?.max,
  };
}

function normalizeValueSelector(
  selector: GraphValueSelector | undefined,
): ComparableValueSelector | undefined {
  if (!selector || typeof selector !== "object") return undefined;
  const selectorRecord = selector as Record<string, unknown>;
  const nodeValue = readProperty<unknown>(
    selectorRecord,
    "node",
    STATP_NODE_KEY,
  );
  const literalValue = readProperty<unknown>(
    selectorRecord,
    "literal",
    STATP_LITERAL_KEY,
  );
  if (nodeValue) {
    return {
      node: normalizeNodeFilter(nodeValue as GraphNodeFilter),
    };
  }
  if (literalValue) {
    return {
      literal: normalizeLiteralFilter(literalValue as GraphLiteralFilter),
    };
  }
  return undefined;
}

function normalizePredicateFilter(
  filter: GraphPredicateFilter,
): ComparablePredicateFilter {
  const filterRecord = toRecord(filter as unknown);
  const predicateValue = filterRecord
    ? readProperty<string | IriObject>(
        filterRecord,
        "predicate",
        STATP_PREDICATE_KEY,
      )
    : filter.predicate;
  const someValue = filterRecord
    ? readProperty<GraphValueSelector>(filterRecord, "some", STATP_SOME_KEY)
    : filter.some;
  const everyValue = filterRecord
    ? readProperty<GraphValueSelector>(filterRecord, "every", STATP_EVERY_KEY)
    : filter.every;
  const noneValue = filterRecord
    ? readProperty<GraphValueSelector>(filterRecord, "none", STATP_NONE_KEY)
    : filter.none;
  const inverseValue = filterRecord
    ? readProperty<boolean>(filterRecord, "inverse", STATP_INVERSE_KEY)
    : filter.inverse;

  return {
    predicate: normalizeIri(getIriValue(predicateValue)),
    inverse: Boolean(inverseValue),
    some: normalizeValueSelector(someValue),
    every: normalizeValueSelector(everyValue),
    none: normalizeValueSelector(noneValue),
  };
}

function normalizeNodeFilter(
  filter: GraphNodeFilter | undefined,
): ComparableNodeFilter {
  const filterRecord = toRecord(filter);
  const predicates = toCollectionArray(
    filterRecord
      ? readProperty<
          | GraphPredicateFilter
          | GraphPredicateFilter[]
          | Iterable<GraphPredicateFilter>
        >(filterRecord, "predicates", STATP_PREDICATES_KEY)
      : filter?.predicates,
  )
    .map((item) => normalizePredicateFilter(item))
    .sort(compareByKey((value) => JSON.stringify(value)));
  return {
    rdfType: toCollectionArray(
      filterRecord
        ? readProperty<string | string[] | Iterable<string>>(
            filterRecord,
            "rdfType",
            STATP_RDF_TYPE_KEY,
          )
        : filter?.rdfType,
    ).sort(),
    iri: toCollectionArray(
      filterRecord
        ? readProperty<string | string[] | Iterable<string>>(
            filterRecord,
            "iri",
            STATP_IRI_KEY,
          )
        : filter?.iri,
    ).sort(),
    categories: toCollectionArray(
      filterRecord
        ? readProperty<string | string[] | Iterable<string>>(
            filterRecord,
            "categories",
            STATP_CATEGORIES_KEY,
          )
        : filter?.categories,
    ).sort(),
    predicates,
  };
}

function normalizeGraphPath(graphPath: GraphPath): ComparableGraphPath {
  const graphPathRecord = toRecord(graphPath as unknown) ?? {};
  const startFilter =
    readProperty<GraphNodeFilter>(graphPathRecord, "start", STATP_START_KEY) ??
    {};
  const stepsValue = readProperty<
    GraphPath["steps"] | GraphTraversalStep[] | Iterable<GraphTraversalStep>
  >(graphPathRecord, "steps", STATP_STEPS_KEY);
  const targetValue = readProperty<GraphValueSelector>(
    graphPathRecord,
    "target",
    STATP_TARGET_KEY,
  );

  // `steps` is an LdSet in generated typings, so normalize order before comparison.
  const steps = toCollectionArray(stepsValue)
    .map((step) => {
      const stepRecord = toRecord(step as unknown) ?? {};
      return {
        via: normalizeIri(
          getIriValue(
            readProperty<string | IriObject>(stepRecord, "via", STATP_VIA_KEY),
          ),
        ),
        inverse: Boolean(
          readProperty<boolean>(stepRecord, "inverse", STATP_INVERSE_KEY),
        ),
        where: readProperty<GraphNodeFilter>(
          stepRecord,
          "where",
          STATP_WHERE_KEY,
        )
          ? normalizeNodeFilter(
              readProperty<GraphNodeFilter>(
                stepRecord,
                "where",
                STATP_WHERE_KEY,
              ),
            )
          : undefined,
      };
    })
    .sort(compareByKey((value) => JSON.stringify(value)));

  return {
    start: normalizeNodeFilter(startFilter),
    steps,
    target: normalizeValueSelector(targetValue),
  };
}

/**
 * Produce a deterministic JSON string signature for a GraphPath.
 * Two graph paths that are structurally equivalent (regardless of
 * property key style or collection ordering) yield the same signature.
 */
export function graphPathSignature(graphPath: GraphPath): string {
  return JSON.stringify(normalizeGraphPath(graphPath));
}
