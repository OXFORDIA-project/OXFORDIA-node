import type {
  GraphPath,
  CountStatisticAccessRule,
  CountAllowedPath,
} from "@oxfordia/stat-plugin-count_core";
import {
  findMatchingAllowedPath,
  readProperty,
  toCollectionArray,
  toRecord,
} from "@oxfordia/stat-plugin_server";

const STATP_MIN_COUNT_KEY = "https://oxfordia.setmeld.com/statistics#minCount";

function readAllowedPathMinCount(allowedPath: CountAllowedPath): number {
  const record = toRecord(allowedPath as unknown);
  const raw = record
    ? readProperty<number>(record, "minCount", STATP_MIN_COUNT_KEY)
    : allowedPath.minCount;
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return Number.NaN;
  }
  return Math.max(0, Math.floor(raw));
}

export function evaluateCountStatisticAccessRule(
  queryGraphPath: GraphPath,
  statisticAccessRule: CountStatisticAccessRule,
): true | Error {
  const allowedPaths = toCollectionArray(statisticAccessRule.allowedPath);
  if (allowedPaths.length === 0) {
    return new Error("No allowed graph paths are configured for count.");
  }
  const match = findMatchingAllowedPath(queryGraphPath, allowedPaths);
  if (!match) {
    return new Error(
      "Requested graphPath is not allowed by count statistic policy.",
    );
  }
  return true;
}

/**
 * Small-cell suppression: the count is itself the released value, so it is
 * withheld entirely when it falls below the policy's minCount.
 */
export function evaluateCountStatisticAccessRulePostQuery(
  queryGraphPath: GraphPath,
  statisticAccessRule: CountStatisticAccessRule,
  output: { count: number },
): true | Error {
  const allowedPaths = toCollectionArray(statisticAccessRule.allowedPath);
  const match = findMatchingAllowedPath(queryGraphPath, allowedPaths);
  if (!match) {
    return new Error(
      "Requested graphPath is not allowed by count statistic policy.",
    );
  }
  const minCount = readAllowedPathMinCount(match);
  if (!Number.isFinite(minCount)) {
    return new Error(
      "Count statistic policy is missing a valid minCount for the matched allowed path.",
    );
  }
  if (output.count < minCount) {
    return new Error(
      `Count (${output.count}) is below the policy minimum (${minCount}) for this count statistic.`,
    );
  }
  return true;
}
