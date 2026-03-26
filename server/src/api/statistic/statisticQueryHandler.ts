import type { NextFunction, Request, Response } from "express";
import { createLdoDataset, getRdfNode } from "@ldo/ldo";
import { validate } from "json-schema";
import {
  StatisticAccessRuleDocumentShapeType,
  type StatisticAccessRuleDocument,
  type AnyStatisticApiPlugin,
  type StatisticQuery,
} from "@oxfordia/plugins";
import { readableToQuads } from "@solid/community-server";
import type { IntegrationPodGlobals } from "../../globals";
import { HttpError } from "../HttpError";
import { findStatisticPlugin } from "./plugin";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const STATISTIC_ACCESS_RULE_TYPE =
  "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRule";

function getStatisticAccessRuleUri(resourceUri: string): string {
  if (resourceUri.endsWith(".statistic-access-rule.ttl")) {
    return resourceUri;
  }
  if (/\.ttl$/i.test(resourceUri)) {
    return resourceUri.replace(/\.ttl$/i, ".statistic-access-rule.ttl");
  }
  return `${resourceUri}.statistic-access-rule.ttl`;
}

function validatePluginQuery(
  plugin: AnyStatisticApiPlugin<IntegrationPodGlobals>,
  query: unknown,
): StatisticQuery {
  const validationResult = validate(query as object, plugin.querySchema);
  if (!validationResult.valid) {
    const message = validationResult.errors
      .map((error) => `${error.property || "<root>"}: ${error.message}`)
      .join("; ");
    throw new HttpError(
      400,
      `Invalid query for statistic '${plugin.route}': ${message}`,
    );
  }

  return query as StatisticQuery;
}

async function getStatisticAccessRuleFor(
  resourceUri: string,
  globals: IntegrationPodGlobals,
): Promise<{
  dataset: ReturnType<typeof createLdoDataset>;
  statisticAccessRule: StatisticAccessRuleDocument;
}> {
  const statisticAccessRuleUri = getStatisticAccessRuleUri(resourceUri);
  const representation = await globals.resourceStore.getRepresentation(
    { path: statisticAccessRuleUri },
    {},
  );
  const quads = await readableToQuads(representation.data);
  const dataset = createLdoDataset(quads);

  const matches = dataset
    .usingType(StatisticAccessRuleDocumentShapeType)
    .matchSubject(RDF_TYPE, STATISTIC_ACCESS_RULE_TYPE);
  const statisticAccessRule = Array.from(matches)[0];

  if (!statisticAccessRule) {
    throw new HttpError(
      403,
      `No statistic access rule document found at '${statisticAccessRuleUri}'.`,
    );
  }

  return {
    dataset,
    statisticAccessRule,
  };
}

/**
 * createStatisticQueryHandler
 */
export function createStatisticQueryHandler(globals: IntegrationPodGlobals) {
  return async (req: Request, res: Response, _next: NextFunction) => {
    const { route } = req.params;
    const plugin = findStatisticPlugin(route);
    if (!plugin) {
      res.status(404).json({ error: `Unknown statistic: ${route}` });
      return;
    }

    const query = validatePluginQuery(plugin, req.body);
    const { dataset, statisticAccessRule } = await getStatisticAccessRuleFor(
      query.resourceUri,
      globals,
    );

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
        `No statistic policy in '${getStatisticAccessRuleUri(query.resourceUri)}' matches '${plugin.name}'.`,
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
  };
}
