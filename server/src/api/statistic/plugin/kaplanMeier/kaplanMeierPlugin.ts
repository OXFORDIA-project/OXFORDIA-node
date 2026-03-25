import type { StatisticApiPlugin } from "../../StatisticPlugin";
import {
  GraphPath,
  KaplanMeierStatisticAccessRule,
  KaplanMeierStatisticAccessRuleShapeType,
  kaplanMeier_statisticAccessRuleSchemaSchema,
} from "@oxfordia/types";
import { graphPathSchema } from "@oxfordia/types/graphPath";
import { executeStatisticSparqlQuery } from "../util/statisticSparqlQuery";
import { parseNumericBindingValue } from "../util/sparqlBindingParsers";
import type { JSONSchema4 } from "json-schema";

export type KaplanMeierQuery = {
  resourceUri: string;
  cohortPath: GraphPath;
  eventPath: GraphPath;
  timePath: GraphPath;
};

export type KaplanMeierPoint = {
  time: number;
  atRisk: number;
  events: number;
  censored: number;
  survival: number;
};

export type KaplanMeierOutput = {
  result: KaplanMeierPoint[];
  observations: number;
};

const kaplanMeierQuerySchema: JSONSchema4 = {
  type: "object",
  additionalProperties: false,
  required: ["resourceUri", "cohortPath", "eventPath", "timePath"],
  properties: {
    resourceUri: {
      type: "string",
      format: "uri",
      minLength: 1,
    },
    cohortPath: graphPathSchema,
    eventPath: graphPathSchema,
    timePath: graphPathSchema,
  },
};

type KaplanObservation = {
  time: number;
  event: number;
};

function toKaplanObservation(
  row: Record<string, unknown>,
): KaplanObservation | undefined {
  const time = parseNumericBindingValue(row, "time");
  const eventRaw = parseNumericBindingValue(row, "event");
  if (time === undefined || eventRaw === undefined || time < 0) {
    return undefined;
  }
  return {
    time,
    event: eventRaw > 0 ? 1 : 0,
  };
}

function computeKaplanMeierCurve(
  observations: KaplanObservation[],
): KaplanMeierPoint[] {
  if (observations.length === 0) {
    return [];
  }

  const sorted = [...observations].sort((a, b) => a.time - b.time);
  let atRisk = sorted.length;
  let survival = 1;
  const points: KaplanMeierPoint[] = [];
  let idx = 0;

  while (idx < sorted.length && atRisk > 0) {
    const currentTime = sorted[idx]!.time;
    let events = 0;
    let censored = 0;
    while (idx < sorted.length && sorted[idx]!.time === currentTime) {
      if (sorted[idx]!.event === 1) {
        events += 1;
      } else {
        censored += 1;
      }
      idx += 1;
    }

    if (events > 0) {
      survival *= 1 - events / atRisk;
    }
    points.push({
      time: currentTime,
      atRisk,
      events,
      censored,
      survival,
    });
    atRisk -= events + censored;
  }

  return points;
}

export const kaplanMeierPlugin: StatisticApiPlugin<
  KaplanMeierQuery,
  KaplanMeierOutput,
  KaplanMeierStatisticAccessRule
> = {
  name: "kaplan-meier",
  route: "kaplan-meier",
  statisticAccessRuleSchema: kaplanMeier_statisticAccessRuleSchemaSchema,
  statisticAccessRuleShapeType: KaplanMeierStatisticAccessRuleShapeType,
  querySchema: kaplanMeierQuerySchema,
  evaluateStatisticAccessRulePreQuery(
    _query,
    _statisticAccessRule,
  ): true | Error {
    // TODO
    return true;
  },
  evaluateStatisticAccessRulePostQuery(
    _query,
    _statisticAccessRule,
    _output,
  ): true | Error {
    // TODO
    return true;
  },
  async performQuery(query, globals): Promise<KaplanMeierOutput> {
    const rows = await executeStatisticSparqlQuery({
      resourceUri: query.resourceUri,
      pathBindings: [
        {
          key: "cohort",
          graphPath: query.cohortPath,
          startVar: "?subject",
          variableNamespace: "cohort_",
        },
        {
          key: "event",
          graphPath: query.eventPath,
          startVar: "?subject",
          variableNamespace: "event_",
          requireNumeric: true,
        },
        {
          key: "time",
          graphPath: query.timePath,
          startVar: "?subject",
          variableNamespace: "time_",
          requireNumeric: true,
        },
      ],
      selectFields: [
        {
          alias: "event",
          expression: (pathVars) => pathVars.event ?? "?event",
        },
        {
          alias: "time",
          expression: (pathVars) => pathVars.time ?? "?time",
        },
      ],
      globals,
    });

    const observations = rows
      .map(toKaplanObservation)
      .filter((item): item is KaplanObservation => Boolean(item));
    if (observations.length === 0) {
      throw new Error(
        "No Kaplan-Meier observations found for the provided graph paths.",
      );
    }

    return {
      result: computeKaplanMeierCurve(observations),
      observations: observations.length,
    };
  },
};
