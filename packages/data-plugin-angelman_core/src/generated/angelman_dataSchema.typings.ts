import type { LdoJsonldContext, LdSet } from "@ldo/ldo";

/**
 * =============================================================================
 * Typescript Typings for angelman_dataSchema
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
  /**
   * Unique study record identifier (REDCap: record_id)
   */
  RecordID?: ID;
  /**
   * Sex of the participant (REDCap: d_gender). 1=Male, 2=Female | Dominant hand of participant (REDCap: d_dominant). 1=Left, 2=Right, 3=Ambidextrous, 4=Not determined
   */
  isCategorizedBy?: LdSet<
    | {
        "@id": "GenderMale";
      }
    | {
        "@id": "GenderFemale";
      }
    | {
        "@id": "GenderOther";
      }
    | {
        "@id": "DominantHandRight";
      }
    | {
        "@id": "DominantHandLeft";
      }
    | {
        "@id": "DominantHandMixed";
      }
    | {
        "@id": "DominantHandUnknown";
      }
  >;
  /**
   * Age at date of screening in decimal years (REDCap: es_age, number_1dp)
   */
  AgeAtScreening?: BaselineAgeMagnitude;
  /**
   * Clinical assessment visits attended by this participant
   */
  StudyVisits?: LdSet<StudyVisit>;
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
  /**
   * The record identifier text value
   */
  IDString?: string;
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
  hasAspect?: {
    "@id": "AspectAge";
  };
  hasUnitOfMeasure?: {
    "@id": "UnitYear";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * StudyVisit Type
 */
export interface StudyVisit {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Determination";
  }>;
  /**
   * Which numbered study visit this record represents (Baseline, Visit 2–6)
   */
  VisitType?:
    | {
        "@id": "VisitTypeBaseline";
      }
    | {
        "@id": "VisitTypeVisit2";
      }
    | {
        "@id": "VisitTypeVisit3";
      }
    | {
        "@id": "VisitTypeVisit4";
      }
    | {
        "@id": "VisitTypeVisit5";
      }
    | {
        "@id": "VisitTypeVisit6";
      };
  /**
   * The enrolled study participant assessed at this visit
   */
  Participant?: Person;
  /**
   * Participant age in decimal years at the time of this visit
   */
  AgeAtVisit?: VisitAgeMagnitude;
  /**
   * PedsQL Family Impact Module for carers of children under 7, referencing the past 1 month (REDCap form: pedsql_family_impact_module, sections fim_*_q* without _7_ suffix) | PedsQL Family Impact Module referencing the past 7 days (REDCap form: pedsql_family_impact_module, sections fim_*_7_q*) | PedsQL age-banded QoL Inventory (parent-reported) covering Physical, Emotional, Social, and School/Work functioning (REDCap form: pedsql_adult_quality_of_life_inventory)
   */
  "PedsQLFIM—YoungChild(1Month)"?: LdSet<
    PedsQLFIMYoungResult | PedsQLFIM7PlusResult | PedsQLAdultResult
  >;
}

/**
 * VisitAgeMagnitude Type
 */
export interface VisitAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectAgeAtVisit";
  };
  hasUnitOfMeasure?: {
    "@id": "UnitYear";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * PedsQLFIMYoungResult Type
 */
export interface PedsQLFIMYoungResult {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Content";
  }>;
  /**
   * PedsQL FIM instrument for young children, 1-month reference period
   */
  InstrumentConcept?: {
    "@id": "ConceptFIMYoungChild";
  };
  PhysicalFunctioningQ1?: LdSet<
    | FIMYoungFunctioningQ1
    | FIMYoungFunctioningQ2
    | FIMYoungFunctioningQ3
    | FIMYoungFunctioningQ4
    | FIMYoungFunctioningQ5
    | FIMYoungFunctioningQ6
    | FIMYoungEmotionalQ1
    | FIMYoungEmotionalQ2
    | FIMYoungEmotionalQ3
    | FIMYoungEmotionalQ4
    | FIMYoungEmotionalQ5
    | FIMYoungSocialQ1
    | FIMYoungSocialQ2
    | FIMYoungSocialQ3
    | FIMYoungSocialQ4
    | FIMYoungCognitiveQ1
    | FIMYoungCognitiveQ2
    | FIMYoungCognitiveQ3
    | FIMYoungCognitiveQ4
    | FIMYoungCognitiveQ5
    | FIMYoungCommunicationQ1
    | FIMYoungCommunicationQ2
    | FIMYoungCommunicationQ3
    | FIMYoungWorryQ1
    | FIMYoungWorryQ2
    | FIMYoungWorryQ3
    | FIMYoungWorryQ4
    | FIMYoungWorryQ5
    | FIMYoungActivitiesQ1
    | FIMYoungActivitiesQ2
    | FIMYoungActivitiesQ3
    | FIMYoungRelationshipsQ1
    | FIMYoungRelationshipsQ2
    | FIMYoungRelationshipsQ3
    | FIMYoungRelationshipsQ4
    | FIMYoungRelationshipsQ5
  >;
}

/**
 * FIMYoungFunctioningQ1 Type
 */
export interface FIMYoungFunctioningQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMFunctioningQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungFunctioningQ2 Type
 */
export interface FIMYoungFunctioningQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMFunctioningQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungFunctioningQ3 Type
 */
export interface FIMYoungFunctioningQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMFunctioningQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungFunctioningQ4 Type
 */
export interface FIMYoungFunctioningQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMFunctioningQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungFunctioningQ5 Type
 */
export interface FIMYoungFunctioningQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMFunctioningQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungFunctioningQ6 Type
 */
export interface FIMYoungFunctioningQ6 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMFunctioningQ6";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungEmotionalQ1 Type
 */
export interface FIMYoungEmotionalQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMEmotionalQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungEmotionalQ2 Type
 */
export interface FIMYoungEmotionalQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMEmotionalQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungEmotionalQ3 Type
 */
export interface FIMYoungEmotionalQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMEmotionalQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungEmotionalQ4 Type
 */
export interface FIMYoungEmotionalQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMEmotionalQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungEmotionalQ5 Type
 */
export interface FIMYoungEmotionalQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMEmotionalQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungSocialQ1 Type
 */
export interface FIMYoungSocialQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMSocialQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungSocialQ2 Type
 */
export interface FIMYoungSocialQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMSocialQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungSocialQ3 Type
 */
export interface FIMYoungSocialQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMSocialQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungSocialQ4 Type
 */
export interface FIMYoungSocialQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMSocialQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungCognitiveQ1 Type
 */
export interface FIMYoungCognitiveQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMCognitiveQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungCognitiveQ2 Type
 */
export interface FIMYoungCognitiveQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMCognitiveQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungCognitiveQ3 Type
 */
export interface FIMYoungCognitiveQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMCognitiveQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungCognitiveQ4 Type
 */
export interface FIMYoungCognitiveQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMCognitiveQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungCognitiveQ5 Type
 */
export interface FIMYoungCognitiveQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMCognitiveQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungCommunicationQ1 Type
 */
export interface FIMYoungCommunicationQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMCommunicationQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungCommunicationQ2 Type
 */
export interface FIMYoungCommunicationQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMCommunicationQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungCommunicationQ3 Type
 */
export interface FIMYoungCommunicationQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMCommunicationQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungWorryQ1 Type
 */
export interface FIMYoungWorryQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMWorryQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungWorryQ2 Type
 */
export interface FIMYoungWorryQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMWorryQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungWorryQ3 Type
 */
export interface FIMYoungWorryQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMWorryQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungWorryQ4 Type
 */
export interface FIMYoungWorryQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMWorryQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungWorryQ5 Type
 */
export interface FIMYoungWorryQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMWorryQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungActivitiesQ1 Type
 */
export interface FIMYoungActivitiesQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMActivitiesQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungActivitiesQ2 Type
 */
export interface FIMYoungActivitiesQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMActivitiesQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungActivitiesQ3 Type
 */
export interface FIMYoungActivitiesQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMActivitiesQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungRelationshipsQ1 Type
 */
export interface FIMYoungRelationshipsQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMRelationshipsQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungRelationshipsQ2 Type
 */
export interface FIMYoungRelationshipsQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMRelationshipsQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungRelationshipsQ3 Type
 */
export interface FIMYoungRelationshipsQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMRelationshipsQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungRelationshipsQ4 Type
 */
export interface FIMYoungRelationshipsQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMRelationshipsQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIMYoungRelationshipsQ5 Type
 */
export interface FIMYoungRelationshipsQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIMRelationshipsQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * PedsQLFIM7PlusResult Type
 */
export interface PedsQLFIM7PlusResult {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Content";
  }>;
  /**
   * PedsQL FIM instrument with 7-day reference period
   */
  InstrumentConcept?: {
    "@id": "ConceptFIM7Plus";
  };
  PhysicalFunctioningQ1?: LdSet<
    | FIM7PhysicalQ1
    | FIM7PhysicalQ2
    | FIM7PhysicalQ3
    | FIM7PhysicalQ4
    | FIM7PhysicalQ5
    | FIM7PhysicalQ6
    | FIM7EmotionalQ1
    | FIM7EmotionalQ2
    | FIM7EmotionalQ3
    | FIM7EmotionalQ4
    | FIM7EmotionalQ5
    | FIM7SocialQ1
    | FIM7SocialQ2
    | FIM7SocialQ3
    | FIM7SocialQ4
    | FIM7CognitiveQ1
    | FIM7CognitiveQ2
    | FIM7CognitiveQ3
    | FIM7CognitiveQ4
    | FIM7CognitiveQ5
    | FIM7CommunicationQ6
    | FIM7CommunicationQ7
    | FIM7CommunicationQ8
    | FIM7WorryQ1
    | FIM7WorryQ2
    | FIM7WorryQ3
    | FIM7WorryQ4
    | FIM7WorryQ5
    | FIM7DailyActivitiesQ1
    | FIM7DailyActivitiesQ2
    | FIM7DailyActivitiesQ3
    | FIM7FamilyRelationshipsQ4
    | FIM7FamilyRelationshipsQ5
    | FIM7FamilyRelationshipsQ6
    | FIM7FamilyRelationshipsQ7
    | FIM7FamilyRelationshipsQ8
  >;
}

/**
 * FIM7PhysicalQ1 Type
 */
export interface FIM7PhysicalQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7PhysicalQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7PhysicalQ2 Type
 */
export interface FIM7PhysicalQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7PhysicalQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7PhysicalQ3 Type
 */
export interface FIM7PhysicalQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7PhysicalQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7PhysicalQ4 Type
 */
export interface FIM7PhysicalQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7PhysicalQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7PhysicalQ5 Type
 */
export interface FIM7PhysicalQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7PhysicalQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7PhysicalQ6 Type
 */
export interface FIM7PhysicalQ6 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7PhysicalQ6";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7EmotionalQ1 Type
 */
export interface FIM7EmotionalQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7EmotionalQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7EmotionalQ2 Type
 */
export interface FIM7EmotionalQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7EmotionalQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7EmotionalQ3 Type
 */
export interface FIM7EmotionalQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7EmotionalQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7EmotionalQ4 Type
 */
export interface FIM7EmotionalQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7EmotionalQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7EmotionalQ5 Type
 */
export interface FIM7EmotionalQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7EmotionalQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7SocialQ1 Type
 */
export interface FIM7SocialQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7SocialQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7SocialQ2 Type
 */
export interface FIM7SocialQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7SocialQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7SocialQ3 Type
 */
export interface FIM7SocialQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7SocialQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7SocialQ4 Type
 */
export interface FIM7SocialQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7SocialQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7CognitiveQ1 Type
 */
export interface FIM7CognitiveQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7CognitiveQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7CognitiveQ2 Type
 */
export interface FIM7CognitiveQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7CognitiveQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7CognitiveQ3 Type
 */
export interface FIM7CognitiveQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7CognitiveQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7CognitiveQ4 Type
 */
export interface FIM7CognitiveQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7CognitiveQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7CognitiveQ5 Type
 */
export interface FIM7CognitiveQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7CognitiveQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7CommunicationQ6 Type
 */
export interface FIM7CommunicationQ6 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7CommunicationQ6";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7CommunicationQ7 Type
 */
export interface FIM7CommunicationQ7 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7CommunicationQ7";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7CommunicationQ8 Type
 */
export interface FIM7CommunicationQ8 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7CommunicationQ8";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7WorryQ1 Type
 */
export interface FIM7WorryQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7WorryQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7WorryQ2 Type
 */
export interface FIM7WorryQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7WorryQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7WorryQ3 Type
 */
export interface FIM7WorryQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7WorryQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7WorryQ4 Type
 */
export interface FIM7WorryQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7WorryQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7WorryQ5 Type
 */
export interface FIM7WorryQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7WorryQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7DailyActivitiesQ1 Type
 */
export interface FIM7DailyActivitiesQ1 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7DailyActivitiesQ1";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7DailyActivitiesQ2 Type
 */
export interface FIM7DailyActivitiesQ2 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7DailyActivitiesQ2";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7DailyActivitiesQ3 Type
 */
export interface FIM7DailyActivitiesQ3 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7DailyActivitiesQ3";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7FamilyRelationshipsQ4 Type
 */
export interface FIM7FamilyRelationshipsQ4 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7FamilyRelationshipsQ4";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7FamilyRelationshipsQ5 Type
 */
export interface FIM7FamilyRelationshipsQ5 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7FamilyRelationshipsQ5";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7FamilyRelationshipsQ6 Type
 */
export interface FIM7FamilyRelationshipsQ6 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7FamilyRelationshipsQ6";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7FamilyRelationshipsQ7 Type
 */
export interface FIM7FamilyRelationshipsQ7 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7FamilyRelationshipsQ7";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * FIM7FamilyRelationshipsQ8 Type
 */
export interface FIM7FamilyRelationshipsQ8 {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?: {
    "@id": "AspectFIM7FamilyRelationshipsQ8";
  };
  "Age(years,1D.p.)"?: number;
}

/**
 * PedsQLAdultResult Type
 */
export interface PedsQLAdultResult {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Content";
  }>;
  /**
   * PedsQL QoL instrument, age-banded parent-reported form
   */
  InstrumentConcept?: {
    "@id": "ConceptAdultQoL";
  };
  /**
   * PedsQL age band determining which item set applies (REDCap: age_calculate). 2=Toddlers 2-4, 11=Young Children 5-7, 10=Children 8-12, 8=Teens 13-18, 4=Young Adults 18-25, 2=Adults 26+
   */
  AgeBand?:
    | {
        "@id": "AgeBand2to4";
      }
    | {
        "@id": "AgeBand5to7";
      }
    | {
        "@id": "AgeBand8to12";
      }
    | {
        "@id": "AgeBand13to17";
      }
    | {
        "@id": "AgeBand18to25";
      }
    | {
        "@id": "AgeBand26Plus";
      };
  /**
   * A single item response from the age-appropriate PedsQL subscale. The aspect IRI encodes the REDCap column number (e.g. ag:Aspect_Adult_Q107). Items scored 0–4.
   */
  PhysicalFunctioningQ1?: LdSet<AdultItemMagnitude>;
}

/**
 * AdultItemMagnitude Type
 */
export interface AdultItemMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect?:
    | {
        "@id": "AspectAdultQ107";
      }
    | {
        "@id": "AspectAdultQ108";
      }
    | {
        "@id": "AspectAdultQ109";
      }
    | {
        "@id": "AspectAdultQ110";
      }
    | {
        "@id": "AspectAdultQ111";
      }
    | {
        "@id": "AspectAdultQ112";
      }
    | {
        "@id": "AspectAdultQ113";
      }
    | {
        "@id": "AspectAdultQ114";
      }
    | {
        "@id": "AspectAdultQ115";
      }
    | {
        "@id": "AspectAdultQ116";
      }
    | {
        "@id": "AspectAdultQ117";
      }
    | {
        "@id": "AspectAdultQ118";
      }
    | {
        "@id": "AspectAdultQ119";
      }
    | {
        "@id": "AspectAdultQ120";
      }
    | {
        "@id": "AspectAdultQ121";
      }
    | {
        "@id": "AspectAdultQ122";
      }
    | {
        "@id": "AspectAdultQ123";
      }
    | {
        "@id": "AspectAdultQ124";
      }
    | {
        "@id": "AspectAdultQ125";
      }
    | {
        "@id": "AspectAdultQ126";
      }
    | {
        "@id": "AspectAdultQ127";
      }
    | {
        "@id": "AspectAdultQ128";
      }
    | {
        "@id": "AspectAdultQ129";
      }
    | {
        "@id": "AspectAdultQ137";
      }
    | {
        "@id": "AspectAdultQ138";
      }
    | {
        "@id": "AspectAdultQ139";
      }
    | {
        "@id": "AspectAdultQ140";
      }
    | {
        "@id": "AspectAdultQ141";
      }
    | {
        "@id": "AspectAdultQ142";
      }
    | {
        "@id": "AspectAdultQ143";
      }
    | {
        "@id": "AspectAdultQ144";
      }
    | {
        "@id": "AspectAdultQ145";
      }
    | {
        "@id": "AspectAdultQ146";
      }
    | {
        "@id": "AspectAdultQ147";
      }
    | {
        "@id": "AspectAdultQ148";
      }
    | {
        "@id": "AspectAdultQ149";
      }
    | {
        "@id": "AspectAdultQ150";
      }
    | {
        "@id": "AspectAdultQ151";
      }
    | {
        "@id": "AspectAdultQ152";
      }
    | {
        "@id": "AspectAdultQ153";
      }
    | {
        "@id": "AspectAdultQ154";
      }
    | {
        "@id": "AspectAdultQ155";
      }
    | {
        "@id": "AspectAdultQ156";
      }
    | {
        "@id": "AspectAdultQ157";
      }
    | {
        "@id": "AspectAdultQ158";
      }
    | {
        "@id": "AspectAdultQ159";
      }
    | {
        "@id": "AspectAdultQ166";
      }
    | {
        "@id": "AspectAdultQ167";
      }
    | {
        "@id": "AspectAdultQ168";
      }
    | {
        "@id": "AspectAdultQ169";
      }
    | {
        "@id": "AspectAdultQ170";
      }
    | {
        "@id": "AspectAdultQ171";
      }
    | {
        "@id": "AspectAdultQ172";
      }
    | {
        "@id": "AspectAdultQ173";
      }
    | {
        "@id": "AspectAdultQ174";
      }
    | {
        "@id": "AspectAdultQ175";
      }
    | {
        "@id": "AspectAdultQ176";
      }
    | {
        "@id": "AspectAdultQ177";
      }
    | {
        "@id": "AspectAdultQ178";
      }
    | {
        "@id": "AspectAdultQ179";
      }
    | {
        "@id": "AspectAdultQ180";
      }
    | {
        "@id": "AspectAdultQ181";
      }
    | {
        "@id": "AspectAdultQ182";
      }
    | {
        "@id": "AspectAdultQ183";
      }
    | {
        "@id": "AspectAdultQ184";
      }
    | {
        "@id": "AspectAdultQ185";
      }
    | {
        "@id": "AspectAdultQ186";
      }
    | {
        "@id": "AspectAdultQ187";
      }
    | {
        "@id": "AspectAdultQ188";
      }
    | {
        "@id": "AspectAdultQ193";
      }
    | {
        "@id": "AspectAdultQ194";
      }
    | {
        "@id": "AspectAdultQ195";
      }
    | {
        "@id": "AspectAdultQ196";
      }
    | {
        "@id": "AspectAdultQ197";
      }
    | {
        "@id": "AspectAdultQ198";
      }
    | {
        "@id": "AspectAdultQ199";
      }
    | {
        "@id": "AspectAdultQ200";
      }
    | {
        "@id": "AspectAdultQ201";
      }
    | {
        "@id": "AspectAdultQ202";
      }
    | {
        "@id": "AspectAdultQ203";
      }
    | {
        "@id": "AspectAdultQ204";
      }
    | {
        "@id": "AspectAdultQ205";
      }
    | {
        "@id": "AspectAdultQ206";
      }
    | {
        "@id": "AspectAdultQ207";
      }
    | {
        "@id": "AspectAdultQ208";
      }
    | {
        "@id": "AspectAdultQ209";
      }
    | {
        "@id": "AspectAdultQ210";
      }
    | {
        "@id": "AspectAdultQ211";
      }
    | {
        "@id": "AspectAdultQ212";
      }
    | {
        "@id": "AspectAdultQ213";
      }
    | {
        "@id": "AspectAdultQ214";
      }
    | {
        "@id": "AspectAdultQ215";
      }
    | {
        "@id": "AspectAdultQ340";
      }
    | {
        "@id": "AspectAdultQ342";
      }
    | {
        "@id": "AspectAdultQ343";
      }
    | {
        "@id": "AspectAdultQ344";
      }
    | {
        "@id": "AspectAdultQ345";
      }
    | {
        "@id": "AspectAdultQ346";
      }
    | {
        "@id": "AspectAdultQ347";
      }
    | {
        "@id": "AspectAdultQ348";
      }
    | {
        "@id": "AspectAdultQ349";
      }
    | {
        "@id": "AspectAdultQ350";
      }
    | {
        "@id": "AspectAdultQ351";
      }
    | {
        "@id": "AspectAdultQ352";
      }
    | {
        "@id": "AspectAdultQ353";
      }
    | {
        "@id": "AspectAdultQ354";
      }
    | {
        "@id": "AspectAdultQ355";
      }
    | {
        "@id": "AspectAdultQ356";
      }
    | {
        "@id": "AspectAdultQ357";
      }
    | {
        "@id": "AspectAdultQ358";
      }
    | {
        "@id": "AspectAdultQ359";
      }
    | {
        "@id": "AspectAdultQ360";
      }
    | {
        "@id": "AspectAdultQ361";
      }
    | {
        "@id": "AspectAdultQ362";
      }
    | {
        "@id": "AspectAdultQ363";
      }
    | {
        "@id": "AspectAdultQ77";
      }
    | {
        "@id": "AspectAdultQ78";
      }
    | {
        "@id": "AspectAdultQ79";
      }
    | {
        "@id": "AspectAdultQ80";
      }
    | {
        "@id": "AspectAdultQ81";
      }
    | {
        "@id": "AspectAdultQ82";
      }
    | {
        "@id": "AspectAdultQ83";
      }
    | {
        "@id": "AspectAdultQ84";
      }
    | {
        "@id": "AspectAdultQ85";
      }
    | {
        "@id": "AspectAdultQ86";
      }
    | {
        "@id": "AspectAdultQ87";
      }
    | {
        "@id": "AspectAdultQ88";
      }
    | {
        "@id": "AspectAdultQ89";
      }
    | {
        "@id": "AspectAdultQ90";
      }
    | {
        "@id": "AspectAdultQ91";
      }
    | {
        "@id": "AspectAdultQ92";
      }
    | {
        "@id": "AspectAdultQ93";
      }
    | {
        "@id": "AspectAdultQ94";
      }
    | {
        "@id": "AspectAdultQ95";
      }
    | {
        "@id": "AspectAdultQ96";
      }
    | {
        "@id": "AspectAdultQ97";
      };
  "Age(years,1D.p.)"?: number;
}
