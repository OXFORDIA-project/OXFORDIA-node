import type { ShapeType } from "@ldo/ldo";
import { countStatisticAccessRuleSchemaSchema } from "./count_statisticAccessRuleSchema.schema";
import { countStatisticAccessRuleSchemaContext } from "./count_statisticAccessRuleSchema.context";
import type {
  CountStatisticAccessRule,
  CountAllowedPath,
  GraphPath,
  GraphNodeFilter,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
  GraphLiteralFilter,
} from "./count_statisticAccessRuleSchema.typings";

/**
 * =============================================================================
 * LDO ShapeTypes count_statisticAccessRuleSchema
 * =============================================================================
 */

/**
 * CountStatisticAccessRule ShapeType
 */
export const CountStatisticAccessRuleShapeType: ShapeType<CountStatisticAccessRule> =
  {
    schema: countStatisticAccessRuleSchemaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistics#CountStatisticAccessRuleShape",
    context: countStatisticAccessRuleSchemaContext,
  };

/**
 * CountAllowedPath ShapeType
 */
export const CountAllowedPathShapeType: ShapeType<CountAllowedPath> = {
  schema: countStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#CountAllowedPathShape",
  context: countStatisticAccessRuleSchemaContext,
};

/**
 * GraphPath ShapeType
 */
export const GraphPathShapeType: ShapeType<GraphPath> = {
  schema: countStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPathShape",
  context: countStatisticAccessRuleSchemaContext,
};

/**
 * GraphNodeFilter ShapeType
 */
export const GraphNodeFilterShapeType: ShapeType<GraphNodeFilter> = {
  schema: countStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
  context: countStatisticAccessRuleSchemaContext,
};

/**
 * GraphPredicateFilter ShapeType
 */
export const GraphPredicateFilterShapeType: ShapeType<GraphPredicateFilter> = {
  schema: countStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPredicateFilterShape",
  context: countStatisticAccessRuleSchemaContext,
};

/**
 * GraphTraversalStep ShapeType
 */
export const GraphTraversalStepShapeType: ShapeType<GraphTraversalStep> = {
  schema: countStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphTraversalStepShape",
  context: countStatisticAccessRuleSchemaContext,
};

/**
 * GraphValueSelector ShapeType
 */
export const GraphValueSelectorShapeType: ShapeType<GraphValueSelector> = {
  schema: countStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
  context: countStatisticAccessRuleSchemaContext,
};

/**
 * GraphLiteralFilter ShapeType
 */
export const GraphLiteralFilterShapeType: ShapeType<GraphLiteralFilter> = {
  schema: countStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphLiteralFilterShape",
  context: countStatisticAccessRuleSchemaContext,
};
