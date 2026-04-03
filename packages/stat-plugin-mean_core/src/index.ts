import type { StatisticPlugin } from "@oxfordia/stat-plugin_core";
import { mean_statisticAccessRuleSchemaContext } from "./generated/mean_statisticAccessRuleSchema.context";
import { mean_statisticAccessRuleSchemaSchema } from "./generated/mean_statisticAccessRuleSchema.schema";
import { MeanStatisticAccessRuleShapeType } from "./generated/mean_statisticAccessRuleSchema.shapeTypes";
import type { MeanStatisticAccessRule } from "./generated/mean_statisticAccessRuleSchema.typings";

export * from "./generated/mean_statisticAccessRuleSchema.context";
export * from "./generated/mean_statisticAccessRuleSchema.schema";
export * from "./generated/mean_statisticAccessRuleSchema.shapeTypes";
export * from "./generated/mean_statisticAccessRuleSchema.typings";

export const meanStatisticPlugin: StatisticPlugin<MeanStatisticAccessRule> = {
  name: "mean",
  route: "mean",
  statisticAccessRuleSchema: mean_statisticAccessRuleSchemaSchema,
  statisticAccessRuleShapeType: MeanStatisticAccessRuleShapeType,
};

export const meanStatisticPluginContext = mean_statisticAccessRuleSchemaContext;
