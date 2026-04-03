import { LdoJsonldContext, LdSet } from "@ldo/ldo";

/**
 * =============================================================================
 * Typescript Typings for kaplanMeier_statisticAccessRuleSchema
 * =============================================================================
 */

/**
 * KaplanMeierStatisticAccessRule Type
 */
export interface KaplanMeierStatisticAccessRule {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  allowedPath: LdSet<KaplanMeierAllowedPath>;
}

/**
 * KaplanMeierAllowedPath Type
 */
export interface KaplanMeierAllowedPath {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  timeGraphPath: GraphPath;
  eventGraphPath: GraphPath;
  groupByGraphPath?: LdSet<GraphPath>;
  kAnonymity: number;
}

/**
 * GraphPath Type
 */
export interface GraphPath {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  name?: string;
  start: GraphNodeFilter;
  steps?: LdSet<GraphTraversalStep>;
  target?: GraphValueSelector;
}

/**
 * GraphNodeFilter Type
 */
export interface GraphNodeFilter {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  rdfType?: LdSet<string>;
  iri?: LdSet<string>;
  categories?: LdSet<string>;
  predicates?: LdSet<GraphPredicateFilter>;
}

/**
 * GraphPredicateFilter Type
 */
export interface GraphPredicateFilter {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  predicate: {
    "@id": string;
  };
  inverse?: boolean;
  some?: GraphValueSelector;
  every?: GraphValueSelector;
  none?: GraphValueSelector;
}

/**
 * GraphTraversalStep Type
 */
export interface GraphTraversalStep {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  via: {
    "@id": string;
  };
  inverse?: boolean;
  where?: GraphNodeFilter;
}

/**
 * GraphValueSelector Type
 */
export interface GraphValueSelector {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
}

/**
 * GraphLiteralFilter Type
 */
export interface GraphLiteralFilter {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  datatype?: LdSet<string>;
  lang?: LdSet<string>;
  equals?: any;
  oneOf?: LdSet<any>;
  min?: number;
  max?: number;
}
