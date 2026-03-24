import type { StatisticPlugin } from "../StatisticPlugin";
import {
  MeanStatisticAccessRule,
  MeanStatisticAccessRuleShapeType,
  mean_statisticAccessRuleSchemaSchema,
} from "@oxfordia/types";
import type { GraphPath } from "@oxfordia/types";
import { graphPathSchema } from "@oxfordia/types/graphPath";
import { executeNumericAggregateQuery } from "./util/aggregateSparqlQuery";
import { evaluateMeanStatisticAccessRule } from "./util/evaluateMeanStatisticAccessRule";
import type { JSONSchema4 } from "json-schema";

export type MeanQuery = {
  resourceUri: string;
  graphPath: GraphPath;
};

export type MeanOutput = {
  result: number;
};

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

export const meanPlugin: StatisticPlugin<
  MeanQuery,
  MeanOutput,
  MeanStatisticAccessRule
> = {
  name: "mean",
  route: "mean",
  statisticAccessRuleSchema: mean_statisticAccessRuleSchemaSchema,
  statisticAccessRuleShapeType: MeanStatisticAccessRuleShapeType,
  querySchema: meanQuerySchema,
  evaluateStatisticAccessRule(query, statisticAccessRule): true | Error {
    return evaluateMeanStatisticAccessRule(
      query.graphPath,
      statisticAccessRule,
    );
  },
  async performQuery(query, globals): Promise<MeanOutput> {
    const meanValue = await executeNumericAggregateQuery({
      resourceUri: query.resourceUri,
      graphPath: query.graphPath,
      aggregate: {
        resultVar: "mean",
        expression: (valueVar) => `AVG(${valueVar})`,
      },
      globals,
    });
    if (meanValue === undefined) {
      throw new Error("No numeric values found for the provided graphPath.");
    }

    return {
      result: meanValue,
    };
  },
};
