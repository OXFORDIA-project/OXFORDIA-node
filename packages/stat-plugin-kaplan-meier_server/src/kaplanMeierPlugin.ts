import type { StatisticApiPlugin } from "@oxfordia/stat-plugin_server";
import {
  graphPathJsonSchema,
  type GraphPath,
} from "@oxfordia/stat-plugin_core";
import {
  KaplanMeierStatisticAccessRule,
  kaplanMeierStatisticPlugin,
} from "@oxfordia/stat-plugin-kaplan-meier_core";
import type { JSONSchema4 } from "json-schema";
import {
  executeStatisticSparqlQuery,
  parseNumericBindingValue,
  parseStringBindingValue,
  type StatisticPluginServerGlobals,
  type QueryPathBinding,
  type QuerySelectField,
} from "@oxfordia/stat-plugin_server";
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
    eventPath: graphPathJsonSchema,
    timePath: graphPathJsonSchema,
    groupByPath: graphPathJsonSchema,
  },
};

export const kaplanMeierPlugin: StatisticApiPlugin<
  KaplanMeierQuery,
  KaplanMeierOutput,
  KaplanMeierStatisticAccessRule,
  StatisticPluginServerGlobals
> = {
  ...kaplanMeierStatisticPlugin,
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
  globals: StatisticPluginServerGlobals,
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
