import type {
  GraphPath,
  StandardDeviationStatisticAccessRule,
  StandardDeviationAllowedPath,
} from "@oxfordia/stat-plugin-standard-deviation_core";
import {
  evaluateGroupedAllowedPath,
  readProperty,
  suppressGroups,
  toCollectionArray,
  toRecord,
  type StatisticGroup,
  type StatisticPostQueryResult,
} from "@oxfordia/stat-plugin_server";

export interface StandardDeviationSummary {
  /** Sample (n - 1) standard deviation; null when fewer than two values. */
  standardDeviation: number | null;
  mean: number;
  count: number;
  distinctCount: number;
}

/** Ungrouped results are a summary; grouped results carry `groups` only. */
export type StandardDeviationResult =
  | StandardDeviationSummary
  | { groups: StatisticGroup<StandardDeviationSummary>[] };

const STATP_MIN_COUNT_KEY = "https://oxfordia.setmeld.com/statistics#minCount";
const STATP_MIN_DISTINCT_VALUES_KEY =
  "https://oxfordia.setmeld.com/statistics#minDistinctValues";

/**
 * A sample standard deviation is undefined below two values, so this floor
 * applies regardless of the policy's minCount.
 */
const MIN_VALUES_FOR_STANDARD_DEVIATION = 2;

function readAllowedPathThreshold(
  allowedPath: StandardDeviationAllowedPath,
  key: "minCount" | "minDistinctValues",
  fullIri: string,
): number {
  const record = toRecord(allowedPath as unknown);
  const raw = record
    ? readProperty<number>(record, key, fullIri)
    : allowedPath[key];
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return Number.NaN;
  }
  return Math.max(0, Math.floor(raw));
}

export function evaluateStandardDeviationStatisticAccessRule(
  queryGraphPath: GraphPath,
  statisticAccessRule: StandardDeviationStatisticAccessRule,
  groupByPaths: GraphPath[] = [],
): true | Error {
  const match = evaluateGroupedAllowedPath(
    "standard deviation",
    queryGraphPath,
    groupByPaths,
    toCollectionArray(statisticAccessRule.allowedPath),
  );
  return match instanceof Error ? match : true;
}

/** Reason a summary fails disclosure control, or undefined if releasable. */
function summaryFailure(
  summary: { count: number; distinctCount: number },
  minCount: number,
  minDistinctValues: number,
): string | undefined {
  if (summary.count < minCount) {
    return `Sample count (${summary.count}) is below the policy minimum (${minCount}) for this standard deviation statistic.`;
  }
  if (summary.count < MIN_VALUES_FOR_STANDARD_DEVIATION) {
    return `Sample count (${summary.count}) is below ${MIN_VALUES_FOR_STANDARD_DEVIATION}; a sample standard deviation is undefined.`;
  }
  if (summary.distinctCount < minDistinctValues) {
    return `Distinct value count (${summary.distinctCount}) is below the policy minimum (${minDistinctValues}) for this standard deviation statistic.`;
  }
  return undefined;
}

/**
 * Disclosure control for a standard deviation (which is released together
 * with its mean and count):
 * - minCount guards against small samples, e.g. with n = 2 the mean and SD
 *   reveal both values exactly.
 * - minDistinctValues guards against low-diversity samples, e.g. an SD of 0
 *   reveals that every individual has the value of the mean.
 * For a grouped result the thresholds apply to each cell, and failing cells
 * are suppressed.
 */
export function evaluateStandardDeviationStatisticAccessRulePostQuery(
  queryGraphPath: GraphPath,
  statisticAccessRule: StandardDeviationStatisticAccessRule,
  output: StandardDeviationResult | { count: number; distinctCount: number },
  groupByPaths: GraphPath[] = [],
): StatisticPostQueryResult<StandardDeviationResult> {
  const match = evaluateGroupedAllowedPath(
    "standard deviation",
    queryGraphPath,
    groupByPaths,
    toCollectionArray(statisticAccessRule.allowedPath),
  );
  if (match instanceof Error) return match;
  const minCount = readAllowedPathThreshold(
    match,
    "minCount",
    STATP_MIN_COUNT_KEY,
  );
  if (!Number.isFinite(minCount)) {
    return new Error(
      "Standard deviation statistic policy is missing a valid minCount for the matched allowed path.",
    );
  }
  const minDistinctValues = readAllowedPathThreshold(
    match,
    "minDistinctValues",
    STATP_MIN_DISTINCT_VALUES_KEY,
  );
  if (!Number.isFinite(minDistinctValues)) {
    return new Error(
      "Standard deviation statistic policy is missing a valid minDistinctValues for the matched allowed path.",
    );
  }
  if ("groups" in output) {
    return {
      release: {
        groups: suppressGroups(
          output.groups,
          (group) => summaryFailure(group, minCount, minDistinctValues) === undefined,
        ),
      },
    };
  }
  const failure = summaryFailure(output, minCount, minDistinctValues);
  return failure ? new Error(failure) : true;
}
