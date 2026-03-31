import { ShapeType } from "@ldo/ldo";
import { kaplanMeier_statisticAccessRuleSchemaSchema } from "./kaplanMeier_statisticAccessRuleSchema.schema";
import { kaplanMeier_statisticAccessRuleSchemaContext } from "./kaplanMeier_statisticAccessRuleSchema.context";
import {
  KaplanMeierStatisticAccessRule,
  KaplanMeierAllowedPath,
  GraphPath,
  GraphNodeFilter,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
  GraphLiteralFilter,
} from "./kaplanMeier_statisticAccessRuleSchema.typings";

/**
 * =============================================================================
 * LDO ShapeTypes kaplanMeier_statisticAccessRuleSchema
 * =============================================================================
 */

/**
 * KaplanMeierStatisticAccessRule ShapeType
 */
export const KaplanMeierStatisticAccessRuleShapeType: ShapeType<KaplanMeierStatisticAccessRule> =
  {
    schema: kaplanMeier_statisticAccessRuleSchemaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistics#KaplanMeierStatisticAccessRuleShape",
    context: kaplanMeier_statisticAccessRuleSchemaContext,
  };

/**
 * KaplanMeierAllowedPath ShapeType
 */
export const KaplanMeierAllowedPathShapeType: ShapeType<KaplanMeierAllowedPath> =
  {
    schema: kaplanMeier_statisticAccessRuleSchemaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistics#KaplanMeierAllowedPathShape",
    context: kaplanMeier_statisticAccessRuleSchemaContext,
  };

/**
 * GraphPath ShapeType
 */
export const GraphPathShapeType: ShapeType<GraphPath> = {
  schema: kaplanMeier_statisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPathShape",
  context: kaplanMeier_statisticAccessRuleSchemaContext,
};

/**
 * GraphNodeFilter ShapeType
 */
export const GraphNodeFilterShapeType: ShapeType<GraphNodeFilter> = {
  schema: kaplanMeier_statisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
  context: kaplanMeier_statisticAccessRuleSchemaContext,
};

/**
 * GraphPredicateFilter ShapeType
 */
export const GraphPredicateFilterShapeType: ShapeType<GraphPredicateFilter> = {
  schema: kaplanMeier_statisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPredicateFilterShape",
  context: kaplanMeier_statisticAccessRuleSchemaContext,
};

/**
 * GraphTraversalStep ShapeType
 */
export const GraphTraversalStepShapeType: ShapeType<GraphTraversalStep> = {
  schema: kaplanMeier_statisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphTraversalStepShape",
  context: kaplanMeier_statisticAccessRuleSchemaContext,
};

/**
 * GraphValueSelector ShapeType
 */
export const GraphValueSelectorShapeType: ShapeType<GraphValueSelector> = {
  schema: kaplanMeier_statisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
  context: kaplanMeier_statisticAccessRuleSchemaContext,
};

/**
 * GraphLiteralFilter ShapeType
 */
export const GraphLiteralFilterShapeType: ShapeType<GraphLiteralFilter> = {
  schema: kaplanMeier_statisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphLiteralFilterShape",
  context: kaplanMeier_statisticAccessRuleSchemaContext,
};
