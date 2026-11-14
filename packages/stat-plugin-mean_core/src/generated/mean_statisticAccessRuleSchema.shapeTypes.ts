import type { ShapeType } from "@ldo/ldo";
import { meanStatisticAccessRuleSchemaSchema } from "./mean_statisticAccessRuleSchema.schema";
import { meanStatisticAccessRuleSchemaContext } from "./mean_statisticAccessRuleSchema.context";
import type {
  MeanStatisticAccessRule,
  MeanAllowedPath,
  GraphPath,
  GraphNodeFilter,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
  GraphLiteralFilter,
} from "./mean_statisticAccessRuleSchema.typings";

/**
 * =============================================================================
 * LDO ShapeTypes mean_statisticAccessRuleSchema
 * =============================================================================
 */

/**
 * MeanStatisticAccessRule ShapeType
 */
export const MeanStatisticAccessRuleShapeType: ShapeType<MeanStatisticAccessRule> =
  {
    schema: meanStatisticAccessRuleSchemaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistics#MeanStatisticAccessRuleShape",
    context: meanStatisticAccessRuleSchemaContext,
  };

/**
 * MeanAllowedPath ShapeType
 */
export const MeanAllowedPathShapeType: ShapeType<MeanAllowedPath> = {
  schema: meanStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#MeanAllowedPathShape",
  context: meanStatisticAccessRuleSchemaContext,
};

/**
 * GraphPath ShapeType
 */
export const GraphPathShapeType: ShapeType<GraphPath> = {
  schema: meanStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPathShape",
  context: meanStatisticAccessRuleSchemaContext,
};

/**
 * GraphNodeFilter ShapeType
 */
export const GraphNodeFilterShapeType: ShapeType<GraphNodeFilter> = {
  schema: meanStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
  context: meanStatisticAccessRuleSchemaContext,
};

/**
 * GraphPredicateFilter ShapeType
 */
export const GraphPredicateFilterShapeType: ShapeType<GraphPredicateFilter> = {
  schema: meanStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPredicateFilterShape",
  context: meanStatisticAccessRuleSchemaContext,
};

/**
 * GraphTraversalStep ShapeType
 */
export const GraphTraversalStepShapeType: ShapeType<GraphTraversalStep> = {
  schema: meanStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphTraversalStepShape",
  context: meanStatisticAccessRuleSchemaContext,
};

/**
 * GraphValueSelector ShapeType
 */
export const GraphValueSelectorShapeType: ShapeType<GraphValueSelector> = {
  schema: meanStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
  context: meanStatisticAccessRuleSchemaContext,
};

/**
 * GraphLiteralFilter ShapeType
 */
export const GraphLiteralFilterShapeType: ShapeType<GraphLiteralFilter> = {
  schema: meanStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphLiteralFilterShape",
  context: meanStatisticAccessRuleSchemaContext,
};
