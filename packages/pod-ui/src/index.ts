import React from "react";
import { PodUiCore, type PodUiCoreProps } from "@oxfordia/pod-ui-core";
import { angelmanDataPluginUi } from "@oxfordia/data-plugin-angelman_ui";
import { legacyNemalineDataPluginUi } from "@oxfordia/data-plugin-legacy-nemaline_ui";
import { nemalineDataPluginUi } from "@oxfordia/data-plugin-nemaline_ui";
import { countStatisticPluginUi } from "@oxfordia/stat-plugin-count_ui";
import { kaplanMeierStatisticPluginUi } from "@oxfordia/stat-plugin-kaplan-meier_ui";
import { meanStatisticPluginUi } from "@oxfordia/stat-plugin-mean_ui";
import { standardDeviationStatisticPluginUi } from "@oxfordia/stat-plugin-standard-deviation_ui";

export const defaultDataPluginUis = [
  nemalineDataPluginUi,
  legacyNemalineDataPluginUi,
  angelmanDataPluginUi,
];
export const defaultStatisticPluginUis = [
  meanStatisticPluginUi,
  kaplanMeierStatisticPluginUi,
  countStatisticPluginUi,
  standardDeviationStatisticPluginUi,
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
