import { oxfordiaSchema } from "../../_ldo/oxfordia.schema";
import type { StatisticUiPlugin } from "../../StatisticUiPlugin";

export const meanStatisticUiPlugin: StatisticUiPlugin = {
  name: "mean",
  statisticAccessRuleSchema: oxfordiaSchema,
};
