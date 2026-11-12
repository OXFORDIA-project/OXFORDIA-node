import type { StatisticPlugin } from "@oxfordia/stat-plugin_core";
import { countStatisticAccessRuleSchemaContext } from "./generated/count_statisticAccessRuleSchema.context";
import { countStatisticAccessRuleSchemaSchema } from "./generated/count_statisticAccessRuleSchema.schema";
import { CountStatisticAccessRuleShapeType } from "./generated/count_statisticAccessRuleSchema.shapeTypes";
import type { CountStatisticAccessRule } from "./generated/count_statisticAccessRuleSchema.typings";

export * from "./generated/count_statisticAccessRuleSchema.context";
export * from "./generated/count_statisticAccessRuleSchema.schema";
export * from "./generated/count_statisticAccessRuleSchema.shapeTypes";
export * from "./generated/count_statisticAccessRuleSchema.typings";

export const countStatisticPlugin: StatisticPlugin<CountStatisticAccessRule> = {
  name: "count",
  route: "count",
  statisticAccessRuleSchema: countStatisticAccessRuleSchemaSchema,
  statisticAccessRuleShapeType: CountStatisticAccessRuleShapeType,
};

export const countStatisticPluginContext = countStatisticAccessRuleSchemaContext;
