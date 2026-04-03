import { set } from "@ldo/ldo";
import type { StatisticPolicy } from "@oxfordia/stat-plugin_core";
import type { KaplanMeierAllowedPath } from "@oxfordia/stat-plugin-kaplan-meier_core";
import { kaplanMeierStatisticPlugin } from "@oxfordia/stat-plugin-kaplan-meier_core";
import type { StatisticPluginUi } from "@oxfordia/stat-plugin_ui";
import { KaplanMeierStatisticPolicyEditor } from "./KaplanMeierStatisticPolicyEditor";

type KaplanMeierStatisticPolicy = StatisticPolicy & {
  allowedPath?: KaplanMeierAllowedPath | Iterable<KaplanMeierAllowedPath>;
};

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const kaplanMeierStatisticPluginUi: StatisticPluginUi<KaplanMeierStatisticPolicy> =
  {
    ...kaplanMeierStatisticPlugin,
    displayName: "Kaplan-Meier",
    createPolicy: () =>
      ({
        "@id": `#${createId("kaplan-meier-policy")}`,
        statisticName: "kaplan-meier",
        allowedPath: set(),
      }) as KaplanMeierStatisticPolicy,
    isPolicy: (policy): policy is KaplanMeierStatisticPolicy =>
      policy.statisticName === "kaplan-meier",
    Editor: KaplanMeierStatisticPolicyEditor,
  };

export * from "./KaplanMeierStatisticPolicyEditor";
