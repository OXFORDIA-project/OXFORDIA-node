import type { GraphPath } from "@oxfordia/plugins";
import { graphPathsAreEqual } from "./graphPathEquality";

export interface AllowedPathEntry {
  graphPath?: GraphPath;
}

/**
 * Find the first allowed path whose graphPath is structurally equivalent
 * to the query graph path.
 */
export function findMatchingAllowedPath<T extends AllowedPathEntry>(
  queryGraphPath: GraphPath,
  allowedPaths: T[],
): T | undefined {
  return allowedPaths.find((entry) => {
    if (!entry.graphPath) return false;
    return graphPathsAreEqual(entry.graphPath, queryGraphPath);
  });
}
