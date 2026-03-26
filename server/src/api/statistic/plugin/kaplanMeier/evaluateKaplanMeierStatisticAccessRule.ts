import type {
  GraphPath,
  KaplanMeierAllowedPath,
  KaplanMeierStatisticAccessRule,
} from "@oxfordia/types";
import { toCollectionArray } from "../util/ldoHelpers";
import { graphPathSignature } from "../util/graphPathSignature";

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
  const match = findMatchingKaplanMeierAllowedPath(
    queryTimePath,
    queryEventPath,
    queryGroupByPath,
    allowedPaths,
  );
  if (!match) {
    return new Error(
      "Requested paths are not allowed by kaplan-meier statistic policy.",
    );
  }
  return true;
}
