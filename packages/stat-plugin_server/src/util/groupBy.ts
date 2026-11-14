import type { JSONSchema4 } from "json-schema";
import {
  graphPathJsonSchema,
  type GraphPath,
} from "@oxfordia/stat-plugin_core";
import { findMatchingAllowedPath } from "./evaluateAllowedPaths";
import { graphPathDebugString, graphPathsAreEqual } from "./graphPathEquality";
import { toCollectionArray } from "./ldoHelpers";
import { parseStringBindingValue } from "./sparqlBindingParsers";
import type { QueryPathBinding, QuerySelectField } from "./statisticSparqlQuery";

// Shared group-by support for aggregate statistics (count, mean, standard
// deviation). A query may name up to MAX_GROUP_BY_PATHS group-by graph paths;
// each must appear in the matched allowed path's groupByGraphPath set. Every
// path shares the same start subject, so the aggregate is computed per
// combination of group values (participants without a value are excluded).

export const MAX_GROUP_BY_PATHS = 2;

export const groupByPathsJsonSchema: JSONSchema4 = {
  anyOf: [
    { type: "array", items: graphPathJsonSchema, maxItems: MAX_GROUP_BY_PATHS },
    graphPathJsonSchema,
    // R serialises list(groupByPaths = NULL) as {} or null.
    { type: "object", additionalProperties: false, maxProperties: 0 },
    { type: "null" },
  ],
};

export interface GroupedStatisticQuery {
  graphPath: GraphPath;
  groupByPaths?: GraphPath[];
}

export interface StatisticGroupKey {
  /** Raw group values (IRIs or literal values), one per group-by path. */
  values: string[];
  /** Human-readable labels for `values`. */
  labels: string[];
}

/** A released group, or a placeholder for one withheld by disclosure control. */
export type StatisticGroup<T> =
  | (StatisticGroupKey & T & { suppressed?: false })
  | (StatisticGroupKey & { suppressed: true });

function isEmptyGroupByValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  return typeof value === "object" && Object.keys(value).length === 0;
}

/**
 * Remove an empty `groupByPaths` and wrap a single path in an array, so
 * downstream code sees either `undefined` or a non-empty array.
 */
export function normalizeGroupByPathsQuery(query: unknown): unknown {
  if (!query || typeof query !== "object" || Array.isArray(query)) {
    return query;
  }
  const record = query as Record<string, unknown>;
  if (!("groupByPaths" in record)) return query;
  const normalized = { ...record };
  if (isEmptyGroupByValue(record.groupByPaths)) {
    delete normalized.groupByPaths;
  } else if (!Array.isArray(record.groupByPaths)) {
    normalized.groupByPaths = [record.groupByPaths];
  }
  return normalized;
}

export function readGroupByPaths(query: { groupByPaths?: GraphPath[] }): GraphPath[] {
  return query.groupByPaths ?? [];
}

export interface GroupedAllowedPathEntry {
  graphPath?: GraphPath;
  groupByGraphPath?: GraphPath | Iterable<GraphPath>;
}

function allowsGroupBy(entry: GroupedAllowedPathEntry, groupByPaths: GraphPath[]): boolean {
  const allowed = toCollectionArray(entry.groupByGraphPath);
  return groupByPaths.every((requested) =>
    allowed.some((candidate) => candidate && graphPathsAreEqual(candidate, requested)),
  );
}

/** Allowed path whose graphPath matches and whose group-by set covers the query. */
export function findMatchingGroupedAllowedPath<T extends GroupedAllowedPathEntry>(
  queryGraphPath: GraphPath,
  groupByPaths: GraphPath[],
  allowedPaths: T[],
): T | undefined {
  return allowedPaths.find(
    (entry) =>
      findMatchingAllowedPath(queryGraphPath, [entry]) !== undefined &&
      allowsGroupBy(entry, groupByPaths),
  );
}

function summarize(graphPath: GraphPath): string {
  const text = graphPathDebugString(graphPath);
  return text.length <= 220 ? text : `${text.slice(0, 220)}...`;
}

/**
 * Pre-query authorization for a grouped statistic, distinguishing a
 * disallowed graphPath from a disallowed group-by.
 */
export function evaluateGroupedAllowedPath<T extends GroupedAllowedPathEntry>(
  statisticLabel: string,
  queryGraphPath: GraphPath,
  groupByPaths: GraphPath[],
  allowedPaths: T[],
): T | Error {
  if (allowedPaths.length === 0) {
    return new Error(`No allowed graph paths are configured for ${statisticLabel}.`);
  }
  if (groupByPaths.length > MAX_GROUP_BY_PATHS) {
    return new Error(
      `At most ${MAX_GROUP_BY_PATHS} groupByPaths are supported (got ${groupByPaths.length}).`,
    );
  }
  const match = findMatchingGroupedAllowedPath(queryGraphPath, groupByPaths, allowedPaths);
  if (match) return match;
  if (!findMatchingAllowedPath(queryGraphPath, allowedPaths)) {
    return new Error(`Requested graphPath is not allowed by ${statisticLabel} statistic policy.`);
  }
  const disallowed = groupByPaths.find(
    (requested) => !allowedPaths.some((entry) => allowsGroupBy(entry, [requested])),
  );
  return new Error(
    disallowed
      ? `Requested groupByPath is not allowed for this graphPath by ${statisticLabel} statistic policy. groupByPath=${summarize(disallowed)}`
      : `Requested combination of groupByPaths is not allowed for this graphPath by ${statisticLabel} statistic policy.`,
  );
}

const GROUP_KEY_PREFIX = "group";

/** Path bindings and projections for the group-by paths of a query. */
export function buildGroupByQueryParts(
  groupByPaths: GraphPath[],
  startVar: string,
): { pathBindings: QueryPathBinding[]; selectFields: QuerySelectField[]; keys: string[] } {
  const keys = groupByPaths.map((_, index) => `${GROUP_KEY_PREFIX}${index}`);
  return {
    keys,
    pathBindings: groupByPaths.map((graphPath, index) => ({
      key: keys[index],
      graphPath,
      startVar,
      variableNamespace: `g${index}_`,
    })),
    selectFields: keys.map((key) => ({
      alias: key,
      expression: (vars: Record<string, string>) => vars[key]!,
    })),
  };
}

/**
 * "…/terms/Gene_NEB" → "NEB", "…/CurrentFunction_NonSitter" → "Non Sitter".
 * Literal values are returned unchanged.
 */
export function groupValueLabel(value: string): string {
  if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  const local = value.split(/[/#]/).pop() ?? value;
  const underscore = local.indexOf("_");
  const term = underscore >= 0 ? local.slice(underscore + 1) : local;
  return term.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim() || local;
}

/** Group key of a result row, or undefined if any group value is missing. */
export function readGroupKey(
  row: Record<string, unknown>,
  keyCount: number,
): StatisticGroupKey | undefined {
  const values: string[] = [];
  for (let index = 0; index < keyCount; index++) {
    const value = parseStringBindingValue(row, `${GROUP_KEY_PREFIX}${index}`);
    if (value === undefined) return undefined;
    values.push(value);
  }
  return { values, labels: values.map(groupValueLabel) };
}

/** Replace groups that fail disclosure control with suppressed placeholders. */
export function suppressGroups<T>(
  groups: StatisticGroup<T>[],
  isReleasable: (group: StatisticGroupKey & T) => boolean,
): StatisticGroup<T>[] {
  return groups.map((group) =>
    group.suppressed || isReleasable(group)
      ? group
      : { values: group.values, labels: group.labels, suppressed: true },
  );
}
