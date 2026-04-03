import { ShapeType } from "@ldo/ldo";
import { graphPathSchema } from "./graphPath.schema";
import { graphPathContext } from "./graphPath.context";
import {
  GraphPath,
  GraphNodeFilter,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
  GraphLiteralFilter,
} from "./graphPath.typings";

/**
 * =============================================================================
 * LDO ShapeTypes graphPath
 * =============================================================================
 */

/**
 * GraphPath ShapeType
 */
export const GraphPathShapeType: ShapeType<GraphPath> = {
  schema: graphPathSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPathShape",
  context: graphPathContext,
};

/**
 * GraphNodeFilter ShapeType
 */
export const GraphNodeFilterShapeType: ShapeType<GraphNodeFilter> = {
  schema: graphPathSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
  context: graphPathContext,
};

/**
 * GraphPredicateFilter ShapeType
 */
export const GraphPredicateFilterShapeType: ShapeType<GraphPredicateFilter> = {
  schema: graphPathSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPredicateFilterShape",
  context: graphPathContext,
};

/**
 * GraphTraversalStep ShapeType
 */
export const GraphTraversalStepShapeType: ShapeType<GraphTraversalStep> = {
  schema: graphPathSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphTraversalStepShape",
  context: graphPathContext,
};

/**
 * GraphValueSelector ShapeType
 */
export const GraphValueSelectorShapeType: ShapeType<GraphValueSelector> = {
  schema: graphPathSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
  context: graphPathContext,
};

/**
 * GraphLiteralFilter ShapeType
 */
export const GraphLiteralFilterShapeType: ShapeType<GraphLiteralFilter> = {
  schema: graphPathSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphLiteralFilterShape",
  context: graphPathContext,
};
