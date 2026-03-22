import { ShapeType } from "@ldo/ldo";
import { statisticAccessRuleDocumentSchema } from "./statisticAccessRuleDocument.schema";
import { statisticAccessRuleDocumentContext } from "./statisticAccessRuleDocument.context";
import {
  StatisticAccessRuleDocument,
  StatisticPolicy,
} from "./statisticAccessRuleDocument.typings";

/**
 * =============================================================================
 * LDO ShapeTypes statisticAccessRuleDocument
 * =============================================================================
 */

/**
 * StatisticAccessRuleDocument ShapeType
 */
export const StatisticAccessRuleDocumentShapeType: ShapeType<StatisticAccessRuleDocument> =
  {
    schema: statisticAccessRuleDocumentSchema,
    shape:
      "https://fedresda.setmeld.com/statistic-access-rule#StatisticAccessRuleDocumentShape",
    context: statisticAccessRuleDocumentContext,
  };

/**
 * StatisticPolicy ShapeType
 */
export const StatisticPolicyShapeType: ShapeType<StatisticPolicy> = {
  schema: statisticAccessRuleDocumentSchema,
  shape:
    "https://fedresda.setmeld.com/statistic-access-rule#StatisticPolicyShape",
  context: statisticAccessRuleDocumentContext,
};
