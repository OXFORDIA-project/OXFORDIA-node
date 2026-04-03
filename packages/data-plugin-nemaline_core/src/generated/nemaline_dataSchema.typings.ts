import { LdoJsonldContext, LdSet } from "@ldo/ldo";

/**
 * =============================================================================
 * Typescript Typings for nemaline_dataSchema
 * =============================================================================
 */

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
