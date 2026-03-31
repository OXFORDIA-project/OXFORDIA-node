import { ResourceViewConfig } from "linked-data-browser";
import { FileText } from "lucide-react-native";
import { StatisticAccessRuleView } from "./StatisticAccessRuleView";


export const StatisticAccessRuleConfig: ResourceViewConfig = {
  name: "statisticAccessRule",
  displayName: "Statistic Access Rule",
  displayIcon: FileText,
  view: StatisticAccessRuleView,
  canDisplay: (targetUri) => {
    const path = new URL(targetUri).pathname;
    return (
      path.endsWith(".statistic-access-rule.ttl")
    );
  },
};
