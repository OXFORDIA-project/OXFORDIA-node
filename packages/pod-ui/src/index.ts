import React from "react";
import { PodUiCore, type PodUiCoreProps } from "@oxfordia/pod-ui-core";
import { nemalineDataPluginUi } from "@oxfordia/data-plugin-nemaline_ui";
import { kaplanMeierStatisticPluginUi } from "@oxfordia/stat-plugin-kaplan-meier_ui";
import { meanStatisticPluginUi } from "@oxfordia/stat-plugin-mean_ui";

export const defaultDataPluginUis = [nemalineDataPluginUi];
export const defaultStatisticPluginUis = [
  meanStatisticPluginUi,
  kaplanMeierStatisticPluginUi,
];

export function PodUi(
  props: Omit<PodUiCoreProps, "dataPluginUis" | "statisticPluginUis">,
) {
  return React.createElement(PodUiCore, {
    ...props,
    dataPluginUis: defaultDataPluginUis,
    statisticPluginUis: defaultStatisticPluginUis,
  });
}

export const Screen = PodUi;
