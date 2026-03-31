import { set } from "@ldo/ldo";
import type { StatisticPolicy } from "@oxfordia/stat-plugin_core";
import { meanStatisticPlugin } from "@oxfordia/stat-plugin-mean_core";
import type { MeanAllowedPath } from "@oxfordia/stat-plugin-mean_core";
import type { StatisticPluginUi } from "@oxfordia/stat-plugin_ui";
import { MeanStatisticPolicyEditor } from "./MeanStatisticPolicyEditor";

type MeanStatisticPolicy = StatisticPolicy & {
  allowedPath?: Iterable<MeanAllowedPath>;
};

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const meanStatisticPluginUi: StatisticPluginUi<MeanStatisticPolicy> = {
  ...meanStatisticPlugin,
  displayName: "Mean",
  createPolicy: () =>
    ({
      "@id": `#${createId("mean-policy")}`,
      statisticName: "mean",
      allowedPath: set(),
    }) as MeanStatisticPolicy,
  isPolicy: (policy): policy is MeanStatisticPolicy =>
    policy.statisticName === "mean",
  Editor: MeanStatisticPolicyEditor,
};

export * from "./MeanStatisticPolicyEditor";
