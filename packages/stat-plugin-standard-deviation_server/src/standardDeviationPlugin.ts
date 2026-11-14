import type { StatisticApiPlugin } from "@oxfordia/stat-plugin_server";
import {
  graphPathJsonSchema,
  type GraphPath,
} from "@oxfordia/stat-plugin_core";
import {
  StandardDeviationStatisticAccessRule,
  standardDeviationStatisticPlugin,
} from "@oxfordia/stat-plugin-standard-deviation_core";
import {
  evaluateStandardDeviationStatisticAccessRule,
  evaluateStandardDeviationStatisticAccessRulePostQuery,
  type StandardDeviationResult,
  type StandardDeviationSummary,
} from "./evaluateStandardDeviationStatisticAccessRule";
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

const XSD_DOUBLE = "http://www.w3.org/2001/XMLSchema#double";

export interface StandardDeviationQuery {
  resourceUri: string;
  graphPath: GraphPath;
  groupByPaths?: GraphPath[];
}

export type StandardDeviationOutput = StandardDeviationResult;

const standardDeviationQuerySchema: JSONSchema4 = {
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

export const standardDeviationPlugin: StatisticApiPlugin<
  StandardDeviationQuery,
  StandardDeviationOutput,
  StandardDeviationStatisticAccessRule,
  StatisticPluginServerGlobals
> = {
  ...standardDeviationStatisticPlugin,
  querySchema: standardDeviationQuerySchema,
  normalizeQuery: normalizeGroupByPathsQuery,
  evaluateStatisticAccessRulePreQuery(
    query,
    statisticAccessRule,
  ): true | Error {
    return evaluateStandardDeviationStatisticAccessRule(
      query.graphPath,
      statisticAccessRule,
      readGroupByPaths(query),
    );
  },
  evaluateStatisticAccessRulePostQuery(query, statisticAccessRule, output) {
    return evaluateStandardDeviationStatisticAccessRulePostQuery(
      query.graphPath,
      statisticAccessRule,
      output,
      readGroupByPaths(query),
    );
  },
  async performQuery(query, globals): Promise<StandardDeviationOutput> {
    const groupByPaths = readGroupByPaths(query);
    if (groupByPaths.length > 0) {
      return { groups: await executeGroupedQuery(query, groupByPaths, globals) };
    }
    const summary = await executeSummaryQuery({
      resourceUri: query.resourceUri,
      graphPath: query.graphPath,
      globals,
    });
    if (!summary) {
      throw new Error("No numeric values found for the provided graphPath.");
    }

    // Two passes (mean first, then squared deviations from it) avoid the
    // cancellation error of computing sum(x^2) - sum(x)^2 / n in floating point.
    const sumSquaredDeviations =
      summary.count < 2
        ? undefined
        : await executeSumSquaredDeviationsQuery({
            resourceUri: query.resourceUri,
            graphPath: query.graphPath,
            mean: summary.mean,
            globals,
          });

    return {
      standardDeviation:
        sumSquaredDeviations === undefined
          ? null
          : Math.sqrt(Math.max(0, sumSquaredDeviations) / (summary.count - 1)),
      mean: summary.mean,
      count: summary.count,
      distinctCount: summary.distinctCount,
    };
  },
};

function toRoundedCount(value: number | undefined): number {
  if (value === undefined) return 0;
  return Number.isInteger(value) ? value : Math.round(value);
}

async function executeSummaryQuery(params: {
  resourceUri: string;
  graphPath: GraphPath;
  globals: StatisticPluginServerGlobals;
}): Promise<
  { mean: number; count: number; distinctCount: number } | undefined
> {
  const rows = await executeStatisticSparqlQuery({
    resourceUri: params.resourceUri,
    pathBindings: [
      {
        key: "value",
        graphPath: params.graphPath,
        requireNumeric: true,
      },
    ],
    selectFields: [
      {
        alias: "mean",
        expression: (pathVars) => `AVG(${pathVars.value ?? "?value"})`,
      },
      {
        alias: "count",
        expression: (pathVars) => `COUNT(${pathVars.value ?? "?value"})`,
      },
      {
        alias: "distinctCount",
        expression: (pathVars) =>
          `COUNT(DISTINCT ${pathVars.value ?? "?value"})`,
      },
    ],
    globals: params.globals,
  });

  const firstRow = rows[0];
  if (!firstRow) return undefined;
  const mean = parseNumericBindingValue(firstRow, "mean");
  const count = toRoundedCount(parseNumericBindingValue(firstRow, "count"));
  const distinctCount = toRoundedCount(
    parseNumericBindingValue(firstRow, "distinctCount"),
  );
  if (count === 0 || mean === undefined) {
    return undefined;
  }
  return { mean, count, distinctCount };
}

async function executeSumSquaredDeviationsQuery(params: {
  resourceUri: string;
  graphPath: GraphPath;
  mean: number;
  globals: StatisticPluginServerGlobals;
}): Promise<number | undefined> {
  // A typed literal keeps negative and exponent-formatted means valid SPARQL.
  const meanLiteral = `"${params.mean}"^^<${XSD_DOUBLE}>`;
  const rows = await executeStatisticSparqlQuery({
    resourceUri: params.resourceUri,
    pathBindings: [
      {
        key: "value",
        graphPath: params.graphPath,
        requireNumeric: true,
      },
    ],
    selectFields: [
      {
        alias: "sumSquaredDeviations",
        expression: (pathVars) => {
          const value = pathVars.value ?? "?value";
          return `SUM((${value} - ${meanLiteral}) * (${value} - ${meanLiteral}))`;
        },
      },
    ],
    globals: params.globals,
  });

  const firstRow = rows[0];
  if (!firstRow) return undefined;
  return parseNumericBindingValue(firstRow, "sumSquaredDeviations");
}

/** Two-pass sample statistics, matching the ungrouped SPARQL computation. */
export function summarizeValues(values: number[]): StandardDeviationSummary | undefined {
  const count = values.length;
  if (count === 0) return undefined;
  const mean = values.reduce((sum, value) => sum + value, 0) / count;
  const sumSquaredDeviations = values.reduce((sum, value) => sum + (value - mean) ** 2, 0);
  return {
    standardDeviation: count < 2 ? null : Math.sqrt(sumSquaredDeviations / (count - 1)),
    mean,
    count,
    distinctCount: new Set(values).size,
  };
}

/**
 * Grouped standard deviation. Each group's second pass needs that group's
 * mean, so the values are fetched (they stay inside the pod) and summarised
 * per group here rather than in SPARQL.
 */
async function executeGroupedQuery(
  query: StandardDeviationQuery,
  groupByPaths: GraphPath[],
  globals: StatisticPluginServerGlobals,
): Promise<StatisticGroup<StandardDeviationSummary>[]> {
  const groupBy = buildGroupByQueryParts(groupByPaths, SUBJECT_VAR);
  const rows = await executeStatisticSparqlQuery({
    resourceUri: query.resourceUri,
    pathBindings: [
      {
        key: "value",
        graphPath: query.graphPath,
        startVar: SUBJECT_VAR,
        requireNumeric: true,
      },
      ...groupBy.pathBindings,
    ],
    selectFields: [
      ...groupBy.selectFields,
      { alias: "value", expression: (pathVars) => pathVars.value ?? "?value" },
    ],
    globals,
  });

  const byGroup = new Map<string, { key: { values: string[]; labels: string[] }; values: number[] }>();
  for (const row of rows) {
    const key = readGroupKey(row, groupByPaths.length);
    const value = parseNumericBindingValue(row, "value");
    if (!key || value === undefined) continue;
    const id = JSON.stringify(key.values);
    const entry = byGroup.get(id) ?? { key, values: [] };
    entry.values.push(value);
    byGroup.set(id, entry);
  }

  const groups: StatisticGroup<StandardDeviationSummary>[] = [];
  for (const { key, values } of byGroup.values()) {
    const summary = summarizeValues(values);
    if (summary) groups.push({ ...key, ...summary });
  }
  return groups;
}
