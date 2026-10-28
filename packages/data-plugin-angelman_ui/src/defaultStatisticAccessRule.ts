import { set, type ShapeType } from "@ldo/ldo";
import { findGraphPathShortcutByName } from "@oxfordia/data-plugin_core";
import { angelmanDataPlugin } from "@oxfordia/data-plugin-angelman_core";
import {
  DEFAULT_STATISTIC_ACCESS_RULE_AGENTS,
  StatisticAccessRuleDocumentShapeType,
  type StatisticAccessRuleDocument,
  type StatisticPolicy,
} from "@oxfordia/stat-plugin_core";
import {
  meanStatisticPluginContext,
  type MeanAllowedPath,
  type MeanStatisticAccessRule,
} from "@oxfordia/stat-plugin-mean_core";

const DATA_SCHEMA_NAME = "angelman";
const DEFAULT_MIN_COUNT = 1;
const DEFAULT_MEAN_SHORTCUTS = [
  "BaselineAge",
  "VisitAge",
  "FIMYoung_Functioning",
  "FIMYoung_Emotional",
  "FIMYoung_Social",
  "FIMYoung_Cognitive",
  "FIMYoung_Communication",
  "FIMYoung_Worry",
  "FIMYoung_Activities",
  "FIMYoung_Relationships",
  "FIM7_Physical",
  "FIM7_Emotional",
  "FIM7_Social",
  "FIM7_Cognitive",
  "FIM7_Communication",
  "FIM7_Worry",
  "FIM7_DailyActivities",
  "FIM7_FamilyRelationships",
  "AdultQoL_Item",
] as const;

type MeanStatisticPolicy = StatisticPolicy & MeanStatisticAccessRule;

function requireAngelmanGraphPath(shortcutName: string) {
  const shortcut = findGraphPathShortcutByName(
    [angelmanDataPlugin],
    DATA_SCHEMA_NAME,
    shortcutName,
  );
  if (!shortcut) {
    throw new Error(`Missing angelman graph path shortcut '${shortcutName}'.`);
  }
  return shortcut.graphPath;
}

function createDefaultMeanAllowedPath(
  shortcutName: (typeof DEFAULT_MEAN_SHORTCUTS)[number],
  statisticAccessRuleDocumentUri: string,
): MeanAllowedPath {
  const suffix = shortcutName.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
  return {
    "@id": `${statisticAccessRuleDocumentUri}#mean-allowed-path-${suffix}`,
    graphPath: requireAngelmanGraphPath(shortcutName),
    minCount: DEFAULT_MIN_COUNT,
  };
}

export const angelmanDefaultStatisticAccessRuleDocumentShapeType: ShapeType<StatisticAccessRuleDocument> =
  {
    ...StatisticAccessRuleDocumentShapeType,
    context: {
      ...StatisticAccessRuleDocumentShapeType.context,
      ...meanStatisticPluginContext,
    },
  };

export function createAngelmanDefaultStatisticAccessRuleDocument(
  statisticAccessRuleDocumentUri: string,
  allowedAgents: readonly string[] = DEFAULT_STATISTIC_ACCESS_RULE_AGENTS,
): StatisticAccessRuleDocument {
  const meanPolicy: MeanStatisticPolicy = {
    "@id": `${statisticAccessRuleDocumentUri}#mean-policy`,
    statisticName: "mean",
    allowedPath: set(
      ...DEFAULT_MEAN_SHORTCUTS.map((shortcutName) =>
        createDefaultMeanAllowedPath(shortcutName, statisticAccessRuleDocumentUri),
      ),
    ),
  };

  return {
    "@id": `${statisticAccessRuleDocumentUri}#policy`,
    type: set({ "@id": "StatisticAccessRule" }),
    dataSchema: DATA_SCHEMA_NAME,
    allowedAgents: set(
      ...allowedAgents.map((agent) => ({
        "@id": agent,
      })),
    ),
    hasStatisticPolicy: set<MeanStatisticPolicy>(meanPolicy),
  };
}
