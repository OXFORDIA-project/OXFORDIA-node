import type { GraphPath } from "@oxfordia/stat-plugin_core";
import {
  buildGraphPathWhereClause,
  toIriToken,
  toTemplateStringsArray,
} from "./graphPathToSparqlBuilder";
import type { StatisticPluginServerGlobals } from "../types";

type SparqlBuilderModule = typeof import("@tpluscode/sparql-builder");
let sparqlBuilderModulePromise: Promise<SparqlBuilderModule> | undefined;

async function getSparqlBuilderModule(): Promise<SparqlBuilderModule> {
  if (!sparqlBuilderModulePromise) {
    sparqlBuilderModulePromise = import("@tpluscode/sparql-builder");
  }
  return sparqlBuilderModulePromise;
}

export interface QueryPathBinding {
  key: string;
  graphPath: GraphPath;
  startVar?: string;
  variableNamespace?: string;
  requireNumeric?: boolean;
}

export interface QuerySelectField {
  expression: (pathVars: Record<string, string>) => string;
  alias?: string;
}

export interface ExecuteStatisticSparqlQueryParams {
  resourceUri: string;
  pathBindings: QueryPathBinding[];
  selectFields: QuerySelectField[];
  globals: StatisticPluginServerGlobals;
  extraWherePatterns?: string[];
}

export async function executeStatisticSparqlQuery(
  params: ExecuteStatisticSparqlQueryParams,
): Promise<Record<string, unknown>[]> {
  const { SELECT } = await getSparqlBuilderModule();
  const pathVars: Record<string, string> = {};
  const wherePatterns: string[] = [];
  let requiresXsdPrefix = false;

  for (const binding of params.pathBindings) {
    const compiled = buildGraphPathWhereClause(binding.graphPath, {
      startVar: binding.startVar,
      variableNamespace: binding.variableNamespace,
    });
    pathVars[binding.key] = compiled.terminalVar;
    wherePatterns.push(...compiled.patterns);
    requiresXsdPrefix = requiresXsdPrefix || compiled.requiresXsdPrefix;
    if (binding.requireNumeric) {
      wherePatterns.push(`FILTER(isNumeric(${compiled.terminalVar}))`);
    }
  }

  const selectTokens = params.selectFields.map((field) => {
    const expression = field.expression(pathVars);
    if (!field.alias) {
      return expression;
    }
    return `(${expression} AS ?${field.alias})`;
  });

  const selectProjection = selectTokens.join(" ");
  let sparqlSelect = SELECT(toTemplateStringsArray(selectProjection));
  if (requiresXsdPrefix) {
    sparqlSelect = sparqlSelect.prologue`PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n`;
  }

  const scopedPatterns = [
    `GRAPH ${toIriToken(params.resourceUri)} {`,
    ...wherePatterns.map((pattern) => `  ${pattern}`),
    ...(params.extraWherePatterns ?? []).map((pattern) => `  ${pattern}`),
    "}",
  ];

  for (const pattern of scopedPatterns) {
    sparqlSelect = sparqlSelect.WHERE(toTemplateStringsArray(pattern));
  }

  const query = sparqlSelect.build();
  const bindingsStream = await params.globals.sparqlFetcher.fetchBindings(
    params.globals.sparqlEndpoint,
    query,
  );

  const rows: Record<string, unknown>[] = [];
  for await (const binding of bindingsStream as AsyncIterable<
    Record<string, unknown>
  >) {
    rows.push(binding);
  }
  return rows;
}
