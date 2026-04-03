import type { GraphPath } from "@oxfordia/plugins";
import { graphPathDebugString, graphPathsAreEqual } from "./graphPathEquality";

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
  console.log(
    "[statistic] query graphPath",
    JSON.stringify(queryGraphPath, null, 2),
  );
  console.log(
    "[statistic] query graphPath normalized",
    graphPathDebugString(queryGraphPath),
  );

  return allowedPaths.find((entry) => {
    console.log(
      "[statistic] allowed path entry",
      JSON.stringify(entry, null, 2),
    );

    if (!entry.graphPath) {
      console.log("[statistic] allowed path entry has no graphPath property");
      return false;
    }

    console.log(
      "[statistic] allowed graphPath",
      JSON.stringify(entry.graphPath, null, 2),
    );
    console.log(
      "[statistic] allowed graphPath normalized",
      graphPathDebugString(entry.graphPath),
    );

    const isMatch = graphPathsAreEqual(entry.graphPath, queryGraphPath);
    console.log("[statistic] graphPath match", isMatch);
    return isMatch;
  });
}
