import type { StatisticApiPlugin } from "../../StatisticPlugin";
import {
  GraphPath,
  KaplanMeierStatisticAccessRule,
  KaplanMeierStatisticAccessRuleShapeType,
  kaplanMeier_statisticAccessRuleSchemaSchema,
} from "@oxfordia/types";
import { graphPathSchema } from "@oxfordia/types/graphPath";
import type { JSONSchema4 } from "json-schema";

export interface KaplanMeierQuery {
  resourceUri: string;
  eventPath: GraphPath;
  timePath: GraphPath;
}

export interface KaplanMeierPoint {
  time: number;
  event: boolean;
}

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
    return { result: [], observations: 0 };
  },
};
