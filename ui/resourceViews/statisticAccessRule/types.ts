import type { Schema } from "shexj";
import { set } from "@ldo/ldo";
import type { GraphPath, GraphTraversalStep } from "@oxfordia/types";

// Data schema: describes the RDF structure used by a data document.
export type DataSchemaJsonTripleConstraint = {
  predicate: string;
  valueExpr: string;
};

export type DataSchemaJsonShape = {
  id: string;
  tripleConstraints?: DataSchemaJsonTripleConstraint[];
};

export type DataSchemaJsonView = {
  name: string;
  shapeCount: number;
  shapes?: DataSchemaJsonShape[];
};

export type StatisticAccessRuleScalarValue = string | number | boolean;

export type StatisticAccessRuleObjectValue = {
  id: string;
  values: Record<string, StatisticAccessRuleValue>;
};

export type StatisticAccessRuleValue =
  | StatisticAccessRuleScalarValue
  | GraphPath
  | StatisticAccessRuleScalarValue[]
  | GraphPath[]
  | StatisticAccessRuleObjectValue[];

export type StatisticPolicy = {
  id: string;
  statisticName: string;
  values: Record<string, StatisticAccessRuleValue>;
};

// Statistic access rule: RDF document describing plugin-specific policies for one data document.
export type StatisticAccessRuleLoadResult = {
  dataSchemaName: string | null;
  statisticPolicies: StatisticPolicy[];
};

// Statistic access rule schema: plugin-specific shape of statistic access rule entries.
export type StatisticAccessRuleSchemas = Record<string, Schema>;

export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyGraphPath(): GraphPath {
  return {
    start: {},
    steps: set<GraphTraversalStep>(),
  };
}

