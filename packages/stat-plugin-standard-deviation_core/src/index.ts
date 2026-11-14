import type { StatisticPlugin } from "@oxfordia/stat-plugin_core";
import { standardDeviationStatisticAccessRuleSchemaContext } from "./generated/standardDeviation_statisticAccessRuleSchema.context";
import { standardDeviationStatisticAccessRuleSchemaSchema } from "./generated/standardDeviation_statisticAccessRuleSchema.schema";
import { StandardDeviationStatisticAccessRuleShapeType } from "./generated/standardDeviation_statisticAccessRuleSchema.shapeTypes";
import type { StandardDeviationStatisticAccessRule } from "./generated/standardDeviation_statisticAccessRuleSchema.typings";

export * from "./generated/standardDeviation_statisticAccessRuleSchema.context";
export * from "./generated/standardDeviation_statisticAccessRuleSchema.schema";
export * from "./generated/standardDeviation_statisticAccessRuleSchema.shapeTypes";
export * from "./generated/standardDeviation_statisticAccessRuleSchema.typings";

export const standardDeviationStatisticPlugin: StatisticPlugin<StandardDeviationStatisticAccessRule> = {
  name: "standard-deviation",
  route: "standard-deviation",
  statisticAccessRuleSchema: standardDeviationStatisticAccessRuleSchemaSchema,
  statisticAccessRuleShapeType: StandardDeviationStatisticAccessRuleShapeType,
};

export const standardDeviationStatisticPluginContext = standardDeviationStatisticAccessRuleSchemaContext;
