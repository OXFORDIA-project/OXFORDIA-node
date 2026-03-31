import { LdoJsonldContext } from "@ldo/ldo";

/**
 * =============================================================================
 * nemaline_dataSchemaContext: JSONLD Context for nemaline_dataSchema
 * =============================================================================
 */
export const nemaline_dataSchemaContext: LdoJsonldContext = {
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
      isIdentifiedBy: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isIdentifiedBy",
        "@type": "@id",
      },
      isCategorizedBy: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
        "@isCollection": true,
      },
      hasMagnitude: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
        "@type": "@id",
      },
      hasParticipant: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
        "@type": "@id",
        "@isCollection": true,
      },
    },
  },
  isIdentifiedBy: {
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
      uniqueText: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/uniqueText",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
      },
    },
  },
  uniqueText: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/uniqueText",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  isCategorizedBy: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
    "@isCollection": true,
  },
  Cluster1: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_1",
  Cluster2: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_2",
  Cluster3: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_3",
  GeneticGroupVariant1:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant1",
  GeneticGroupVariant2:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant2",
  GeneticGroupVariant3:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant3",
  LeftHanded: "https://paediatrics.ox.ac.uk/terms/LeftHanded",
  RightHanded: "https://paediatrics.ox.ac.uk/terms/RightHanded",
  StatusAmbulant:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Status_Ambulant",
  StatusNonAmbulant:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Status_NonAmbulant",
  PerformanceBelowAverage:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Performance_BelowAverage",
  hasMagnitude: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
    "@type": "@id",
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
      numericValue: {
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
  numericValue: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
    "@type": "http://www.w3.org/2001/XMLSchema#decimal",
  },
  AspectAgeAtLossOfAmbulation:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtLossOfAmbulation",
  AspectMFM32AggregateScore:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_AggregateScore",
  hasParticipant: {
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
      isCategorizedBy: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
        "@isCollection": true,
      },
      hasMagnitude: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
        "@type": "@id",
      },
      hasParticipant: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
        "@type": "@id",
      },
      produces: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/produces",
        "@type": "@id",
      },
    },
  },
  AssessmentTypeMFM32:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_MFM32",
  AspectDurationSinceStudyEnrollment:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_DurationSinceStudyEnrollment",
  produces: {
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
      isAbout: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isAbout",
      },
      hasMagnitude: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
        "@type": "@id",
      },
    },
  },
  isAbout: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isAbout",
  },
  ConceptMotorFunction:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Concept_MotorFunction",
  AspectMFM32VisitScore:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_VisitScore",
  AssessmentTypeKaplanMeier:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_KaplanMeier",
  AspectKaplanMeierEventIndicator:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierEventIndicator",
  AspectKaplanMeierTimeToEvent:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierTimeToEvent",
};
