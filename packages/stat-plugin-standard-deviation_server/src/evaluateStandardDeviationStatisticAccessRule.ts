import type {
  GraphPath,
  StandardDeviationStatisticAccessRule,
  StandardDeviationAllowedPath,
} from "@oxfordia/stat-plugin-standard-deviation_core";
import {
  findMatchingAllowedPath,
  readProperty,
  toCollectionArray,
  toRecord,
} from "@oxfordia/stat-plugin_server";

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
): true | Error {
  const allowedPaths = toCollectionArray(statisticAccessRule.allowedPath);
  if (allowedPaths.length === 0) {
    return new Error(
      "No allowed graph paths are configured for standard deviation.",
    );
  }
  const match = findMatchingAllowedPath(queryGraphPath, allowedPaths);
  if (!match) {
    return new Error(
      "Requested graphPath is not allowed by standard deviation statistic policy.",
    );
  }
  return true;
}

/**
 * Disclosure control for a standard deviation (which is released together
 * with its mean and count):
 * - minCount guards against small samples, e.g. with n = 2 the mean and SD
 *   reveal both values exactly.
 * - minDistinctValues guards against low-diversity samples, e.g. an SD of 0
 *   reveals that every individual has the value of the mean.
 */
export function evaluateStandardDeviationStatisticAccessRulePostQuery(
  queryGraphPath: GraphPath,
  statisticAccessRule: StandardDeviationStatisticAccessRule,
  output: { count: number; distinctCount: number },
): true | Error {
  const allowedPaths = toCollectionArray(statisticAccessRule.allowedPath);
  const match = findMatchingAllowedPath(queryGraphPath, allowedPaths);
  if (!match) {
    return new Error(
      "Requested graphPath is not allowed by standard deviation statistic policy.",
    );
  }
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
  if (output.count < minCount) {
    return new Error(
      `Sample count (${output.count}) is below the policy minimum (${minCount}) for this standard deviation statistic.`,
    );
  }
  if (output.count < MIN_VALUES_FOR_STANDARD_DEVIATION) {
    return new Error(
      `Sample count (${output.count}) is below ${MIN_VALUES_FOR_STANDARD_DEVIATION}; a sample standard deviation is undefined.`,
    );
  }
  if (output.distinctCount < minDistinctValues) {
    return new Error(
      `Distinct value count (${output.distinctCount}) is below the policy minimum (${minDistinctValues}) for this standard deviation statistic.`,
    );
  }
  return true;
}
