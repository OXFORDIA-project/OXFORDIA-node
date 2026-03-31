import { LdoJsonldContext, LdSet } from "@ldo/ldo";

/**
 * =============================================================================
 * Typescript Typings for statisticAccessRuleDocument
 * =============================================================================
 */

/**
 * StatisticAccessRuleDocument Type
 */
export interface StatisticAccessRuleDocument {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "StatisticAccessRule";
  }>;
  dataSchema: string;
  hasStatisticPolicy?: LdSet<StatisticPolicy>;
}

/**
 * StatisticPolicy Type
 */
export interface StatisticPolicy {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  statisticName: string;
}
