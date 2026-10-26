import type { LdoJsonldContext } from "@ldo/ldo";

/**
 * =============================================================================
 * angelmanDataSchemaContext: JSONLD Context for angelman_dataSchema
 * =============================================================================
 */
export const angelmanDataSchemaContext: LdoJsonldContext = {
  type: {
    "@id": "@type",
    "@isCollection": true,
  },
  Person: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/Person",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      RecordID: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isIdentifiedBy",
        "@type": "@id",
      },
      isCategorizedBy: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
        "@isCollection": true,
      },
      AgeAtScreening: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
        "@type": "@id",
      },
      StudyVisits: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
        "@type": "@id",
        "@isCollection": true,
      },
    },
  },
  RecordID: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isIdentifiedBy",
    "@type": "@id",
  },
  ID: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/ID",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      IDString: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/uniqueText",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
      },
    },
  },
  IDString: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/uniqueText",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  VisitType: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
    "@isCollection": true,
  },
  GenderMale: "https://paediatrics.ox.ac.uk/angelman/terms/Gender_Male",
  GenderFemale: "https://paediatrics.ox.ac.uk/angelman/terms/Gender_Female",
  GenderOther: "https://paediatrics.ox.ac.uk/angelman/terms/Gender_Other",
  DominantHandRight:
    "https://paediatrics.ox.ac.uk/angelman/terms/DominantHand_Right",
  DominantHandLeft:
    "https://paediatrics.ox.ac.uk/angelman/terms/DominantHand_Left",
  DominantHandMixed:
    "https://paediatrics.ox.ac.uk/angelman/terms/DominantHand_Mixed",
  DominantHandUnknown:
    "https://paediatrics.ox.ac.uk/angelman/terms/DominantHand_Unknown",
  AgeAtScreening: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
    "@type": "@id",
    "@isCollection": true,
  },
  Magnitude: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      hasAspect: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
        "@isCollection": true,
      },
      hasUnitOfMeasure: {
        "@id":
          "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
      },
      "Age(years,1D.p.)": {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
        "@type": "http://www.w3.org/2001/XMLSchema#decimal",
      },
    },
  },
  hasAspect: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
    "@isCollection": true,
  },
  AspectAge: "https://w3id.org/semanticarts/ns/ontology/gist/Aspect_Age",
  hasUnitOfMeasure: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
  },
  UnitYear: "https://w3id.org/semanticarts/ns/ontology/gist/Unit_Year",
  "Age(years,1D.p.)": {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
    "@type": "http://www.w3.org/2001/XMLSchema#decimal",
  },
  StudyVisits: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
    "@type": "@id",
    "@isCollection": true,
  },
  Determination: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/Determination",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      VisitType: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
        "@isCollection": true,
      },
      Participant: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
        "@type": "@id",
      },
      AgeAtVisit: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
        "@type": "@id",
      },
      "PedsQLFIM—YoungChild(1Month)": {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/produces",
        "@type": "@id",
      },
    },
  },
  VisitTypeBaseline:
    "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Baseline",
  VisitTypeVisit2:
    "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit2",
  VisitTypeVisit3:
    "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit3",
  VisitTypeVisit4:
    "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit4",
  VisitTypeVisit5:
    "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit5",
  VisitTypeVisit6:
    "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit6",
  AspectAgeAtVisit:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_AgeAtVisit",
  "PedsQLFIM—YoungChild(1Month)": {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/produces",
    "@type": "@id",
  },
  Content: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/Content",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      InstrumentConcept: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isAbout",
        "@isCollection": true,
      },
      PhysicalFunctioningQ1: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
        "@type": "@id",
        "@isCollection": true,
      },
      AgeBand: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
        "@isCollection": true,
      },
    },
  },
  InstrumentConcept: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isAbout",
    "@isCollection": true,
  },
  ConceptFIMYoungChild:
    "https://paediatrics.ox.ac.uk/angelman/terms/Concept_FIM_YoungChild",
  AspectFIMFunctioningQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q1",
  AspectFIMFunctioningQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q2",
  AspectFIMFunctioningQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q3",
  AspectFIMFunctioningQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q4",
  AspectFIMFunctioningQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q5",
  AspectFIMFunctioningQ6:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q6",
  AspectFIMEmotionalQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q1",
  AspectFIMEmotionalQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q2",
  AspectFIMEmotionalQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q3",
  AspectFIMEmotionalQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q4",
  AspectFIMEmotionalQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q5",
  AspectFIMSocialQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Social_Q1",
  AspectFIMSocialQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Social_Q2",
  AspectFIMSocialQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Social_Q3",
  AspectFIMSocialQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Social_Q4",
  AspectFIMCognitiveQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q1",
  AspectFIMCognitiveQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q2",
  AspectFIMCognitiveQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q3",
  AspectFIMCognitiveQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q4",
  AspectFIMCognitiveQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q5",
  AspectFIMCommunicationQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Communication_Q1",
  AspectFIMCommunicationQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Communication_Q2",
  AspectFIMCommunicationQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Communication_Q3",
  AspectFIMWorryQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q1",
  AspectFIMWorryQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q2",
  AspectFIMWorryQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q3",
  AspectFIMWorryQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q4",
  AspectFIMWorryQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q5",
  AspectFIMActivitiesQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Activities_Q1",
  AspectFIMActivitiesQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Activities_Q2",
  AspectFIMActivitiesQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Activities_Q3",
  AspectFIMRelationshipsQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q1",
  AspectFIMRelationshipsQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q2",
  AspectFIMRelationshipsQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q3",
  AspectFIMRelationshipsQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q4",
  AspectFIMRelationshipsQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q5",
  ConceptFIM7Plus:
    "https://paediatrics.ox.ac.uk/angelman/terms/Concept_FIM_7Plus",
  AspectFIM7PhysicalQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q1",
  AspectFIM7PhysicalQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q2",
  AspectFIM7PhysicalQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q3",
  AspectFIM7PhysicalQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q4",
  AspectFIM7PhysicalQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q5",
  AspectFIM7PhysicalQ6:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q6",
  AspectFIM7EmotionalQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q1",
  AspectFIM7EmotionalQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q2",
  AspectFIM7EmotionalQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q3",
  AspectFIM7EmotionalQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q4",
  AspectFIM7EmotionalQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q5",
  AspectFIM7SocialQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Social_Q1",
  AspectFIM7SocialQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Social_Q2",
  AspectFIM7SocialQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Social_Q3",
  AspectFIM7SocialQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Social_Q4",
  AspectFIM7CognitiveQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q1",
  AspectFIM7CognitiveQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q2",
  AspectFIM7CognitiveQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q3",
  AspectFIM7CognitiveQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q4",
  AspectFIM7CognitiveQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q5",
  AspectFIM7CommunicationQ6:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Communication_Q6",
  AspectFIM7CommunicationQ7:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Communication_Q7",
  AspectFIM7CommunicationQ8:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Communication_Q8",
  AspectFIM7WorryQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q1",
  AspectFIM7WorryQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q2",
  AspectFIM7WorryQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q3",
  AspectFIM7WorryQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q4",
  AspectFIM7WorryQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q5",
  AspectFIM7DailyActivitiesQ1:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_DailyActivities_Q1",
  AspectFIM7DailyActivitiesQ2:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_DailyActivities_Q2",
  AspectFIM7DailyActivitiesQ3:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_DailyActivities_Q3",
  AspectFIM7FamilyRelationshipsQ4:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q4",
  AspectFIM7FamilyRelationshipsQ5:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q5",
  AspectFIM7FamilyRelationshipsQ6:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q6",
  AspectFIM7FamilyRelationshipsQ7:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q7",
  AspectFIM7FamilyRelationshipsQ8:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q8",
  ConceptAdultQoL:
    "https://paediatrics.ox.ac.uk/angelman/terms/Concept_AdultQoL",
  AgeBand2to4: "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_2to4",
  AgeBand5to7: "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_5to7",
  AgeBand8to12: "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_8to12",
  AgeBand13to17: "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_13to17",
  AgeBand18to25: "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_18to25",
  AgeBand26Plus: "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_26Plus",
  AspectAdultQ107:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q107",
  AspectAdultQ108:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q108",
  AspectAdultQ109:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q109",
  AspectAdultQ110:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q110",
  AspectAdultQ111:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q111",
  AspectAdultQ112:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q112",
  AspectAdultQ113:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q113",
  AspectAdultQ114:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q114",
  AspectAdultQ115:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q115",
  AspectAdultQ116:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q116",
  AspectAdultQ117:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q117",
  AspectAdultQ118:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q118",
  AspectAdultQ119:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q119",
  AspectAdultQ120:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q120",
  AspectAdultQ121:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q121",
  AspectAdultQ122:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q122",
  AspectAdultQ123:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q123",
  AspectAdultQ124:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q124",
  AspectAdultQ125:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q125",
  AspectAdultQ126:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q126",
  AspectAdultQ127:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q127",
  AspectAdultQ128:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q128",
  AspectAdultQ129:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q129",
  AspectAdultQ137:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q137",
  AspectAdultQ138:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q138",
  AspectAdultQ139:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q139",
  AspectAdultQ140:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q140",
  AspectAdultQ141:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q141",
  AspectAdultQ142:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q142",
  AspectAdultQ143:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q143",
  AspectAdultQ144:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q144",
  AspectAdultQ145:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q145",
  AspectAdultQ146:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q146",
  AspectAdultQ147:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q147",
  AspectAdultQ148:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q148",
  AspectAdultQ149:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q149",
  AspectAdultQ150:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q150",
  AspectAdultQ151:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q151",
  AspectAdultQ152:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q152",
  AspectAdultQ153:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q153",
  AspectAdultQ154:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q154",
  AspectAdultQ155:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q155",
  AspectAdultQ156:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q156",
  AspectAdultQ157:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q157",
  AspectAdultQ158:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q158",
  AspectAdultQ159:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q159",
  AspectAdultQ166:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q166",
  AspectAdultQ167:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q167",
  AspectAdultQ168:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q168",
  AspectAdultQ169:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q169",
  AspectAdultQ170:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q170",
  AspectAdultQ171:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q171",
  AspectAdultQ172:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q172",
  AspectAdultQ173:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q173",
  AspectAdultQ174:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q174",
  AspectAdultQ175:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q175",
  AspectAdultQ176:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q176",
  AspectAdultQ177:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q177",
  AspectAdultQ178:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q178",
  AspectAdultQ179:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q179",
  AspectAdultQ180:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q180",
  AspectAdultQ181:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q181",
  AspectAdultQ182:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q182",
  AspectAdultQ183:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q183",
  AspectAdultQ184:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q184",
  AspectAdultQ185:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q185",
  AspectAdultQ186:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q186",
  AspectAdultQ187:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q187",
  AspectAdultQ188:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q188",
  AspectAdultQ193:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q193",
  AspectAdultQ194:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q194",
  AspectAdultQ195:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q195",
  AspectAdultQ196:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q196",
  AspectAdultQ197:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q197",
  AspectAdultQ198:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q198",
  AspectAdultQ199:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q199",
  AspectAdultQ200:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q200",
  AspectAdultQ201:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q201",
  AspectAdultQ202:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q202",
  AspectAdultQ203:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q203",
  AspectAdultQ204:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q204",
  AspectAdultQ205:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q205",
  AspectAdultQ206:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q206",
  AspectAdultQ207:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q207",
  AspectAdultQ208:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q208",
  AspectAdultQ209:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q209",
  AspectAdultQ210:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q210",
  AspectAdultQ211:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q211",
  AspectAdultQ212:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q212",
  AspectAdultQ213:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q213",
  AspectAdultQ214:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q214",
  AspectAdultQ215:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q215",
  AspectAdultQ340:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q340",
  AspectAdultQ342:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q342",
  AspectAdultQ343:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q343",
  AspectAdultQ344:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q344",
  AspectAdultQ345:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q345",
  AspectAdultQ346:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q346",
  AspectAdultQ347:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q347",
  AspectAdultQ348:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q348",
  AspectAdultQ349:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q349",
  AspectAdultQ350:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q350",
  AspectAdultQ351:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q351",
  AspectAdultQ352:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q352",
  AspectAdultQ353:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q353",
  AspectAdultQ354:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q354",
  AspectAdultQ355:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q355",
  AspectAdultQ356:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q356",
  AspectAdultQ357:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q357",
  AspectAdultQ358:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q358",
  AspectAdultQ359:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q359",
  AspectAdultQ360:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q360",
  AspectAdultQ361:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q361",
  AspectAdultQ362:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q362",
  AspectAdultQ363:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q363",
  AspectAdultQ77:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q77",
  AspectAdultQ78:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q78",
  AspectAdultQ79:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q79",
  AspectAdultQ80:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q80",
  AspectAdultQ81:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q81",
  AspectAdultQ82:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q82",
  AspectAdultQ83:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q83",
  AspectAdultQ84:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q84",
  AspectAdultQ85:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q85",
  AspectAdultQ86:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q86",
  AspectAdultQ87:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q87",
  AspectAdultQ88:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q88",
  AspectAdultQ89:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q89",
  AspectAdultQ90:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q90",
  AspectAdultQ91:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q91",
  AspectAdultQ92:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q92",
  AspectAdultQ93:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q93",
  AspectAdultQ94:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q94",
  AspectAdultQ95:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q95",
  AspectAdultQ96:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q96",
  AspectAdultQ97:
    "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q97",
};
