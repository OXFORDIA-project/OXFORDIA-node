import type { ShapeType } from "@ldo/ldo";
import { standardDeviationStatisticAccessRuleSchemaSchema } from "./standardDeviation_statisticAccessRuleSchema.schema";
import { standardDeviationStatisticAccessRuleSchemaContext } from "./standardDeviation_statisticAccessRuleSchema.context";
import type {
  StandardDeviationStatisticAccessRule,
  StandardDeviationAllowedPath,
  GraphPath,
  GraphNodeFilter,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
  GraphLiteralFilter,
} from "./standardDeviation_statisticAccessRuleSchema.typings";

/**
 * =============================================================================
 * LDO ShapeTypes standardDeviation_statisticAccessRuleSchema
 * =============================================================================
 */

/**
 * StandardDeviationStatisticAccessRule ShapeType
 */
export const StandardDeviationStatisticAccessRuleShapeType: ShapeType<StandardDeviationStatisticAccessRule> =
  {
    schema: standardDeviationStatisticAccessRuleSchemaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistics#StandardDeviationStatisticAccessRuleShape",
    context: standardDeviationStatisticAccessRuleSchemaContext,
  };

/**
 * StandardDeviationAllowedPath ShapeType
 */
export const StandardDeviationAllowedPathShapeType: ShapeType<StandardDeviationAllowedPath> =
  {
    schema: standardDeviationStatisticAccessRuleSchemaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistics#StandardDeviationAllowedPathShape",
    context: standardDeviationStatisticAccessRuleSchemaContext,
  };

/**
 * GraphPath ShapeType
 */
export const GraphPathShapeType: ShapeType<GraphPath> = {
  schema: standardDeviationStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPathShape",
  context: standardDeviationStatisticAccessRuleSchemaContext,
};

/**
 * GraphNodeFilter ShapeType
 */
export const GraphNodeFilterShapeType: ShapeType<GraphNodeFilter> = {
  schema: standardDeviationStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
  context: standardDeviationStatisticAccessRuleSchemaContext,
};

/**
 * GraphPredicateFilter ShapeType
 */
export const GraphPredicateFilterShapeType: ShapeType<GraphPredicateFilter> = {
  schema: standardDeviationStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPredicateFilterShape",
  context: standardDeviationStatisticAccessRuleSchemaContext,
};

/**
 * GraphTraversalStep ShapeType
 */
export const GraphTraversalStepShapeType: ShapeType<GraphTraversalStep> = {
  schema: standardDeviationStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphTraversalStepShape",
  context: standardDeviationStatisticAccessRuleSchemaContext,
};

/**
 * GraphValueSelector ShapeType
 */
export const GraphValueSelectorShapeType: ShapeType<GraphValueSelector> = {
  schema: standardDeviationStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
  context: standardDeviationStatisticAccessRuleSchemaContext,
};

/**
 * GraphLiteralFilter ShapeType
 */
export const GraphLiteralFilterShapeType: ShapeType<GraphLiteralFilter> = {
  schema: standardDeviationStatisticAccessRuleSchemaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphLiteralFilterShape",
  context: standardDeviationStatisticAccessRuleSchemaContext,
};
