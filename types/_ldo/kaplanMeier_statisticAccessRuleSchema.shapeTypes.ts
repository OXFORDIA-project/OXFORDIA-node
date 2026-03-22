import { ShapeType } from "@ldo/ldo";
import { kaplanMeier_statisticAccessRuleSchemaSchema } from "./kaplanMeier_statisticAccessRuleSchema.schema";
import { kaplanMeier_statisticAccessRuleSchemaContext } from "./kaplanMeier_statisticAccessRuleSchema.context";
import { KaplanMeierStatisticAccessRule } from "./kaplanMeier_statisticAccessRuleSchema.typings";

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
      "https://fedresda.setmeld.com/statistics#KaplanMeierStatisticAccessRuleShape",
    context: kaplanMeier_statisticAccessRuleSchemaContext,
  };
