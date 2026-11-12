import { set } from "@ldo/ldo";
import type { StatisticPolicy } from "@oxfordia/stat-plugin_core";
import { countStatisticPlugin } from "@oxfordia/stat-plugin-count_core";
import type { CountAllowedPath } from "@oxfordia/stat-plugin-count_core";
import type { StatisticPluginUi } from "@oxfordia/stat-plugin_ui";
import { CountStatisticPolicyEditor } from "./CountStatisticPolicyEditor";

type CountStatisticPolicy = StatisticPolicy & {
  allowedPath?: CountAllowedPath | Iterable<CountAllowedPath>;
};

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const countStatisticPluginUi: StatisticPluginUi<CountStatisticPolicy> = {
  ...countStatisticPlugin,
  displayName: "Count",
  createPolicy: () =>
    ({
      "@id": `#${createId("count-policy")}`,
      statisticName: "count",
      allowedPath: set(),
    }) as CountStatisticPolicy,
  isPolicy: (policy): policy is CountStatisticPolicy =>
    policy.statisticName === "count",
  Editor: CountStatisticPolicyEditor,
};

export * from "./CountStatisticPolicyEditor";
