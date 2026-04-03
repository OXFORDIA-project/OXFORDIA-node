"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphLiteralFilterShapeType = exports.GraphValueSelectorShapeType = exports.GraphTraversalStepShapeType = exports.GraphPredicateFilterShapeType = exports.GraphNodeFilterShapeType = exports.GraphPathShapeType = void 0;
const graphPath_schema_1 = require("./graphPath.schema");
const graphPath_context_1 = require("./graphPath.context");
/**
 * =============================================================================
 * LDO ShapeTypes graphPath
 * =============================================================================
 */
/**
 * GraphPath ShapeType
 */
exports.GraphPathShapeType = {
    schema: graphPath_schema_1.graphPathSchema,
    shape: "https://oxfordia.setmeld.com/statistics#GraphPathShape",
    context: graphPath_context_1.graphPathContext,
};
/**
 * GraphNodeFilter ShapeType
 */
exports.GraphNodeFilterShapeType = {
    schema: graphPath_schema_1.graphPathSchema,
    shape: "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
    context: graphPath_context_1.graphPathContext,
};
/**
 * GraphPredicateFilter ShapeType
 */
exports.GraphPredicateFilterShapeType = {
    schema: graphPath_schema_1.graphPathSchema,
    shape: "https://oxfordia.setmeld.com/statistics#GraphPredicateFilterShape",
    context: graphPath_context_1.graphPathContext,
};
/**
 * GraphTraversalStep ShapeType
 */
exports.GraphTraversalStepShapeType = {
    schema: graphPath_schema_1.graphPathSchema,
    shape: "https://oxfordia.setmeld.com/statistics#GraphTraversalStepShape",
    context: graphPath_context_1.graphPathContext,
};
/**
 * GraphValueSelector ShapeType
 */
exports.GraphValueSelectorShapeType = {
    schema: graphPath_schema_1.graphPathSchema,
    shape: "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
    context: graphPath_context_1.graphPathContext,
};
/**
 * GraphLiteralFilter ShapeType
 */
exports.GraphLiteralFilterShapeType = {
    schema: graphPath_schema_1.graphPathSchema,
    shape: "https://oxfordia.setmeld.com/statistics#GraphLiteralFilterShape",
    context: graphPath_context_1.graphPathContext,
};
//# sourceMappingURL=graphPath.shapeTypes.js.map