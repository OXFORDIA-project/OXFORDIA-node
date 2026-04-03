import React from "react";
import { ResourceViewConfig } from "linked-data-browser";
import { FileText } from "lucide-react-native";
import { StatisticAccessRuleView } from "./StatisticAccessRuleView";
import type { DataPlugin } from "@oxfordia/data-plugin_core";
import type { StatisticPluginUi } from "@oxfordia/stat-plugin_ui";

export function createStatisticAccessRuleConfig(
  dataPlugins: DataPlugin[],
  statisticPlugins: StatisticPluginUi[],
): ResourceViewConfig {
  return {
    name: "statisticAccessRule",
    displayName: "Statistic Access Rule",
    displayIcon: FileText,
    view: () =>
      React.createElement(StatisticAccessRuleView, {
        dataPlugins,
        statisticPlugins,
      }),
    canDisplay: (targetUri) => {
      const path = new URL(targetUri).pathname;
      return path.endsWith(".statistic-access-rule.ttl");
    },
  };
}
