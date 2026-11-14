import type { StatisticApiPlugin } from "@oxfordia/stat-plugin_server";
import {
  graphPathJsonSchema,
  type GraphPath,
} from "@oxfordia/stat-plugin_core";
import {
  CountStatisticAccessRule,
  countStatisticPlugin,
} from "@oxfordia/stat-plugin-count_core";
import {
  evaluateCountStatisticAccessRule,
  evaluateCountStatisticAccessRulePostQuery,
  type CountResult,
} from "./evaluateCountStatisticAccessRule";
import type { JSONSchema4 } from "json-schema";
import type { StatisticPluginServerGlobals } from "@oxfordia/stat-plugin_server";
import {
  buildGroupByQueryParts,
  executeStatisticSparqlQuery,
  groupByPathsJsonSchema,
  normalizeGroupByPathsQuery,
  parseNumericBindingValue,
  readGroupByPaths,
  readGroupKey,
  type StatisticGroup,
} from "@oxfordia/stat-plugin_server";

export interface CountQuery {
  resourceUri: string;
  graphPath: GraphPath;
  groupByPaths?: GraphPath[];
}

export type CountOutput = CountResult;

const countQuerySchema: JSONSchema4 = {
  type: "object",
  additionalProperties: false,
  required: ["resourceUri", "graphPath"],
  properties: {
    resourceUri: {
      type: "string",
      format: "uri",
      minLength: 1,
    },
    graphPath: graphPathJsonSchema,
    groupByPaths: groupByPathsJsonSchema,
  },
};

const SUBJECT_VAR = "?subject";

export const countPlugin: StatisticApiPlugin<
  CountQuery,
  CountOutput,
  CountStatisticAccessRule,
  StatisticPluginServerGlobals
> = {
  ...countStatisticPlugin,
  querySchema: countQuerySchema,
  normalizeQuery: normalizeGroupByPathsQuery,
  evaluateStatisticAccessRulePreQuery(
    query,
    statisticAccessRule,
  ): true | Error {
    return evaluateCountStatisticAccessRule(
      query.graphPath,
      statisticAccessRule,
      readGroupByPaths(query),
    );
  },
  evaluateStatisticAccessRulePostQuery(query, statisticAccessRule, output) {
    return evaluateCountStatisticAccessRulePostQuery(
      query.graphPath,
      statisticAccessRule,
      output,
      readGroupByPaths(query),
    );
  },
  async performQuery(query, globals): Promise<CountOutput> {
    // A count of 0 is a valid answer, so it is not treated as "no data"; the
    // post-query minCount check decides whether it may be released.
    const groupByPaths = readGroupByPaths(query);
    if (groupByPaths.length === 0) {
      const [row] = await executeCountQuery(query, [], globals);
      return { count: row ? readCount(row) : 0 };
    }
    const rows = await executeCountQuery(query, groupByPaths, globals);
    const groups: StatisticGroup<{ count: number }>[] = [];
    for (const row of rows) {
      const key = readGroupKey(row, groupByPaths.length);
      if (key) groups.push({ ...key, count: readCount(row) });
    }
    return { groups };
  },
};

function readCount(row: Record<string, unknown>): number {
  const countRaw = parseNumericBindingValue(row, "count");
  if (countRaw === undefined) return 0;
  return Number.isInteger(countRaw) ? countRaw : Math.round(countRaw);
}

async function executeCountQuery(
  query: CountQuery,
  groupByPaths: GraphPath[],
  globals: StatisticPluginServerGlobals,
): Promise<Record<string, unknown>[]> {
  const groupBy = buildGroupByQueryParts(groupByPaths, SUBJECT_VAR);
  return executeStatisticSparqlQuery({
    resourceUri: query.resourceUri,
    pathBindings: [
      {
        key: "value",
        graphPath: query.graphPath,
        startVar: SUBJECT_VAR,
      },
      ...groupBy.pathBindings,
    ],
    selectFields: [
      ...groupBy.selectFields,
      {
        alias: "count",
        // Counts participants (the path's start subject), not values: a
        // categorical path such as "Causative gene" has few distinct values,
        // and participants sharing a numeric value must not merge.
        expression: () => `COUNT(DISTINCT ${SUBJECT_VAR})`,
      },
    ],
    groupByKeys: groupBy.keys,
    globals,
  });
}
