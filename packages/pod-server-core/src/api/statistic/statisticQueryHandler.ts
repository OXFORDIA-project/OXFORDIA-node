import type { NextFunction, Request, Response } from "express";
import { createLdoDataset, getRdfNode } from "@ldo/ldo";
import { validate } from "json-schema";
import {
  StatisticAccessRuleDocumentShapeType,
  type StatisticAccessRuleDocument,
} from "@oxfordia/stat-plugin_core";
import {
  type AnyStatisticApiPlugin,
  type StatisticQuery,
} from "@oxfordia/stat-plugin_server";
import { readableToQuads } from "@solid/community-server";
import { HttpError } from "../HttpError";
import type { PodServerGlobals } from "../../types";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const STATISTIC_ACCESS_RULE_TYPE =
  "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRule";
function getStatisticAccessRuleDocumentUri(resourceUri: string): string {
  if (resourceUri.endsWith(".statistic-access-rule.ttl")) {
    return resourceUri;
  }
  if (/\.ttl$/i.test(resourceUri)) {
    return resourceUri.replace(/\.ttl$/i, ".statistic-access-rule.ttl");
  }
  return `${resourceUri}.statistic-access-rule.ttl`;
}

function validatePluginQuery(
  plugin: AnyStatisticApiPlugin<PodServerGlobals>,
  query: unknown,
): StatisticQuery {
  const normalizedQuery = plugin.normalizeQuery?.(query) ?? query;
  const validationResult = validate(
    normalizedQuery as object,
    plugin.querySchema,
  );
  if (!validationResult.valid) {
    const message = validationResult.errors
      .map((error) => `${error.property || "<root>"}: ${error.message}`)
      .join("; ");
    throw new HttpError(
      400,
      `Invalid query for statistic '${plugin.route}': ${message}`,
    );
  }

  return normalizedQuery as StatisticQuery;
}

function findStatisticPlugin(
  route: string,
  statisticPlugins: AnyStatisticApiPlugin<PodServerGlobals>[],
): AnyStatisticApiPlugin<PodServerGlobals> | undefined {
  return statisticPlugins.find((plugin) => plugin.route === route);
}

function toIdArray(value: Iterable<{ "@id": string }> | undefined): string[] {
  if (!value) return [];
  return Array.from(value).map((entry) => entry["@id"]);
}

function truncateForLog(value: string, maxChars = 4000): string {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, maxChars)}... [truncated]`;
}

function serializeForLog(value: unknown, maxChars = 4000): string {
  try {
    return truncateForLog(JSON.stringify(value, null, 2), maxChars);
  } catch {
    return truncateForLog(String(value), maxChars);
  }
}

function formatUnknownError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}

function getStatisticSparqlErrorContext(error: unknown):
  | { endpoint?: string; resourceUri?: string; query?: string }
  | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const context = (error as { oxfordiaStatisticSparqlContext?: unknown })
    .oxfordiaStatisticSparqlContext;
  if (!context || typeof context !== "object") {
    return undefined;
  }

  return context as { endpoint?: string; resourceUri?: string; query?: string };
}

function markErrorLogged(error: unknown): void {
  if (!error || typeof error !== "object") {
    return;
  }

  Object.assign(error, { oxfordiaLogged: true });
}

function renderStatisticQueryErrorLog(params: {
  route: string;
  query?: StatisticQuery;
  authenticatedAgent?: string;
  statisticAccessRuleDocumentUri?: string;
  error: unknown;
}): string {
  const lines = [
    `Statistic query failed for route '${params.route}'.`,
  ];

  if (params.query?.resourceUri) {
    lines.push(`Resource URI: ${params.query.resourceUri}`);
  }
  if (params.authenticatedAgent) {
    lines.push(`Authenticated agent: ${params.authenticatedAgent}`);
  }
  if (params.statisticAccessRuleDocumentUri) {
    lines.push(
      `Statistic access rule document: ${params.statisticAccessRuleDocumentUri}`,
    );
  }
  if (params.query) {
    lines.push("Query:");
    lines.push(serializeForLog(params.query));
  }

  lines.push(`Error: ${formatUnknownError(params.error)}`);

  if (params.error instanceof Error && params.error.stack) {
    lines.push("Stack:");
    lines.push(truncateForLog(params.error.stack, 8000));
  }

  const sparqlContext = getStatisticSparqlErrorContext(params.error);
  if (sparqlContext?.endpoint) {
    lines.push(`SPARQL endpoint: ${sparqlContext.endpoint}`);
  }
  if (sparqlContext?.resourceUri) {
    lines.push(`SPARQL resource: ${sparqlContext.resourceUri}`);
  }
  if (sparqlContext?.query) {
    lines.push("Statistic SPARQL query:");
    lines.push(sparqlContext.query);
  }

  return lines.join("\n");
}

async function getStatisticAccessRuleFor(
  resourceUri: string,
  globals: PodServerGlobals,
): Promise<{
  statisticAccessRuleDocumentUri: string;
  dataset: ReturnType<typeof createLdoDataset>;
  statisticAccessRule: StatisticAccessRuleDocument;
}> {
  const statisticAccessRuleDocumentUri =
    getStatisticAccessRuleDocumentUri(resourceUri);
  const representation = await globals.resourceStore.getRepresentation(
    { path: statisticAccessRuleDocumentUri },
    {},
  );
  const quads = await readableToQuads(representation.data);
  const dataset = createLdoDataset(quads);

  const matches = dataset
    .usingType(StatisticAccessRuleDocumentShapeType)
    .matchSubject(RDF_TYPE, STATISTIC_ACCESS_RULE_TYPE);
  const expectedRootId = `${statisticAccessRuleDocumentUri}#policy`;
  const statisticAccessRule =
    Array.from(matches).find((match) => match["@id"] === expectedRootId) ??
    Array.from(matches)[0];

  if (!statisticAccessRule) {
    throw new HttpError(
      403,
      `No statistic access rule document found at '${statisticAccessRuleDocumentUri}'.`,
    );
  }

  return {
    statisticAccessRuleDocumentUri,
    dataset,
    statisticAccessRule,
  };
}

/**
 * createStatisticQueryHandler
 */
export function createStatisticQueryHandler(globals: PodServerGlobals) {
  return async (req: Request, res: Response, _next: NextFunction) => {
    const route = req.params['route'] as string;
    let query: StatisticQuery | undefined;
    let authenticatedAgent: string | undefined;
    let statisticAccessRuleDocumentUri: string | undefined;

    try {
      const plugin = findStatisticPlugin(route, globals.statisticPlugins);
      if (!plugin) {
        res.status(404).json({ error: `Unknown statistic: ${route}` });
        return;
      }

      query = validatePluginQuery(plugin, req.body);
      authenticatedAgent = res.locals.authenticatedAgent as
        | string
        | undefined;

      const accessRuleResult = await getStatisticAccessRuleFor(
        query.resourceUri,
        globals,
      );
      statisticAccessRuleDocumentUri =
        accessRuleResult.statisticAccessRuleDocumentUri;
      const { dataset, statisticAccessRule } = accessRuleResult;
      if (!authenticatedAgent) {
        throw new HttpError(401, "Missing authenticated agent.");
      }

      const allowedAgents = toIdArray(statisticAccessRule.allowedAgents);
      if (!allowedAgents.includes(authenticatedAgent)) {
        throw new HttpError(
          403,
          `Agent '${authenticatedAgent}' is not allowed by '${statisticAccessRuleDocumentUri}'.`,
        );
      }

      const matchingPolicies = Array.from(
        statisticAccessRule.hasStatisticPolicy ?? [],
      ).filter(
        (policy) =>
          policy.statisticName === plugin.name ||
          policy.statisticName === plugin.route,
      );

      if (matchingPolicies.length === 0) {
        throw new HttpError(
          403,
          `No statistic policy in '${statisticAccessRuleDocumentUri}' matches '${plugin.name}'.`,
        );
      }

      const preEvaluationErrors: string[] = [];
      const policiesPassingPre: (typeof matchingPolicies)[number][] = [];
      for (const matchingPolicy of matchingPolicies) {
        const typedRule = dataset
          .usingType(plugin.statisticAccessRuleShapeType)
          .fromSubject(getRdfNode(matchingPolicy));
        const policyResult = plugin.evaluateStatisticAccessRulePreQuery(
          query,
          typedRule,
        );
        if (policyResult instanceof Error) {
          preEvaluationErrors.push(policyResult.message);
          continue;
        }
        policiesPassingPre.push(matchingPolicy);
      }

      if (policiesPassingPre.length === 0) {
        throw new HttpError(
          403,
          preEvaluationErrors[0] ??
            `Query is not allowed by any matching '${plugin.name}' statistic policy.`,
        );
      }

      const result = await plugin.performQuery(query, globals);

      const postEvaluationErrors: string[] = [];
      let postAllowed = false;
      for (const matchingPolicy of policiesPassingPre) {
        const typedRule = dataset
          .usingType(plugin.statisticAccessRuleShapeType)
          .fromSubject(getRdfNode(matchingPolicy));
        const policyResult = plugin.evaluateStatisticAccessRulePostQuery(
          query,
          typedRule,
          result,
        );
        if (policyResult instanceof Error) {
          postEvaluationErrors.push(policyResult.message);
          continue;
        }
        postAllowed = true;
        break;
      }

      if (!postAllowed) {
        throw new HttpError(
          403,
          postEvaluationErrors[0] ??
            `Result is not allowed by any matching '${plugin.name}' statistic policy.`,
        );
      }

      res.json(result);
    } catch (error) {
      globals.logger.error(
        renderStatisticQueryErrorLog({
          route,
          query,
          authenticatedAgent,
          statisticAccessRuleDocumentUri,
          error,
        }),
      );
      markErrorLogged(error);
      throw error;
    }
  };
}
