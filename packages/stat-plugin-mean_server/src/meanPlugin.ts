import type { StatisticApiPlugin } from "@oxfordia/stat-plugin_server";
import {
  graphPathJsonSchema,
  type GraphPath,
} from "@oxfordia/stat-plugin_core";
import {
  MeanStatisticAccessRule,
  meanStatisticPlugin,
} from "@oxfordia/stat-plugin-mean_core";
import {
  evaluateMeanStatisticAccessRule,
  evaluateMeanStatisticAccessRulePostQuery,
  type MeanResult,
} from "./evaluateMeanStatisticAccessRule";
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

export interface MeanQuery {
  resourceUri: string;
  graphPath: GraphPath;
  groupByPaths?: GraphPath[];
}

export type MeanOutput = MeanResult;

const meanQuerySchema: JSONSchema4 = {
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

export const meanPlugin: StatisticApiPlugin<
  MeanQuery,
  MeanOutput,
  MeanStatisticAccessRule,
  StatisticPluginServerGlobals
> = {
  ...meanStatisticPlugin,
  querySchema: meanQuerySchema,
  normalizeQuery: normalizeGroupByPathsQuery,
  evaluateStatisticAccessRulePreQuery(
    query,
    statisticAccessRule,
  ): true | Error {
    return evaluateMeanStatisticAccessRule(
      query.graphPath,
      statisticAccessRule,
      readGroupByPaths(query),
    );
  },
  evaluateStatisticAccessRulePostQuery(query, statisticAccessRule, output) {
    return evaluateMeanStatisticAccessRulePostQuery(
      query.graphPath,
      statisticAccessRule,
      output,
      readGroupByPaths(query),
    );
  },
  async performQuery(query, globals): Promise<MeanOutput> {
    const groupByPaths = readGroupByPaths(query);
    const rows = await executeMeanWithCountQuery({
      resourceUri: query.resourceUri,
      graphPath: query.graphPath,
      groupByPaths,
      globals,
    });
    if (groupByPaths.length > 0) {
      const groups: StatisticGroup<{ mean: number; count: number }>[] = [];
      for (const row of rows) {
        const key = readGroupKey(row, groupByPaths.length);
        const result = readMeanWithCount(row);
        if (key && result) groups.push({ ...key, ...result });
      }
      return { groups };
    }

    const result = rows[0] ? readMeanWithCount(rows[0]) : undefined;
    if (!result) {
      throw new Error("No numeric values found for the provided graphPath.");
    }
    return result;
  },
};

export type MeanWithCountResult = {
  mean: number;
  count: number;
};

function readMeanWithCount(row: Record<string, unknown>): MeanWithCountResult | undefined {
  const mean = parseNumericBindingValue(row, "mean");
  const countRaw = parseNumericBindingValue(row, "count");
  const count =
    countRaw === undefined
      ? 0
      : Number.isInteger(countRaw)
        ? countRaw
        : Math.round(countRaw);
  if (count === 0 || mean === undefined) {
    return undefined;
  }
  return { mean, count };
}

async function executeMeanWithCountQuery(params: {
  resourceUri: string;
  graphPath: GraphPath;
  groupByPaths: GraphPath[];
  globals: StatisticPluginServerGlobals;
}): Promise<Record<string, unknown>[]> {
  const groupBy = buildGroupByQueryParts(params.groupByPaths, SUBJECT_VAR);
  return executeStatisticSparqlQuery({
    resourceUri: params.resourceUri,
    pathBindings: [
      {
        key: "value",
        graphPath: params.graphPath,
        startVar: SUBJECT_VAR,
        requireNumeric: true,
      },
      ...groupBy.pathBindings,
    ],
    selectFields: [
      ...groupBy.selectFields,
      {
        alias: "mean",
        expression: (pathVars) => `AVG(${pathVars.value ?? "?value"})`,
      },
      {
        alias: "count",
        expression: (pathVars) => `COUNT(${pathVars.value ?? "?value"})`,
      },
    ],
    groupByKeys: groupBy.keys,
    globals: params.globals,
  });
}
