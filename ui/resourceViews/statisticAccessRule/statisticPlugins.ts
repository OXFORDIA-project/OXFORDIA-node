import type { Schema } from "shexj";
import {
  mean_statisticAccessRuleSchemaSchema,
  kaplanMeier_statisticAccessRuleSchemaSchema,
} from "@oxfordia/types";

export type StatisticPluginDefinition = {
  name: string;
  statisticAccessRuleSchema: Schema;
};

export const statisticPlugins: StatisticPluginDefinition[] = [
  {
    name: "mean",
    statisticAccessRuleSchema: mean_statisticAccessRuleSchemaSchema,
  },
  {
    name: "kaplan-meier",
    statisticAccessRuleSchema: kaplanMeier_statisticAccessRuleSchemaSchema,
  },
];

export function getStatisticAccessRuleSchemasByStatisticPlugin(): Record<string, Schema> {
  const schemas = statisticPlugins.reduce<Record<string, Schema>>((agg, plugin) => {
    agg[plugin.name] = plugin.statisticAccessRuleSchema;
    return agg;
  }, {});
  return schemas;
}
