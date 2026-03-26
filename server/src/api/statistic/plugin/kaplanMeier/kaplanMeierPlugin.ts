import type { StatisticApiPlugin } from "@oxfordia/plugins";
import type { GraphPath } from "@oxfordia/plugins";
import {
  KaplanMeierStatisticAccessRule,
  KaplanMeierStatisticAccessRuleShapeType,
  kaplanMeier_statisticAccessRuleSchemaSchema,
} from "@oxfordia/plugins";
import { graphPathSchema } from "@oxfordia/plugins/graphPath";
import type { JSONSchema4 } from "json-schema";
import type { IntegrationPodGlobals } from "../../../../globals";
import {
  executeStatisticSparqlQuery,
  type QueryPathBinding,
  type QuerySelectField,
} from "../util/statisticSparqlQuery";
import {
  parseNumericBindingValue,
  parseStringBindingValue,
} from "../util/sparqlBindingParsers";
import { evaluateKaplanMeierStatisticAccessRule } from "./evaluateKaplanMeierStatisticAccessRule";

export interface KaplanMeierQuery {
  resourceUri: string;
  timePath: GraphPath;
  eventPath: GraphPath;
  groupByPath?: GraphPath;
}

export interface KaplanMeierObservationRow {
  time: number;
  event: boolean;
  group?: string;
}

export type KaplanMeierOutput = {
  observations: KaplanMeierObservationRow[];
};

const kaplanMeierQuerySchema: JSONSchema4 = {
  type: "object",
  additionalProperties: false,
  required: ["resourceUri", "eventPath", "timePath"],
  properties: {
    resourceUri: {
      type: "string",
      format: "uri",
      minLength: 1,
    },
    eventPath: graphPathSchema,
    timePath: graphPathSchema,
    groupByPath: graphPathSchema,
  },
};

export const kaplanMeierPlugin: StatisticApiPlugin<
  KaplanMeierQuery,
  KaplanMeierOutput,
  KaplanMeierStatisticAccessRule,
  IntegrationPodGlobals
> = {
  name: "kaplan-meier",
  route: "kaplan-meier",
  statisticAccessRuleSchema: kaplanMeier_statisticAccessRuleSchemaSchema,
  statisticAccessRuleShapeType: KaplanMeierStatisticAccessRuleShapeType,
  querySchema: kaplanMeierQuerySchema,

  evaluateStatisticAccessRulePreQuery(
    query,
    statisticAccessRule,
  ): true | Error {
    return evaluateKaplanMeierStatisticAccessRule(
      query.timePath,
      query.eventPath,
      query.groupByPath,
      statisticAccessRule,
    );
  },

  evaluateStatisticAccessRulePostQuery(
    _query,
    _statisticAccessRule,
    _output,
  ): true | Error {
    return true;
  },

  async performQuery(query, globals): Promise<KaplanMeierOutput> {
    return { observations: await executeKaplanMeierQuery(query, globals) };
  },
};

async function executeKaplanMeierQuery(
  query: KaplanMeierQuery,
  globals: IntegrationPodGlobals,
): Promise<KaplanMeierObservationRow[]> {
  const sharedStartVar = "?subject";

  const pathBindings: QueryPathBinding[] = [
    {
      key: "time",
      graphPath: query.timePath,
      startVar: sharedStartVar,
      variableNamespace: "t_",
      requireNumeric: true,
    },
    {
      key: "event",
      graphPath: query.eventPath,
      startVar: sharedStartVar,
      variableNamespace: "e_",
      requireNumeric: true,
    },
  ];

  if (query.groupByPath) {
    pathBindings.push({
      key: "group",
      graphPath: query.groupByPath,
      startVar: sharedStartVar,
      variableNamespace: "g_",
    });
  }

  const selectFields: QuerySelectField[] = [
    { expression: (vars) => vars.time!, alias: "time" },
    { expression: (vars) => vars.event!, alias: "event" },
  ];
  if (query.groupByPath) {
    selectFields.push({
      expression: (vars) => vars.group!,
      alias: "group",
    });
  }

  const rawRows = await executeStatisticSparqlQuery({
    resourceUri: query.resourceUri,
    pathBindings,
    selectFields,
    globals,
  });

  const observations: KaplanMeierObservationRow[] = [];
  for (const row of rawRows) {
    const time = parseNumericBindingValue(row, "time");
    const eventNumeric = parseNumericBindingValue(row, "event");
    if (time === undefined || eventNumeric === undefined) continue;

    const observation: KaplanMeierObservationRow = {
      time,
      event: eventNumeric !== 0,
    };

    if (query.groupByPath) {
      const group = parseStringBindingValue(row, "group");
      if (group !== undefined) {
        observation.group = group;
      }
    }

    observations.push(observation);
  }

  return observations;
}
