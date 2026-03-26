import type { StatisticApiPlugin } from "@oxfordia/plugins";
import {
  MeanStatisticAccessRule,
  MeanStatisticAccessRuleShapeType,
  mean_statisticAccessRuleSchemaSchema,
} from "@oxfordia/plugins";
import type { GraphPath } from "@oxfordia/plugins";
import { graphPathSchema } from "@oxfordia/plugins/graphPath";
import {
  evaluateMeanStatisticAccessRule,
  evaluateMeanStatisticAccessRulePostQuery,
} from "./evaluateMeanStatisticAccessRule";
import type { JSONSchema4 } from "json-schema";
import type { IntegrationPodGlobals } from "../../../../globals";
import { executeStatisticSparqlQuery } from "../util/statisticSparqlQuery";
import { parseNumericBindingValue } from "../util/sparqlBindingParsers";

export interface MeanQuery {
  resourceUri: string;
  graphPath: GraphPath;
}

export interface MeanOutput {
  mean: number;
  count: number;
}

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
    graphPath: graphPathSchema,
  },
};

export const meanPlugin: StatisticApiPlugin<
  MeanQuery,
  MeanOutput,
  MeanStatisticAccessRule,
  IntegrationPodGlobals
> = {
  name: "mean",
  route: "mean",
  statisticAccessRuleSchema: mean_statisticAccessRuleSchemaSchema,
  statisticAccessRuleShapeType: MeanStatisticAccessRuleShapeType,
  querySchema: meanQuerySchema,
  evaluateStatisticAccessRulePreQuery(
    query,
    statisticAccessRule,
  ): true | Error {
    return evaluateMeanStatisticAccessRule(
      query.graphPath,
      statisticAccessRule,
    );
  },
  evaluateStatisticAccessRulePostQuery(
    query,
    statisticAccessRule,
    output,
  ): true | Error {
    return evaluateMeanStatisticAccessRulePostQuery(
      query.graphPath,
      statisticAccessRule,
      output,
    );
  },
  async performQuery(query, globals): Promise<MeanOutput> {
    const row = await executeMeanWithCountQuery({
      resourceUri: query.resourceUri,
      graphPath: query.graphPath,
      globals,
    });
    if (!row) {
      throw new Error("No numeric values found for the provided graphPath.");
    }

    return {
      mean: row.mean,
      count: row.count,
    };
  },
};

export type MeanWithCountResult = {
  mean: number;
  count: number;
};

export async function executeMeanWithCountQuery(params: {
  resourceUri: string;
  graphPath: GraphPath;
  globals: IntegrationPodGlobals;
}): Promise<MeanWithCountResult | undefined> {
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
    ],
    globals: params.globals,
  });

  const firstRow = rows[0];
  if (!firstRow) return undefined;
  const mean = parseNumericBindingValue(firstRow, "mean");
  const countRaw = parseNumericBindingValue(firstRow, "count");
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
