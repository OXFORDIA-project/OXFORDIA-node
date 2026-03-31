"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticPolicyShapeType = exports.StatisticAccessRuleDocumentShapeType = void 0;
const statisticAccessRuleDocument_schema_1 = require("./statisticAccessRuleDocument.schema");
const statisticAccessRuleDocument_context_1 = require("./statisticAccessRuleDocument.context");
/**
 * =============================================================================
 * LDO ShapeTypes statisticAccessRuleDocument
 * =============================================================================
 */
/**
 * StatisticAccessRuleDocument ShapeType
 */
exports.StatisticAccessRuleDocumentShapeType = {
    schema: statisticAccessRuleDocument_schema_1.statisticAccessRuleDocumentSchema,
    shape: "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRuleDocumentShape",
    context: statisticAccessRuleDocument_context_1.statisticAccessRuleDocumentContext,
};
/**
 * StatisticPolicy ShapeType
 */
exports.StatisticPolicyShapeType = {
    schema: statisticAccessRuleDocument_schema_1.statisticAccessRuleDocumentSchema,
    shape: "https://oxfordia.setmeld.com/statistic-access-rule#StatisticPolicyShape",
    context: statisticAccessRuleDocument_context_1.statisticAccessRuleDocumentContext,
};
//# sourceMappingURL=statisticAccessRuleDocument.shapeTypes.js.map