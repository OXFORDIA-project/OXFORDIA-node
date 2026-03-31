import type { StatisticPlugin } from "@oxfordia/stat-plugin_core";
import { kaplanMeier_statisticAccessRuleSchemaContext } from "./generated/kaplanMeier_statisticAccessRuleSchema.context";
import { kaplanMeier_statisticAccessRuleSchemaSchema } from "./generated/kaplanMeier_statisticAccessRuleSchema.schema";
import { KaplanMeierStatisticAccessRuleShapeType } from "./generated/kaplanMeier_statisticAccessRuleSchema.shapeTypes";
import type { KaplanMeierStatisticAccessRule } from "./generated/kaplanMeier_statisticAccessRuleSchema.typings";

export * from "./generated/kaplanMeier_statisticAccessRuleSchema.context";
export * from "./generated/kaplanMeier_statisticAccessRuleSchema.schema";
export * from "./generated/kaplanMeier_statisticAccessRuleSchema.shapeTypes";
export * from "./generated/kaplanMeier_statisticAccessRuleSchema.typings";

export const kaplanMeierStatisticPlugin: StatisticPlugin<KaplanMeierStatisticAccessRule> =
  {
    name: "kaplan-meier",
    route: "kaplan-meier",
    statisticAccessRuleSchema: kaplanMeier_statisticAccessRuleSchemaSchema,
    statisticAccessRuleShapeType: KaplanMeierStatisticAccessRuleShapeType,
  };

export const kaplanMeierStatisticPluginContext =
  kaplanMeier_statisticAccessRuleSchemaContext;
