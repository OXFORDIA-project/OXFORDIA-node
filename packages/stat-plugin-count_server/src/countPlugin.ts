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
} from "./evaluateCountStatisticAccessRule";
import type { JSONSchema4 } from "json-schema";
import type { StatisticPluginServerGlobals } from "@oxfordia/stat-plugin_server";
import {
  executeStatisticSparqlQuery,
  parseNumericBindingValue,
} from "@oxfordia/stat-plugin_server";

export interface CountQuery {
  resourceUri: string;
  graphPath: GraphPath;
}

export interface CountOutput {
  count: number;
}

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
  },
};

export const countPlugin: StatisticApiPlugin<
  CountQuery,
  CountOutput,
  CountStatisticAccessRule,
  StatisticPluginServerGlobals
> = {
  ...countStatisticPlugin,
  querySchema: countQuerySchema,
  evaluateStatisticAccessRulePreQuery(
    query,
    statisticAccessRule,
  ): true | Error {
    return evaluateCountStatisticAccessRule(
      query.graphPath,
      statisticAccessRule,
    );
  },
  evaluateStatisticAccessRulePostQuery(
    query,
    statisticAccessRule,
    output,
  ): true | Error {
    return evaluateCountStatisticAccessRulePostQuery(
      query.graphPath,
      statisticAccessRule,
      output,
    );
  },
  async performQuery(query, globals): Promise<CountOutput> {
    // A count of 0 is a valid answer, so it is not treated as "no data"; the
    // post-query minCount check decides whether it may be released.
    const count = await executeCountQuery({
      resourceUri: query.resourceUri,
      graphPath: query.graphPath,
      globals,
    });
    return { count };
  },
};

async function executeCountQuery(params: {
  resourceUri: string;
  graphPath: GraphPath;
  globals: StatisticPluginServerGlobals;
}): Promise<number> {
  const rows = await executeStatisticSparqlQuery({
    resourceUri: params.resourceUri,
    pathBindings: [
      {
        key: "value",
        graphPath: params.graphPath,
      },
    ],
    selectFields: [
      {
        alias: "count",
        // DISTINCT so an entity matched through several predicate-filter
        // solutions is only counted once.
        expression: (pathVars) =>
          `COUNT(DISTINCT ${pathVars.value ?? "?value"})`,
      },
    ],
    globals: params.globals,
  });

  const firstRow = rows[0];
  if (!firstRow) return 0;
  const countRaw = parseNumericBindingValue(firstRow, "count");
  if (countRaw === undefined) return 0;
  return Number.isInteger(countRaw) ? countRaw : Math.round(countRaw);
}
