import type {
  GraphPath,
  KaplanMeierAllowedPath,
  KaplanMeierStatisticAccessRule,
} from "@oxfordia/plugins";
import { toCollectionArray } from "../util/ldoHelpers";
import {
  graphPathDebugString,
  graphPathsAreEqual,
} from "../util/graphPathEquality";

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
