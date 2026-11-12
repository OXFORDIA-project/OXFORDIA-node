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
} from "./evaluateStandardDeviationStatisticAccessRule";
import type { JSONSchema4 } from "json-schema";
import type { StatisticPluginServerGlobals } from "@oxfordia/stat-plugin_server";
import {
  executeStatisticSparqlQuery,
  parseNumericBindingValue,
} from "@oxfordia/stat-plugin_server";

const XSD_DOUBLE = "http://www.w3.org/2001/XMLSchema#double";

export interface StandardDeviationQuery {
  resourceUri: string;
  graphPath: GraphPath;
}

export interface StandardDeviationOutput {
  /** Sample (n - 1) standard deviation; null when fewer than two values. */
  standardDeviation: number | null;
  mean: number;
  count: number;
  distinctCount: number;
}

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
  },
};

export const standardDeviationPlugin: StatisticApiPlugin<
  StandardDeviationQuery,
  StandardDeviationOutput,
  StandardDeviationStatisticAccessRule,
  StatisticPluginServerGlobals
> = {
  ...standardDeviationStatisticPlugin,
  querySchema: standardDeviationQuerySchema,
  evaluateStatisticAccessRulePreQuery(
    query,
    statisticAccessRule,
  ): true | Error {
    return evaluateStandardDeviationStatisticAccessRule(
      query.graphPath,
      statisticAccessRule,
    );
  },
  evaluateStatisticAccessRulePostQuery(
    query,
    statisticAccessRule,
    output,
  ): true | Error {
    return evaluateStandardDeviationStatisticAccessRulePostQuery(
      query.graphPath,
      statisticAccessRule,
      output,
    );
  },
  async performQuery(query, globals): Promise<StandardDeviationOutput> {
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
