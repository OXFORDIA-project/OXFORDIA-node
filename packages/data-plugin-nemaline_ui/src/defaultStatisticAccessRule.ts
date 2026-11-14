import { set, type ShapeType } from "@ldo/ldo";
import { findGraphPathShortcutByName, graphPathForLdo } from "@oxfordia/data-plugin_core";
import { nemalineDataPlugin } from "@oxfordia/data-plugin-nemaline_core";
import {
  DEFAULT_STATISTIC_ACCESS_RULE_AGENTS,
  StatisticAccessRuleDocumentShapeType,
  type StatisticAccessRuleDocument,
  type StatisticPolicy,
} from "@oxfordia/stat-plugin_core";
import {
  countStatisticPluginContext,
  type CountAllowedPath,
  type CountStatisticAccessRule,
} from "@oxfordia/stat-plugin-count_core";
import {
  meanStatisticPluginContext,
  type MeanAllowedPath,
  type MeanStatisticAccessRule,
} from "@oxfordia/stat-plugin-mean_core";
import {
  standardDeviationStatisticPluginContext,
  type StandardDeviationAllowedPath,
  type StandardDeviationStatisticAccessRule,
} from "@oxfordia/stat-plugin-standard-deviation_core";
import {
  kaplanMeierStatisticPluginContext,
  type KaplanMeierAllowedPath,
  type KaplanMeierStatisticAccessRule,
} from "@oxfordia/stat-plugin-kaplan-meier_core";
import {
  CATEGORY_COLUMNS,
  DERIVED_CATEGORY_FIELDS,
  DERIVED_NUMERIC_FIELDS,
  NUMERIC_COLUMNS,
} from "./pilotColumns";

const DATA_SCHEMA_NAME = "nemaline";
// The pilot guidance sets a UK minimum count suppression of 3 for most fields.
// For grouped results it applies to every cell.
const DEFAULT_MIN_COUNT = 3;
const DEFAULT_MIN_DISTINCT_VALUES = 2;
const DEFAULT_K_ANONYMITY = 3;

const NUMERIC_SHORTCUTS = [...NUMERIC_COLUMNS, ...DERIVED_NUMERIC_FIELDS].map(
  (field) => field.shortcut,
);
const CATEGORY_SHORTCUTS = [...CATEGORY_COLUMNS, ...DERIVED_CATEGORY_FIELDS].map(
  (field) => field.shortcut,
);
/** Stratifiers for means, standard deviations and Kaplan-Meier curves. */
const STRATIFIER_SHORTCUTS = [
  "CausativeGene",
  "GenderAssignedAtBirth",
  "Zygosity",
  "CurrentFN",
] as const;

type CountStatisticPolicy = StatisticPolicy & CountStatisticAccessRule;
type MeanStatisticPolicy = StatisticPolicy & MeanStatisticAccessRule;
type StandardDeviationStatisticPolicy = StatisticPolicy & StandardDeviationStatisticAccessRule;
type KaplanMeierStatisticPolicy = StatisticPolicy & KaplanMeierStatisticAccessRule;
type NemalineStatisticPolicy =
  | CountStatisticPolicy
  | MeanStatisticPolicy
  | StandardDeviationStatisticPolicy
  | KaplanMeierStatisticPolicy;

function requireNemalineGraphPath(shortcutName: string) {
  const shortcut = findGraphPathShortcutByName(
    [nemalineDataPlugin],
    DATA_SCHEMA_NAME,
    shortcutName,
  );
  if (!shortcut) {
    throw new Error(`Missing nemaline graph path shortcut '${shortcutName}'.`);
  }
  return graphPathForLdo(shortcut.graphPath);
}

function groupByPaths(shortcutNames: readonly string[]) {
  return set(...shortcutNames.map((shortcutName) => requireNemalineGraphPath(shortcutName)));
}

function allowedPathId(
  statisticAccessRuleDocumentUri: string,
  statistic: string,
  shortcutName: string,
): string {
  const suffix = shortcutName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return `${statisticAccessRuleDocumentUri}#${statistic}-allowed-path-${suffix}`;
}

// Participant counts, broken down by any one or two categorical fields
// (e.g. causative gene × gender).
function createDefaultCountAllowedPath(statisticAccessRuleDocumentUri: string): CountAllowedPath {
  return {
    "@id": allowedPathId(statisticAccessRuleDocumentUri, "count", "Participant"),
    graphPath: requireNemalineGraphPath("Participant"),
    groupByGraphPath: groupByPaths(CATEGORY_SHORTCUTS),
    minCount: DEFAULT_MIN_COUNT,
  };
}

function createDefaultMeanAllowedPath(
  shortcutName: string,
  statisticAccessRuleDocumentUri: string,
): MeanAllowedPath {
  return {
    "@id": allowedPathId(statisticAccessRuleDocumentUri, "mean", shortcutName),
    graphPath: requireNemalineGraphPath(shortcutName),
    groupByGraphPath: groupByPaths(STRATIFIER_SHORTCUTS),
    minCount: DEFAULT_MIN_COUNT,
  };
}

function createDefaultStandardDeviationAllowedPath(
  shortcutName: string,
  statisticAccessRuleDocumentUri: string,
): StandardDeviationAllowedPath {
  return {
    "@id": allowedPathId(statisticAccessRuleDocumentUri, "standard-deviation", shortcutName),
    graphPath: requireNemalineGraphPath(shortcutName),
    groupByGraphPath: groupByPaths(STRATIFIER_SHORTCUTS),
    minCount: DEFAULT_MIN_COUNT,
    minDistinctValues: DEFAULT_MIN_DISTINCT_VALUES,
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
    groupByGraphPath: groupByPaths(STRATIFIER_SHORTCUTS),
    kAnonymity: DEFAULT_K_ANONYMITY,
  };
}

export const nemalineDefaultStatisticAccessRuleDocumentShapeType: ShapeType<StatisticAccessRuleDocument> =
  {
    ...StatisticAccessRuleDocumentShapeType,
    context: {
      ...StatisticAccessRuleDocumentShapeType.context,
      ...countStatisticPluginContext,
      ...meanStatisticPluginContext,
      ...standardDeviationStatisticPluginContext,
      ...kaplanMeierStatisticPluginContext,
    },
  };

export function createNemalineDefaultStatisticAccessRuleDocument(
  statisticAccessRuleDocumentUri: string,
  allowedAgents: readonly string[] = DEFAULT_STATISTIC_ACCESS_RULE_AGENTS,
): StatisticAccessRuleDocument {
  const countPolicy: CountStatisticPolicy = {
    "@id": `${statisticAccessRuleDocumentUri}#count-policy`,
    statisticName: "count",
    allowedPath: set(createDefaultCountAllowedPath(statisticAccessRuleDocumentUri)),
  };

  const meanPolicy: MeanStatisticPolicy = {
    "@id": `${statisticAccessRuleDocumentUri}#mean-policy`,
    statisticName: "mean",
    allowedPath: set(
      ...NUMERIC_SHORTCUTS.map((shortcutName) =>
        createDefaultMeanAllowedPath(shortcutName, statisticAccessRuleDocumentUri),
      ),
    ),
  };

  const standardDeviationPolicy: StandardDeviationStatisticPolicy = {
    "@id": `${statisticAccessRuleDocumentUri}#standard-deviation-policy`,
    statisticName: "standard-deviation",
    allowedPath: set(
      ...NUMERIC_SHORTCUTS.map((shortcutName) =>
        createDefaultStandardDeviationAllowedPath(shortcutName, statisticAccessRuleDocumentUri),
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
    hasStatisticPolicy: set<NemalineStatisticPolicy>(
      countPolicy,
      meanPolicy,
      standardDeviationPolicy,
      kaplanMeierPolicy,
    ),
  };
}
