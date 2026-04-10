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
  groupLabel?: string;
}

export interface KaplanMeierGroupedObservationRow {
  time: number;
  event: boolean;
}

export interface KaplanMeierObservationGroup {
  group: string;
  groupLabel: string;
  observations: KaplanMeierGroupedObservationRow[];
}

export type KaplanMeierOutput = {
  observations: KaplanMeierObservationRow[];
  groups?: KaplanMeierObservationGroup[];
};

const emptyObjectJsonSchema: JSONSchema4 = {
  type: "object",
  additionalProperties: false,
  maxProperties: 0,
};

const nullJsonSchema: JSONSchema4 = {
  type: "null",
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
    groupByPath: {
      anyOf: [graphPathJsonSchema, emptyObjectJsonSchema, nullJsonSchema],
    },
  },
};

function isEmptyGroupByPath(
  value: unknown,
): value is Record<string, never> | null {
  if (value === null) {
    return true;
  }

  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  );
}

function normalizeKaplanMeierQuery(query: unknown): unknown {
  if (!query || typeof query !== "object" || Array.isArray(query)) {
    return query;
  }

  const groupByPath = (query as Record<string, unknown>).groupByPath;
  if (!isEmptyGroupByPath(groupByPath)) {
    return query;
  }

  const normalizedQuery = { ...(query as Record<string, unknown>) };
  delete normalizedQuery.groupByPath;
  return normalizedQuery;
}

export const kaplanMeierPlugin: StatisticApiPlugin<
  KaplanMeierQuery,
  KaplanMeierOutput,
  KaplanMeierStatisticAccessRule,
  StatisticPluginServerGlobals
> = {
  ...kaplanMeierStatisticPlugin,
  querySchema: kaplanMeierQuerySchema,
  normalizeQuery: normalizeKaplanMeierQuery,

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
    const observations = await executeKaplanMeierQuery(query, globals);
    return {
      observations,
      groups: query.groupByPath
        ? buildKaplanMeierObservationGroups(observations)
        : undefined,
    };
  },
};

function kaplanMeierGroupLabel(value: string): string {
  const last = (value.split(/[\/#]/).pop() ?? value).trim();
  const clusterMatch = last.match(/^Cluster_?(\d+)$/i) ?? last.match(/^C(\d+)$/i);
  if (clusterMatch) {
    return `Group ${clusterMatch[1]}`;
  }

  const variantMatch =
    last.match(/GeneticGroup_?Variant(\d+)/i) ??
    last.match(/Variant_?(\d+)/i);
  if (variantMatch) {
    return `Variant ${variantMatch[1]}`;
  }

  if (/^Status_?NonAmbulant$/i.test(last) || /^StatusNonAmbulant$/i.test(last)) {
    return "Non Ambulant";
  }

  if (/^Status_?Ambulant$/i.test(last) || /^StatusAmbulant$/i.test(last)) {
    return "Ambulant";
  }

  return last
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function buildKaplanMeierObservationGroups(
  observations: KaplanMeierObservationRow[],
): KaplanMeierObservationGroup[] {
  const grouped = new Map<string, KaplanMeierObservationGroup>();

  for (const observation of observations) {
    const rawGroup = observation.group ?? "Ungrouped";
    const groupLabel = observation.groupLabel ?? kaplanMeierGroupLabel(rawGroup);

    if (!grouped.has(rawGroup)) {
      grouped.set(rawGroup, {
        group: rawGroup,
        groupLabel,
        observations: [],
      });
    }

    grouped.get(rawGroup)!.observations.push({
      time: observation.time,
      event: observation.event,
    });
  }

  return Array.from(grouped.values());
}

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
        observation.groupLabel = kaplanMeierGroupLabel(group);
      }
    }

    observations.push(observation);
  }

  return observations;
}
