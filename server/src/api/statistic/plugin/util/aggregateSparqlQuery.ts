import type { GraphPath } from "@oxfordia/types";
import { parseNumericBindingValue } from "./sparqlBindingParsers";
import type { IntegrationPodGlobals } from "../../../../globals";
import { executeStatisticSparqlQuery } from "./statisticSparqlQuery";

export interface NumericAggregateSpec {
  resultVar: string;
  expression: (valueVar: string) => string;
  requireNumericInput?: boolean;
}

export interface ExecuteNumericAggregateQueryParams {
  resourceUri: string;
  graphPath: GraphPath;
  aggregate: NumericAggregateSpec;
  globals: IntegrationPodGlobals;
}

export async function executeNumericAggregateQuery(
  params: ExecuteNumericAggregateQueryParams,
): Promise<number | undefined> {
  const rows = await executeStatisticSparqlQuery({
    resourceUri: params.resourceUri,
    pathBindings: [
      {
        key: "value",
        graphPath: params.graphPath,
        requireNumeric: params.aggregate.requireNumericInput !== false,
      },
    ],
    selectFields: [
      {
        alias: params.aggregate.resultVar,
        expression: (pathVars) =>
          params.aggregate.expression(pathVars.value ?? "?value"),
      },
    ],
    globals: params.globals,
  });

  const firstRow = rows[0];
  if (!firstRow) return undefined;
  return parseNumericBindingValue(firstRow, params.aggregate.resultVar);
}
