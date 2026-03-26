import type { GraphPath } from "@oxfordia/plugins";
import { graphPathSignature } from "./graphPathSignature";

export interface AllowedPathEntry {
  graphPath?: GraphPath;
}

/**
 * Find the first allowed path whose graphPath is structurally equivalent
 * to the query graph path (using canonical signature comparison).
 */
export function findMatchingAllowedPath<T extends AllowedPathEntry>(
  queryGraphPath: GraphPath,
  allowedPaths: T[],
): T | undefined {
  const querySignature = graphPathSignature(queryGraphPath);
  return allowedPaths.find((entry) => {
    if (!entry.graphPath) return false;
    return graphPathSignature(entry.graphPath) === querySignature;
  });
}
