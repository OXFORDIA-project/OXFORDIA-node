import { set, type ShapeType } from "@ldo/ldo";
import { findGraphPathShortcutByName } from "@oxfordia/data-plugin_core";
import { nemalineDataPlugin } from "@oxfordia/data-plugin-nemaline_core";
import {
  StatisticAccessRuleDocumentShapeType,
  type StatisticAccessRuleDocument,
  type StatisticPolicy,
} from "@oxfordia/stat-plugin_core";
import {
  meanStatisticPluginContext,
  type MeanAllowedPath,
  type MeanStatisticAccessRule,
} from "@oxfordia/stat-plugin-mean_core";
import {
  kaplanMeierStatisticPluginContext,
  type KaplanMeierAllowedPath,
  type KaplanMeierStatisticAccessRule,
} from "@oxfordia/stat-plugin-kaplan-meier_core";

const DATA_SCHEMA_NAME = "nemaline";
const DEFAULT_MIN_COUNT = 1;
const DEFAULT_K_ANONYMITY = 1;
const DEFAULT_MEAN_SHORTCUTS = [
  "BaselineAge",
  "LoAAge",
  "TotalMFM",
  "KaplanMeierEvent",
  "KaplanMeierTime",
  "MFMVisitTimeFromBaseline",
  "MFMVisitScore",
] as const;
const DEFAULT_KAPLAN_MEIER_GROUP_BY_SHORTCUTS = [
  "ClusterCategory",
  "GeneticGroup",
  "AmbulationStatus",
  "DominantHand",
  "BelowAverageFlag",
] as const;

type MeanStatisticPolicy = StatisticPolicy & MeanStatisticAccessRule;
type KaplanMeierStatisticPolicy = StatisticPolicy & KaplanMeierStatisticAccessRule;
type NemalineStatisticPolicy = MeanStatisticPolicy | KaplanMeierStatisticPolicy;

function requireNemalineGraphPath(shortcutName: string) {
  const shortcut = findGraphPathShortcutByName(
    [nemalineDataPlugin],
    DATA_SCHEMA_NAME,
    shortcutName,
  );
  if (!shortcut) {
    throw new Error(`Missing nemaline graph path shortcut '${shortcutName}'.`);
  }
  return shortcut.graphPath;
}

function createDefaultMeanAllowedPath(
  shortcutName: (typeof DEFAULT_MEAN_SHORTCUTS)[number],
  statisticAccessRuleUri: string,
): MeanAllowedPath {
  const suffix = shortcutName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  return {
    "@id": `${statisticAccessRuleUri}#mean-allowed-path-${suffix}`,
    graphPath: requireNemalineGraphPath(shortcutName),
    minCount: DEFAULT_MIN_COUNT,
  };
}

function createDefaultKaplanMeierAllowedPath(
  statisticAccessRuleUri: string,
): KaplanMeierAllowedPath {
  return {
    "@id": `${statisticAccessRuleUri}#kaplan-meier-allowed-path-default`,
    timeGraphPath: requireNemalineGraphPath("KaplanMeierTime"),
    eventGraphPath: requireNemalineGraphPath("KaplanMeierEvent"),
    groupByGraphPath: set(
      ...DEFAULT_KAPLAN_MEIER_GROUP_BY_SHORTCUTS.map((shortcutName) =>
        requireNemalineGraphPath(shortcutName),
      ),
    ),
    kAnonymity: DEFAULT_K_ANONYMITY,
  };
}

export const nemalineDefaultStatisticAccessRuleDocumentShapeType: ShapeType<StatisticAccessRuleDocument> =
  {
    ...StatisticAccessRuleDocumentShapeType,
    context: {
      ...StatisticAccessRuleDocumentShapeType.context,
      ...meanStatisticPluginContext,
      ...kaplanMeierStatisticPluginContext,
    },
  };

export function createNemalineDefaultStatisticAccessRuleDocument(
  statisticAccessRuleUri: string,
): StatisticAccessRuleDocument {
  const meanPolicy: MeanStatisticPolicy = {
    "@id": `${statisticAccessRuleUri}#mean-policy`,
    statisticName: "mean",
    allowedPath: set(
      ...DEFAULT_MEAN_SHORTCUTS.map((shortcutName) =>
        createDefaultMeanAllowedPath(shortcutName, statisticAccessRuleUri),
      ),
    ),
  };

  const kaplanMeierPolicy: KaplanMeierStatisticPolicy = {
    "@id": `${statisticAccessRuleUri}#kaplan-meier-policy`,
    statisticName: "kaplan-meier",
    allowedPath: set(createDefaultKaplanMeierAllowedPath(statisticAccessRuleUri)),
  };

  return {
    "@id": `${statisticAccessRuleUri}#policy`,
    type: set({ "@id": "StatisticAccessRule" }),
    dataSchema: DATA_SCHEMA_NAME,
    hasStatisticPolicy: set<NemalineStatisticPolicy>(
      meanPolicy,
      kaplanMeierPolicy,
    ),
  };
}
