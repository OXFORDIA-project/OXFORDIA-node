import type { LdoBase, ShapeType } from "@ldo/ldo";
import type { JSONSchema4 } from "json-schema";
import type { Schema } from "shexj";

export type StatisticQuery = {
  resourceUri: string;
};

export interface StatisticApiPlugin<
  Query extends StatisticQuery,
  Output,
  StatisticAccessRule extends LdoBase,
  Globals = unknown,
> {
  name: string;
  route: string;
  statisticAccessRuleSchema: Schema;
  statisticAccessRuleShapeType: ShapeType<StatisticAccessRule>;
  querySchema: JSONSchema4;
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
