import type { Schema } from "shexj";

export type StatisticUiPlugin = {
  name: string;
  statisticAccessRuleSchema: Schema;
};
