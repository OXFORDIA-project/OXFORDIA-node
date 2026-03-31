import { oxfordiaSchema } from "../../_ldo/oxfordia.schema";
import type { StatisticUiPlugin } from "../../StatisticUiPlugin";

export const kaplanMeierStatisticUiPlugin: StatisticUiPlugin = {
  name: "kaplan-meier",
  statisticAccessRuleSchema: oxfordiaSchema,
};
