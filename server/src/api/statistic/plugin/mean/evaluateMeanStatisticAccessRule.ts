import type {
  MeanAllowedPath,
  GraphPath,
  MeanStatisticAccessRule,
} from "@oxfordia/types";
import { toCollectionArray, toRecord, readProperty } from "../util/ldoHelpers";
import { findMatchingAllowedPath } from "../util/evaluateAllowedPaths";

const STATP_MIN_COUNT_KEY = "https://oxfordia.setmeld.com/statistics#minCount";

function readAllowedPathMinCount(allowedPath: MeanAllowedPath): number {
  const record = toRecord(allowedPath as unknown);
  const raw = record
    ? readProperty<number>(record, "minCount", STATP_MIN_COUNT_KEY)
    : allowedPath.minCount;
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return Number.NaN;
  }
  return Math.max(0, Math.floor(raw));
}

export function evaluateMeanStatisticAccessRule(
  queryGraphPath: GraphPath,
  statisticAccessRule: MeanStatisticAccessRule,
): true | Error {
  const allowedPaths = toCollectionArray(statisticAccessRule.allowedPath);
  if (allowedPaths.length === 0) {
    return new Error("No allowed graph paths are configured for mean.");
  }
  const match = findMatchingAllowedPath(queryGraphPath, allowedPaths);
  if (!match) {
    return new Error(
      "Requested graphPath is not allowed by mean statistic policy.",
    );
  }
  return true;
}

export function evaluateMeanStatisticAccessRulePostQuery(
  queryGraphPath: GraphPath,
  statisticAccessRule: MeanStatisticAccessRule,
  output: { count: number },
): true | Error {
  const match = findMatchingAllowedPath(
    queryGraphPath,
    toCollectionArray(statisticAccessRule.allowedPath),
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
