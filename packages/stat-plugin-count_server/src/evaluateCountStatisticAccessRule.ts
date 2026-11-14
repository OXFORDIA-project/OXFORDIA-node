import type {
  GraphPath,
  CountStatisticAccessRule,
  CountAllowedPath,
} from "@oxfordia/stat-plugin-count_core";
import {
  evaluateGroupedAllowedPath,
  readProperty,
  suppressGroups,
  toCollectionArray,
  toRecord,
  type StatisticGroup,
  type StatisticPostQueryResult,
} from "@oxfordia/stat-plugin_server";

/** Ungrouped results carry `count`; grouped results carry `groups` only. */
export interface CountResult {
  count?: number;
  groups?: StatisticGroup<{ count: number }>[];
}

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
  groupByPaths: GraphPath[] = [],
): true | Error {
  const match = evaluateGroupedAllowedPath(
    "count",
    queryGraphPath,
    groupByPaths,
    toCollectionArray(statisticAccessRule.allowedPath),
  );
  return match instanceof Error ? match : true;
}

/**
 * Small-cell suppression: the count is itself the released value. An
 * ungrouped count below minCount is withheld entirely; in a grouped count only
 * the cells below minCount are suppressed. Grouped results carry no total, so
 * a suppressed cell can't be recovered by subtraction.
 */
export function evaluateCountStatisticAccessRulePostQuery(
  queryGraphPath: GraphPath,
  statisticAccessRule: CountStatisticAccessRule,
  output: CountResult,
  groupByPaths: GraphPath[] = [],
): StatisticPostQueryResult<CountResult> {
  const match = evaluateGroupedAllowedPath(
    "count",
    queryGraphPath,
    groupByPaths,
    toCollectionArray(statisticAccessRule.allowedPath),
  );
  if (match instanceof Error) return match;
  const minCount = readAllowedPathMinCount(match);
  if (!Number.isFinite(minCount)) {
    return new Error(
      "Count statistic policy is missing a valid minCount for the matched allowed path.",
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
      `Count (${count}) is below the policy minimum (${minCount}) for this count statistic.`,
    );
  }
  return true;
}
