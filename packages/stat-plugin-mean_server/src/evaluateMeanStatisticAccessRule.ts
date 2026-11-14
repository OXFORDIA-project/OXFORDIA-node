import type {
  GraphPath,
  MeanStatisticAccessRule,
  MeanAllowedPath,
} from "@oxfordia/stat-plugin-mean_core";
import {
  evaluateGroupedAllowedPath,
  readProperty,
  suppressGroups,
  toCollectionArray,
  toRecord,
  type StatisticGroup,
  type StatisticPostQueryResult,
} from "@oxfordia/stat-plugin_server";

/** Ungrouped results carry `mean` and `count`; grouped results carry `groups`. */
export interface MeanResult {
  mean?: number;
  count?: number;
  groups?: StatisticGroup<{ mean: number; count: number }>[];
}

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
  groupByPaths: GraphPath[] = [],
): true | Error {
  const match = evaluateGroupedAllowedPath(
    "mean",
    queryGraphPath,
    groupByPaths,
    toCollectionArray(statisticAccessRule.allowedPath),
  );
  return match instanceof Error ? match : true;
}

/** minCount applies to the whole sample, or to each cell of a grouped result. */
export function evaluateMeanStatisticAccessRulePostQuery(
  queryGraphPath: GraphPath,
  statisticAccessRule: MeanStatisticAccessRule,
  output: MeanResult,
  groupByPaths: GraphPath[] = [],
): StatisticPostQueryResult<MeanResult> {
  const match = evaluateGroupedAllowedPath(
    "mean",
    queryGraphPath,
    groupByPaths,
    toCollectionArray(statisticAccessRule.allowedPath),
  );
  if (match instanceof Error) return match;
  const minCount = readAllowedPathMinCount(match);
  if (!Number.isFinite(minCount)) {
    return new Error(
      "Mean statistic policy is missing a valid minCount for the matched allowed path.",
    );
  }
  if (output.groups) {
    return {
      release: { groups: suppressGroups(output.groups, (group) => group.count >= minCount) },
    };
  }
  const count = output.count ?? 0;
  if (count < minCount) {
    return new Error(
      `Sample count (${count}) is below the policy minimum (${minCount}) for this mean statistic.`,
    );
  }
  return true;
}
