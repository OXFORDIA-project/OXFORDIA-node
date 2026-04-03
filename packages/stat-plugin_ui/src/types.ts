import type { ComponentType } from "react";
import type { StatisticPlugin, StatisticPolicy } from "@oxfordia/stat-plugin_core";
import type { GraphPathShortcut } from "@oxfordia/data-plugin_core";

export type StartPredicateOptionGetter = (
  graphPath: import("@oxfordia/stat-plugin_core").GraphPath,
) => string[];
export type StartValueOptionGetter = (
  graphPath: import("@oxfordia/stat-plugin_core").GraphPath,
  predicate: string,
) => string[];
export type StepPredicateOptionGetter = (
  graphPath: import("@oxfordia/stat-plugin_core").GraphPath,
  stepIndex: number,
) => string[];
export type StepWherePredicateOptionGetter = (
  graphPath: import("@oxfordia/stat-plugin_core").GraphPath,
  stepIndex: number,
) => string[];
export type StepWhereValueOptionGetter = (
  graphPath: import("@oxfordia/stat-plugin_core").GraphPath,
  stepIndex: number,
  predicate: string,
) => string[];
export type StepTargetShapeNameGetter = (
  graphPath: import("@oxfordia/stat-plugin_core").GraphPath,
  stepIndex: number,
) => string[];

export type StatisticAccessRuleEditorGraphPathOptions = {
  dataSchemaName: string | null;
  predicateOptions: string[];
  graphPathShortcuts: GraphPathShortcut[];
  getStartPredicateOptions: StartPredicateOptionGetter;
  getStartValueOptions: StartValueOptionGetter;
  getStepPredicateOptions: StepPredicateOptionGetter;
  getStepWherePredicateOptions: StepWherePredicateOptionGetter;
  getStepWhereValueOptions: StepWhereValueOptionGetter;
  getStepTargetShapeNames: StepTargetShapeNameGetter;
};

export type StatisticPolicyEditorProps<
  Policy extends StatisticPolicy = StatisticPolicy,
> = {
  policy: Policy;
  onChange: (nextPolicy: Policy) => void;
  gpOptions: StatisticAccessRuleEditorGraphPathOptions;
};

export interface StatisticPluginUi<
  Policy extends StatisticPolicy = StatisticPolicy,
> extends StatisticPlugin {
  displayName: string;
  createPolicy: () => Policy;
  isPolicy: (policy: StatisticPolicy) => policy is Policy;
  Editor: ComponentType<StatisticPolicyEditorProps<Policy>>;
}
