import { set, type ShapeType } from "@ldo/ldo";
import { findGraphPathShortcutByName } from "@oxfordia/data-plugin_core";
import { nemalineDataPlugin } from "@oxfordia/data-plugin-nemaline_core";
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
import { DERIVED_NUMERIC_FIELDS, NUMERIC_COLUMNS } from "./pilotColumns";

const DATA_SCHEMA_NAME = "nemaline";
// The pilot guidance sets a UK minimum count suppression of 3 for most fields.
const DEFAULT_MIN_COUNT = 3;
const DEFAULT_K_ANONYMITY = 3;
const DEFAULT_MEAN_SHORTCUTS = [...NUMERIC_COLUMNS, ...DERIVED_NUMERIC_FIELDS].map(
  (field) => field.shortcut,
);
const DEFAULT_KAPLAN_MEIER_GROUP_BY_SHORTCUTS = [
  "CausativeGene",
  "GenderAssignedAtBirth",
  "Zygosity",
  "CurrentFN",
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
  shortcutName: string,
  statisticAccessRuleDocumentUri: string,
): MeanAllowedPath {
  const suffix = shortcutName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return {
    "@id": `${statisticAccessRuleDocumentUri}#mean-allowed-path-${suffix}`,
    graphPath: requireNemalineGraphPath(shortcutName),
    minCount: DEFAULT_MIN_COUNT,
  };
}

// Age at attaining ambulation (AmbGainTime/AmbGainEvent are derived at upload).
function createDefaultKaplanMeierAllowedPath(
  statisticAccessRuleDocumentUri: string,
): KaplanMeierAllowedPath {
  return {
    "@id": `${statisticAccessRuleDocumentUri}#kaplan-meier-allowed-path-ambulation-gain`,
    timeGraphPath: requireNemalineGraphPath("AmbGainTime"),
    eventGraphPath: requireNemalineGraphPath("AmbGainEvent"),
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
    allowedPath: set(createDefaultKaplanMeierAllowedPath(statisticAccessRuleDocumentUri)),
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
    hasStatisticPolicy: set<NemalineStatisticPolicy>(meanPolicy, kaplanMeierPolicy),
  };
}
