import type {
  GraphPath,
  KaplanMeierAllowedPath,
  KaplanMeierStatisticAccessRule,
} from "@oxfordia/stat-plugin-kaplan-meier_core";
import {
  graphPathDebugString,
  graphPathsAreEqual,
  readProperty,
  toCollectionArray,
  toRecord,
  type StatisticPostQueryResult,
} from "@oxfordia/stat-plugin_server";

function summarizeGraphPath(graphPath: GraphPath): string {
  const debugString = graphPathDebugString(graphPath);
  if (debugString.length <= 220) return debugString;
  return `${debugString.slice(0, 220)}...`;
}

/**
 * Find a KaplanMeierAllowedPath whose timeGraphPath and eventGraphPath
 * both match the query, and (if a groupByPath is requested) whose
 * groupByGraphPath set contains a matching entry.
 */
function findMatchingKaplanMeierAllowedPath(
  queryTimePath: GraphPath,
  queryEventPath: GraphPath,
  queryGroupByPath: GraphPath | undefined,
  allowedPaths: KaplanMeierAllowedPath[],
): KaplanMeierAllowedPath | undefined {
  return allowedPaths.find((entry) => {
    if (!entry.timeGraphPath || !entry.eventGraphPath) return false;
    if (!graphPathsAreEqual(entry.timeGraphPath, queryTimePath)) return false;
    if (!graphPathsAreEqual(entry.eventGraphPath, queryEventPath)) return false;

    if (queryGroupByPath !== undefined) {
      const allowedGroupPaths = toCollectionArray(entry.groupByGraphPath);
      const groupMatch = allowedGroupPaths.some(
        (gp) => gp && graphPathsAreEqual(gp, queryGroupByPath),
      );
      if (!groupMatch) return false;
    }

    return true;
  });
}

export function evaluateKaplanMeierStatisticAccessRule(
  queryTimePath: GraphPath,
  queryEventPath: GraphPath,
  queryGroupByPath: GraphPath | undefined,
  statisticAccessRule: KaplanMeierStatisticAccessRule,
): true | Error {
  const allowedPaths = toCollectionArray(statisticAccessRule.allowedPath);
  if (allowedPaths.length === 0) {
    return new Error("No allowed paths are configured for kaplan-meier.");
  }

  const match = findMatchingKaplanMeierAllowedPath(
    queryTimePath,
    queryEventPath,
    queryGroupByPath,
    allowedPaths,
  );
  if (!match) {
    const sameTimeEntries = allowedPaths.filter(
      (entry) =>
        entry.timeGraphPath &&
        graphPathsAreEqual(entry.timeGraphPath, queryTimePath),
    );
    const sameEventEntries = allowedPaths.filter(
      (entry) =>
        entry.eventGraphPath &&
        graphPathsAreEqual(entry.eventGraphPath, queryEventPath),
    );
    const sameTimeAndEventEntries = allowedPaths.filter(
      (entry) =>
        entry.timeGraphPath &&
        entry.eventGraphPath &&
        graphPathsAreEqual(entry.timeGraphPath, queryTimePath) &&
        graphPathsAreEqual(entry.eventGraphPath, queryEventPath),
    );

    if (sameTimeEntries.length === 0) {
      return new Error(
        `Requested timePath is not allowed by kaplan-meier statistic policy. timePath=${summarizeGraphPath(queryTimePath)}`,
      );
    }
    if (sameEventEntries.length === 0) {
      return new Error(
        `Requested eventPath is not allowed by kaplan-meier statistic policy. eventPath=${summarizeGraphPath(queryEventPath)}`,
      );
    }
    if (sameTimeAndEventEntries.length === 0) {
      return new Error(
        "Requested timePath and eventPath are each allowed individually, but that combination is not allowed by kaplan-meier statistic policy.",
      );
    }
    if (queryGroupByPath !== undefined) {
      const groupByMatches = sameTimeAndEventEntries.some((entry) =>
        toCollectionArray(entry.groupByGraphPath).some(
          (allowedGroupPath) =>
            allowedGroupPath &&
            graphPathsAreEqual(allowedGroupPath, queryGroupByPath),
        ),
      );
      if (!groupByMatches) {
        return new Error(
          `Requested groupByPath is not allowed for the requested timePath/eventPath combination in kaplan-meier statistic policy. groupByPath=${summarizeGraphPath(queryGroupByPath)}`,
        );
      }
    }

    return new Error(
      "Requested paths are not allowed by kaplan-meier statistic policy.",
    );
  }
  return true;
}

const STATP_K_ANONYMITY_KEY = "https://oxfordia.setmeld.com/statistics#k-anonymity";

function readAllowedPathKAnonymity(allowedPath: KaplanMeierAllowedPath): number {
  const record = toRecord(allowedPath as unknown);
  const raw = record
    ? readProperty<number>(record, "kAnonymity", STATP_K_ANONYMITY_KEY)
    : allowedPath.kAnonymity;
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return Number.NaN;
  }
  return Math.max(0, Math.floor(raw));
}

interface KaplanMeierResultLike {
  observations: { group?: string }[];
  groups?: { group: string; observations: unknown[] }[];
}

/**
 * Disclosure control: every released curve must be built from at least
 * k-anonymity participants. Ungrouped results below k are withheld; in a
 * grouped result the groups below k (and their observations) are dropped.
 */
export function evaluateKaplanMeierStatisticAccessRulePostQuery<Output extends KaplanMeierResultLike>(
  queryTimePath: GraphPath,
  queryEventPath: GraphPath,
  queryGroupByPath: GraphPath | undefined,
  statisticAccessRule: KaplanMeierStatisticAccessRule,
  output: Output,
): StatisticPostQueryResult<Output> {
  const match = findMatchingKaplanMeierAllowedPath(
    queryTimePath,
    queryEventPath,
    queryGroupByPath,
    toCollectionArray(statisticAccessRule.allowedPath),
  );
  if (!match) {
    return new Error("Requested paths are not allowed by kaplan-meier statistic policy.");
  }
  const k = readAllowedPathKAnonymity(match);
  if (!Number.isFinite(k)) {
    return new Error(
      "Kaplan-Meier statistic policy is missing a valid k-anonymity for the matched allowed path.",
    );
  }

  if (!output.groups) {
    if (output.observations.length < k) {
      return new Error(
        `Observation count (${output.observations.length}) is below the policy k-anonymity (${k}) for this kaplan-meier statistic.`,
      );
    }
    return true;
  }

  const released = output.groups.filter((group) => group.observations.length >= k);
  if (released.length === output.groups.length) return true;
  if (released.length === 0) {
    return new Error(
      `Every group has fewer observations than the policy k-anonymity (${k}) for this kaplan-meier statistic.`,
    );
  }
  const releasedGroups = new Set(released.map((group) => group.group));
  return {
    release: {
      ...output,
      groups: released,
      observations: output.observations.filter(
        (observation) => releasedGroups.has(observation.group ?? "Ungrouped"),
      ),
    },
  };
}
