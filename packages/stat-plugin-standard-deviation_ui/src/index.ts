import { set } from "@ldo/ldo";
import type { StatisticPolicy } from "@oxfordia/stat-plugin_core";
import { standardDeviationStatisticPlugin } from "@oxfordia/stat-plugin-standard-deviation_core";
import type { StandardDeviationAllowedPath } from "@oxfordia/stat-plugin-standard-deviation_core";
import type { StatisticPluginUi } from "@oxfordia/stat-plugin_ui";
import { StandardDeviationStatisticPolicyEditor } from "./StandardDeviationStatisticPolicyEditor";

type StandardDeviationStatisticPolicy = StatisticPolicy & {
  allowedPath?: StandardDeviationAllowedPath | Iterable<StandardDeviationAllowedPath>;
};

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const standardDeviationStatisticPluginUi: StatisticPluginUi<StandardDeviationStatisticPolicy> = {
  ...standardDeviationStatisticPlugin,
  displayName: "Standard Deviation",
  createPolicy: () =>
    ({
      "@id": `#${createId("standard-deviation-policy")}`,
      statisticName: "standard-deviation",
      allowedPath: set(),
    }) as StandardDeviationStatisticPolicy,
  isPolicy: (policy): policy is StandardDeviationStatisticPolicy =>
    policy.statisticName === "standard-deviation",
  Editor: StandardDeviationStatisticPolicyEditor,
};

export * from "./StandardDeviationStatisticPolicyEditor";
