import type { LdoBase, ShapeType } from "@ldo/ldo";
import type { Schema } from "shexj";

export interface StatisticPlugin<StatisticAccessRule extends LdoBase = LdoBase> {
  name: string;
  route: string;
  statisticAccessRuleSchema: Schema;
  statisticAccessRuleShapeType: ShapeType<StatisticAccessRule>;
}

export type AnyStatisticPlugin = StatisticPlugin<LdoBase>;
