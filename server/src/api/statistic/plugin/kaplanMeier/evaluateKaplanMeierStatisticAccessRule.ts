import type {
  GraphPath,
  KaplanMeierAllowedPath,
  KaplanMeierStatisticAccessRule,
} from "@oxfordia/types";
import { toCollectionArray } from "../util/ldoHelpers";
import { graphPathSignature } from "../util/graphPathSignature";

function summarizeSignature(signature: string): string {
  if (signature.length <= 220) return signature;
  return `${signature.slice(0, 220)}...`;
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
  const timeSig = graphPathSignature(queryTimePath);
  const eventSig = graphPathSignature(queryEventPath);
  const groupBySig = queryGroupByPath
    ? graphPathSignature(queryGroupByPath)
    : undefined;

  return allowedPaths.find((entry) => {
    if (!entry.timeGraphPath || !entry.eventGraphPath) return false;
    if (graphPathSignature(entry.timeGraphPath) !== timeSig) return false;
    if (graphPathSignature(entry.eventGraphPath) !== eventSig) return false;

    if (groupBySig !== undefined) {
      const allowedGroupPaths = toCollectionArray(entry.groupByGraphPath);
      const groupMatch = allowedGroupPaths.some(
        (gp) => gp && graphPathSignature(gp) === groupBySig,
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

  const queryTimeSig = graphPathSignature(queryTimePath);
  const queryEventSig = graphPathSignature(queryEventPath);
  const queryGroupBySig =
    queryGroupByPath !== undefined
      ? graphPathSignature(queryGroupByPath)
      : undefined;

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
        graphPathSignature(entry.timeGraphPath) === queryTimeSig,
    );
    const sameEventEntries = allowedPaths.filter(
      (entry) =>
        entry.eventGraphPath &&
        graphPathSignature(entry.eventGraphPath) === queryEventSig,
    );
    const sameTimeAndEventEntries = allowedPaths.filter(
      (entry) =>
        entry.timeGraphPath &&
        entry.eventGraphPath &&
        graphPathSignature(entry.timeGraphPath) === queryTimeSig &&
        graphPathSignature(entry.eventGraphPath) === queryEventSig,
    );

    if (sameTimeEntries.length === 0) {
      return new Error(
        `Requested timePath is not allowed by kaplan-meier statistic policy. timePath=${summarizeSignature(queryTimeSig)}`,
      );
    }
    if (sameEventEntries.length === 0) {
      return new Error(
        `Requested eventPath is not allowed by kaplan-meier statistic policy. eventPath=${summarizeSignature(queryEventSig)}`,
      );
    }
    if (sameTimeAndEventEntries.length === 0) {
      return new Error(
        "Requested timePath and eventPath are each allowed individually, but that combination is not allowed by kaplan-meier statistic policy.",
      );
    }
    if (queryGroupBySig !== undefined) {
      const groupByMatches = sameTimeAndEventEntries.some((entry) =>
        toCollectionArray(entry.groupByGraphPath).some(
          (allowedGroupPath) =>
            allowedGroupPath &&
            graphPathSignature(allowedGroupPath) === queryGroupBySig,
        ),
      );
      if (!groupByMatches) {
        return new Error(
          `Requested groupByPath is not allowed for the requested timePath/eventPath combination in kaplan-meier statistic policy. groupByPath=${summarizeSignature(queryGroupBySig)}`,
        );
      }
    }

    return new Error(
      "Requested paths are not allowed by kaplan-meier statistic policy.",
    );
  }
  return true;
}
