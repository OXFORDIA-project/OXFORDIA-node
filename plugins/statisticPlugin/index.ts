import type { Schema } from "shexj";
import { kaplanMeierStatisticUiPlugin } from "./kaplanMeier";
import { meanStatisticUiPlugin } from "./mean";

export const statisticPlugins = [
  meanStatisticUiPlugin,
  kaplanMeierStatisticUiPlugin,
];

export function getStatisticAccessRuleSchemasByStatisticPlugin(): Record<string, Schema> {
  return statisticPlugins.reduce<Record<string, Schema>>((schemas, plugin) => {
    schemas[plugin.name] = plugin.statisticAccessRuleSchema;
    return schemas;
  }, {});
}

export * from "./kaplanMeier";
export * from "./mean";
