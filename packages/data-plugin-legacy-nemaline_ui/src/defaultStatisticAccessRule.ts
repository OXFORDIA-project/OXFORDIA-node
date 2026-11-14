import { set, type ShapeType } from "@ldo/ldo";
import { findGraphPathShortcutByName, graphPathForLdo } from "@oxfordia/data-plugin_core";
import { legacyNemalineDataPlugin } from "@oxfordia/data-plugin-legacy-nemaline_core";
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
import {
  kaplanMeierStatisticPluginContext,
  type KaplanMeierAllowedPath,
  type KaplanMeierStatisticAccessRule,
} from "@oxfordia/stat-plugin-kaplan-meier_core";

const DATA_SCHEMA_NAME = "legacy-nemaline";
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
type LegacyNemalineStatisticPolicy = MeanStatisticPolicy | KaplanMeierStatisticPolicy;

function requireLegacyNemalineGraphPath(shortcutName: string) {
  const shortcut = findGraphPathShortcutByName(
    [legacyNemalineDataPlugin],
    DATA_SCHEMA_NAME,
    shortcutName,
  );
  if (!shortcut) {
    throw new Error(`Missing legacy-nemaline graph path shortcut '${shortcutName}'.`);
  }
  return graphPathForLdo(shortcut.graphPath);
}

function createDefaultMeanAllowedPath(
  shortcutName: (typeof DEFAULT_MEAN_SHORTCUTS)[number],
  statisticAccessRuleDocumentUri: string,
): MeanAllowedPath {
  const suffix = shortcutName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  return {
    "@id": `${statisticAccessRuleDocumentUri}#mean-allowed-path-${suffix}`,
    graphPath: requireLegacyNemalineGraphPath(shortcutName),
    minCount: DEFAULT_MIN_COUNT,
  };
}

function createDefaultKaplanMeierAllowedPath(
  statisticAccessRuleDocumentUri: string,
): KaplanMeierAllowedPath {
  return {
    "@id": `${statisticAccessRuleDocumentUri}#kaplan-meier-allowed-path-default`,
    timeGraphPath: requireLegacyNemalineGraphPath("KaplanMeierTime"),
    eventGraphPath: requireLegacyNemalineGraphPath("KaplanMeierEvent"),
    groupByGraphPath: set(
      ...DEFAULT_KAPLAN_MEIER_GROUP_BY_SHORTCUTS.map((shortcutName) =>
        requireLegacyNemalineGraphPath(shortcutName),
      ),
    ),
    kAnonymity: DEFAULT_K_ANONYMITY,
  };
}

export const legacyNemalineDefaultStatisticAccessRuleDocumentShapeType: ShapeType<StatisticAccessRuleDocument> =
  {
    ...StatisticAccessRuleDocumentShapeType,
    context: {
      ...StatisticAccessRuleDocumentShapeType.context,
      ...meanStatisticPluginContext,
      ...kaplanMeierStatisticPluginContext,
    },
  };

export function createLegacyNemalineDefaultStatisticAccessRuleDocument(
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

  const kaplanMeierPolicy: KaplanMeierStatisticPolicy = {
    "@id": `${statisticAccessRuleDocumentUri}#kaplan-meier-policy`,
    statisticName: "kaplan-meier",
    allowedPath: set(
      createDefaultKaplanMeierAllowedPath(statisticAccessRuleDocumentUri),
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
    hasStatisticPolicy: set<LegacyNemalineStatisticPolicy>(
      meanPolicy,
      kaplanMeierPolicy,
    ),
  };
}
