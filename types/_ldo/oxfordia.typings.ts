import { LdoJsonldContext, LdSet } from "@ldo/ldo";

/**
 * =============================================================================
 * Typescript Typings for oxfordia
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

/**
 * Person Type
 */
export interface Person {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Person";
  }>;
  isIdentifiedBy: ID;
  isCategorizedBy?: LdSet<
    | {
        "@id": "Cluster1";
      }
    | {
        "@id": "Cluster2";
      }
    | {
        "@id": "Cluster3";
      }
    | {
        "@id": "GeneticGroupVariant1";
      }
    | {
        "@id": "GeneticGroupVariant2";
      }
    | {
        "@id": "GeneticGroupVariant3";
      }
    | {
        "@id": "LeftHanded";
      }
    | {
        "@id": "RightHanded";
      }
    | {
        "@id": "StatusAmbulant";
      }
    | {
        "@id": "StatusNonAmbulant";
      }
    | {
        "@id": "PerformanceBelowAverage";
      }
  >;
  hasMagnitude?: LdSet<
    BaselineAgeMagnitude | LoAAgeMagnitude | TotalMFMMagnitude
  >;
  hasParticipant?: LdSet<MFMAssessmentEvent | KaplanMeierObservation>;
}

/**
 * MFMAssessmentEvent Type
 */
export interface MFMAssessmentEvent {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Determination";
  }>;
  isCategorizedBy: {
    "@id": "AssessmentTypeMFM32";
  };
  hasMagnitude: TimeFromBaselineMagnitude;
  hasParticipant: Person;
  produces: AssessmentResult;
}

/**
 * KaplanMeierObservation Type
 */
export interface KaplanMeierObservation {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Determination";
  }>;
  isCategorizedBy: {
    "@id": "AssessmentTypeKaplanMeier";
  };
  hasParticipant: Person;
  hasMagnitude: LdSet<KaplanMeierEventMagnitude | KaplanMeierTimeMagnitude>;
}

/**
 * AssessmentResult Type
 */
export interface AssessmentResult {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Content";
  }>;
  isAbout: {
    "@id": "ConceptMotorFunction";
  };
  hasMagnitude: MFMScoreMagnitude;
}

/**
 * TimeFromBaselineMagnitude Type
 */
export interface TimeFromBaselineMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectDurationSinceStudyEnrollment";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * MFMScoreMagnitude Type
 */
export interface MFMScoreMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectMFM32VisitScore";
  };
  numericValue: number;
}

/**
 * TotalMFMMagnitude Type
 */
export interface TotalMFMMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectMFM32AggregateScore";
  };
  numericValue: number;
}

/**
 * KaplanMeierEventMagnitude Type
 */
export interface KaplanMeierEventMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectKaplanMeierEventIndicator";
  };
  numericValue: number;
}

/**
 * KaplanMeierTimeMagnitude Type
 */
export interface KaplanMeierTimeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectKaplanMeierTimeToEvent";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * BaselineAgeMagnitude Type
 */
export interface BaselineAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAge";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * LoAAgeMagnitude Type
 */
export interface LoAAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtLossOfAmbulation";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * ID Type
 */
export interface ID {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "ID";
  }>;
  uniqueText: string;
}

/**
 * MeanStatisticAccessRule Type
 */
export interface MeanStatisticAccessRule {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  allowedPath: LdSet<MeanAllowedPath>;
}

/**
 * MeanAllowedPath Type
 */
export interface MeanAllowedPath {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  graphPath: GraphPath;
  minCount: number;
}

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
  groupByGraphPath: GraphPath;
  kAnonymity: number;
}

/**
 * GraphPath Type
 */
export interface GraphPath {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
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
