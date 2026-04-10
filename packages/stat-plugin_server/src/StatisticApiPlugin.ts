import type { LdoBase } from "@ldo/ldo";
import type { JSONSchema4 } from "json-schema";
import type { StatisticPlugin } from "@oxfordia/stat-plugin_core";

export type StatisticQuery = {
  resourceUri: string;
};

export interface StatisticApiPlugin<
  Query extends StatisticQuery,
  Output,
  StatisticAccessRule extends LdoBase,
  Globals = unknown,
> extends StatisticPlugin<StatisticAccessRule> {
  querySchema: JSONSchema4;
  normalizeQuery?(query: unknown): unknown;
  evaluateStatisticAccessRulePreQuery(
    query: Query,
    statisticAccessRule: StatisticAccessRule,
  ): true | Error;
  performQuery(query: Query, globals: Globals): Promise<Output>;
  evaluateStatisticAccessRulePostQuery(
    query: Query,
    statisticAccessRule: StatisticAccessRule,
    output: Output,
  ): true | Error;
}

export type AnyStatisticApiPlugin<Globals = unknown> = StatisticApiPlugin<
  StatisticQuery,
  unknown,
  LdoBase,
  Globals
>;
