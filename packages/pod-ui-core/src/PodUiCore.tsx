import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ContainerResourceCreator,
  DataBrowser,
  ProfileResourceView,
  RawCodeResourceView,
  RdfResourceCreator,
  type DataBrowserConfigProps,
} from "linked-data-browser";
import { CustomContainerConfig } from "./resourceViews/container/CustomContainerConfig";
import type { DataPluginUi } from "@oxfordia/data-plugin_ui";
import type { StatisticPluginUi } from "@oxfordia/stat-plugin_ui";
import { HomeConfig } from "./resourceViews/home/HomeConfig";
import { createStatisticAccessRuleConfig } from "./resourceViews/statisticAccessRule/StatisticAccessRuleConfig";

export type PodUiCoreProps = Omit<
  DataBrowserConfigProps,
  "resourceViews" | "resourceCreators"
> & {
  dataPluginUis: DataPluginUi[];
  statisticPluginUis: StatisticPluginUi[];
};

export function PodUiCore({
  dataPluginUis,
  statisticPluginUis,
  ...browserProps
}: PodUiCoreProps) {
  const dataPlugins = dataPluginUis.flatMap((pluginUi) =>
    pluginUi.dataPlugin ? [pluginUi.dataPlugin] : [],
  );

  return (
    <SafeAreaProvider>
      <StatusBar />
      <DataBrowser
        {...browserProps}
        resourceViews={[
          HomeConfig,
          ProfileResourceView,
          CustomContainerConfig,
          ...dataPluginUis.map((pluginUi) => pluginUi.resourceView),
          createStatisticAccessRuleConfig(dataPlugins, statisticPluginUis),
          RawCodeResourceView,
        ]}
        resourceCreators={[
          // RdfResourceCreator,
          // ContainerResourceCreator,
          ...dataPluginUis.map((pluginUi) => pluginUi.resourceCreator),
        ]}
      />
    </SafeAreaProvider>
  );
}
