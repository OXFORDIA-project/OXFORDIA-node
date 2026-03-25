import type {
  AllowedPath,
  GraphLiteralFilter,
  GraphNodeFilter,
  GraphPath,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
  MeanStatisticAccessRule,
} from "@oxfordia/types";

type IriObject = { "@id": string };
type ScalarLiteral = string | number | boolean;

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
const STATP_NODE_KEY = "https://oxfordia.setmeld.com/statistics#node";
const STATP_LITERAL_KEY = "https://oxfordia.setmeld.com/statistics#literal";
const STATP_DATATYPE_KEY = `${STATP_PREFIX}datatype`;
const STATP_LANG_KEY = `${STATP_PREFIX}lang`;
const STATP_EQUALS_KEY = `${STATP_PREFIX}equals`;
const STATP_ONE_OF_KEY = `${STATP_PREFIX}oneOf`;
const STATP_MIN_KEY = `${STATP_PREFIX}min`;
const STATP_MAX_KEY = `${STATP_PREFIX}max`;
const STATP_MIN_COUNT_KEY = `${STATP_PREFIX}minCount`;

function findMatchingMeanAllowedPath(
  queryGraphPath: GraphPath,
  statisticAccessRule: MeanStatisticAccessRule,
): AllowedPath | undefined {
  const querySignature = graphPathSignature(queryGraphPath);
  const allowedPaths = toCollectionArray(statisticAccessRule.allowedPath);
  return allowedPaths.find((allowedPath) => {
    if (!allowedPath?.graphPath) return false;
    return graphPathSignature(allowedPath.graphPath) === querySignature;
  });
}

function readAllowedPathMinCount(allowedPath: AllowedPath): number {
  const record = toRecord(allowedPath as unknown);
  const raw = record
    ? readProperty<number>(record, "minCount", STATP_MIN_COUNT_KEY)
    : allowedPath.minCount;
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return Number.NaN;
  }
  return Math.max(0, Math.floor(raw));
}

export function evaluateMeanStatisticAccessRulePostQuery(
  queryGraphPath: GraphPath,
  statisticAccessRule: MeanStatisticAccessRule,
  output: { count: number },
): true | Error {
  const match = findMatchingMeanAllowedPath(
    queryGraphPath,
    statisticAccessRule,
  );
  if (!match) {
    return new Error(
      "Requested graphPath is not allowed by mean statistic policy.",
    );
  }
  const minCount = readAllowedPathMinCount(match);
  if (!Number.isFinite(minCount)) {
    return new Error(
      "Mean statistic policy is missing a valid minCount for the matched allowed path.",
    );
  }
  if (output.count < minCount) {
    return new Error(
      `Sample count (${output.count}) is below the policy minimum (${minCount}) for this mean statistic.`,
    );
  }
  return true;
}

function debugLog(payload: {
  runId: string;
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
}): void {
  // #region agent log
  fetch("http://127.0.0.1:7246/ingest/1a0f9c29-0ae3-48eb-b88e-09395ef55ec4", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "c2380b",
    },
    body: JSON.stringify({
      sessionId: "c2380b",
      ...payload,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

function toCollectionArray<T>(value: T | T[] | Iterable<T> | undefined): T[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value as T];
  if (typeof value === "object" && Symbol.iterator in (value as object)) {
    return Array.from(value as Iterable<T>);
  }
  return [value as T];
}

function getIriValue(
  value: string | IriObject | undefined,
): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof value["@id"] === "string") {
    return value["@id"];
  }
  return undefined;
}

function scalarLiteralSortKey(value: ScalarLiteral): string {
  return `${typeof value}:${String(value)}`;
}

function compareByKey<T>(toKey: (value: T) => string) {
  return (a: T, b: T): number => toKey(a).localeCompare(toKey(b));
}

function readProperty<T>(
  record: Record<string, unknown>,
  shortKey: string,
  fullKey: string,
): T | undefined {
  // LDO proxy objects may resolve properties through getters without reporting them via `in`.
  const shortValue = record[shortKey];
  if (shortValue !== undefined) return shortValue as T;
  const fullValue = record[fullKey];
  if (fullValue !== undefined) return fullValue as T;
  return undefined;
}

function toRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") return undefined;
  return value as Record<string, unknown>;
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
    predicate: getIriValue(predicateValue),
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
    .map((step) => ({
      stepRecord: toRecord(step as unknown) ?? {},
      via: getIriValue(
        readProperty<string | IriObject>(
          toRecord(step as unknown) ?? {},
          "via",
          STATP_VIA_KEY,
        ),
      ),
      inverse: Boolean(
        readProperty<boolean>(
          toRecord(step as unknown) ?? {},
          "inverse",
          STATP_INVERSE_KEY,
        ),
      ),
      where: readProperty<GraphNodeFilter>(
        toRecord(step as unknown) ?? {},
        "where",
        STATP_WHERE_KEY,
      )
        ? normalizeNodeFilter(
            readProperty<GraphNodeFilter>(
              toRecord(step as unknown) ?? {},
              "where",
              STATP_WHERE_KEY,
            ),
          )
        : undefined,
    }))
    .map(({ stepRecord: _stepRecord, ...rest }) => rest)
    .sort(compareByKey((value) => JSON.stringify(value)));

  return {
    start: normalizeNodeFilter(startFilter),
    steps,
    target: normalizeValueSelector(targetValue),
  };
}

function graphPathSignature(graphPath: GraphPath): string {
  return JSON.stringify(normalizeGraphPath(graphPath));
}

function summarizeRawGraphPath(graphPath: GraphPath): Record<string, unknown> {
  const startPredicates = toCollectionArray(graphPath.start?.predicates);
  const startSummary = startPredicates.map((filter) => {
    const someRecord =
      filter.some && typeof filter.some === "object"
        ? (filter.some as Record<string, unknown>)
        : undefined;
    const selector = normalizeValueSelector(filter.some);
    if (selector && "node" in selector) {
      return {
        predicate: getIriValue(filter.predicate),
        hasSome: true,
        someKeys: someRecord ? Object.keys(someRecord) : [],
        someHasNodeShortKey: Boolean(someRecord?.node),
        someHasNodeFullKey: Boolean(someRecord?.[STATP_NODE_KEY]),
        someNodeIri: selector.node.iri,
      };
    }
    return {
      predicate: getIriValue(filter.predicate),
      hasSome: Boolean(filter.some),
      someKeys: someRecord ? Object.keys(someRecord) : [],
      someHasNodeShortKey: Boolean(someRecord?.node),
      someHasNodeFullKey: Boolean(someRecord?.[STATP_NODE_KEY]),
      someHasLiteralShortKey: Boolean(someRecord?.literal),
      someHasLiteralFullKey: Boolean(someRecord?.[STATP_LITERAL_KEY]),
      someNodeIri: [],
    };
  });

  const stepsSummary = toCollectionArray(graphPath.steps).map((step) => {
    const wherePredicates = toCollectionArray(step.where?.predicates).map(
      (filter) => ({
        predicate: getIriValue(filter.predicate),
        hasSome: Boolean(filter.some),
      }),
    );
    return {
      via: getIriValue(step.via),
      hasWhere: Boolean(step.where),
      wherePredicates,
    };
  });

  return {
    startPredicates: startSummary,
    steps: stepsSummary,
  };
}

export function evaluateMeanStatisticAccessRule(
  queryGraphPath: GraphPath,
  statisticAccessRule: MeanStatisticAccessRule,
): true | Error {
  const location =
    "evaluateMeanStatisticAccessRule.ts:evaluateMeanStatisticAccessRule";
  const allowedPaths = toCollectionArray(statisticAccessRule.allowedPath);
  debugLog({
    runId: "initial",
    hypothesisId: "H1",
    location,
    message: "Evaluator entry",
    data: {
      allowedPathCount: allowedPaths.length,
      queryHasStart: Boolean(queryGraphPath.start),
      queryStepCount: toCollectionArray(queryGraphPath.steps).length,
    },
  });

  if (allowedPaths.length === 0) {
    debugLog({
      runId: "initial",
      hypothesisId: "H4",
      location,
      message: "Rejected due to empty allowedPath list",
      data: {},
    });
    return new Error("No allowed graph paths are configured for mean.");
  }

  debugLog({
    runId: "initial",
    hypothesisId: "H6",
    location,
    message: "Raw graph path summaries before normalization",
    data: {
      querySummary: summarizeRawGraphPath(queryGraphPath),
      allowedSummaries: allowedPaths
        .filter((allowedPath) => Boolean(allowedPath?.graphPath))
        .map((allowedPath) =>
          summarizeRawGraphPath(allowedPath.graphPath as GraphPath),
        ),
    },
  });

  const querySignature = graphPathSignature(queryGraphPath);
  debugLog({
    runId: "initial",
    hypothesisId: "H2",
    location,
    message: "Computed query graph path signature",
    data: {
      querySignature,
    },
  });

  const candidateSignatures: string[] = [];
  for (const allowedPath of allowedPaths) {
    if (!allowedPath?.graphPath) continue;
    candidateSignatures.push(graphPathSignature(allowedPath.graphPath));
  }
  const match = findMatchingMeanAllowedPath(
    queryGraphPath,
    statisticAccessRule,
  );
  const isAllowed = Boolean(match);

  debugLog({
    runId: "initial",
    hypothesisId: "H3",
    location,
    message: "Compared query signature against allowed signatures",
    data: {
      isAllowed,
      allowedSignatureCount: candidateSignatures.length,
      candidateSignatures,
    },
  });

  if (!isAllowed) {
    debugLog({
      runId: "initial",
      hypothesisId: "H5",
      location,
      message: "Rejected: no signature match",
      data: {
        querySignature,
      },
    });
    return new Error(
      "Requested graphPath is not allowed by mean statistic policy.",
    );
  }

  debugLog({
    runId: "initial",
    hypothesisId: "H3",
    location,
    message: "Allowed: found signature match",
    data: {},
  });
  return true;
}
