import { LdoJsonldContext } from "@ldo/ldo";

/**
 * =============================================================================
 * oxfordiaContext: JSONLD Context for oxfordia
 * =============================================================================
 */
export const oxfordiaContext: LdoJsonldContext = {
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
  StatisticAccessRule: {
    "@id":
      "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRule",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      dataSchema: {
        "@id": "https://oxfordia.setmeld.com/statistic-access-rule#dataSchema",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
      },
      hasStatisticPolicy: {
        "@id":
          "https://oxfordia.setmeld.com/statistic-access-rule#hasStatisticPolicy",
        "@type": "@id",
        "@isCollection": true,
      },
    },
  },
  dataSchema: {
    "@id": "https://oxfordia.setmeld.com/statistic-access-rule#dataSchema",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  hasStatisticPolicy: {
    "@id":
      "https://oxfordia.setmeld.com/statistic-access-rule#hasStatisticPolicy",
    "@type": "@id",
    "@isCollection": true,
  },
  statisticName: {
    "@id": "https://oxfordia.setmeld.com/statistic-access-rule#statisticName",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  allowedPath: {
    "@id": "https://oxfordia.setmeld.com/statistics#allowedPath",
    "@type": "@id",
    "@isCollection": true,
  },
  graphPath: {
    "@id": "https://oxfordia.setmeld.com/statistics#graphPath",
    "@type": "@id",
  },
  start: {
    "@id": "https://oxfordia.setmeld.com/statistics#start",
    "@type": "@id",
  },
  rdfType: {
    "@id": "https://oxfordia.setmeld.com/statistics#rdfType",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  iri: {
    "@id": "https://oxfordia.setmeld.com/statistics#iri",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  categories: {
    "@id": "https://oxfordia.setmeld.com/statistics#categories",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  predicates: {
    "@id": "https://oxfordia.setmeld.com/statistics#predicates",
    "@type": "@id",
    "@isCollection": true,
  },
  predicate: {
    "@id": "https://oxfordia.setmeld.com/statistics#predicate",
    "@type": "@id",
  },
  inverse: {
    "@id": "https://oxfordia.setmeld.com/statistics#inverse",
    "@type": "http://www.w3.org/2001/XMLSchema#boolean",
  },
  some: {
    "@id": "https://oxfordia.setmeld.com/statistics#some",
    "@type": "@id",
  },
  node: {
    "@id": "https://oxfordia.setmeld.com/statistics#node",
    "@type": "@id",
  },
  literal: {
    "@id": "https://oxfordia.setmeld.com/statistics#literal",
    "@type": "@id",
  },
  datatype: {
    "@id": "https://oxfordia.setmeld.com/statistics#datatype",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  lang: {
    "@id": "https://oxfordia.setmeld.com/statistics#lang",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  equals: "https://oxfordia.setmeld.com/statistics#equals",
  oneOf: "https://oxfordia.setmeld.com/statistics#oneOf",
  min: {
    "@id": "https://oxfordia.setmeld.com/statistics#min",
    "@type": "http://www.w3.org/2001/XMLSchema#decimal",
  },
  max: {
    "@id": "https://oxfordia.setmeld.com/statistics#max",
    "@type": "http://www.w3.org/2001/XMLSchema#decimal",
  },
  every: {
    "@id": "https://oxfordia.setmeld.com/statistics#every",
    "@type": "@id",
  },
  none: {
    "@id": "https://oxfordia.setmeld.com/statistics#none",
    "@type": "@id",
  },
  steps: {
    "@id": "https://oxfordia.setmeld.com/statistics#steps",
    "@type": "@id",
    "@isCollection": true,
  },
  via: {
    "@id": "https://oxfordia.setmeld.com/statistics#via",
    "@type": "@id",
  },
  where: {
    "@id": "https://oxfordia.setmeld.com/statistics#where",
    "@type": "@id",
  },
  target: {
    "@id": "https://oxfordia.setmeld.com/statistics#target",
    "@type": "@id",
  },
  minCount: {
    "@id": "https://oxfordia.setmeld.com/statistics#minCount",
    "@type": "http://www.w3.org/2001/XMLSchema#integer",
  },
  timeGraphPath: {
    "@id": "https://oxfordia.setmeld.com/statistics#timeGraphPath",
    "@type": "@id",
  },
  eventGraphPath: {
    "@id": "https://oxfordia.setmeld.com/statistics#eventGraphPath",
    "@type": "@id",
  },
  groupByGraphPath: {
    "@id": "https://oxfordia.setmeld.com/statistics#groupByGraphPath",
    "@type": "@id",
  },
  kAnonymity: {
    "@id": "https://oxfordia.setmeld.com/statistics#k-anonymity",
    "@type": "http://www.w3.org/2001/XMLSchema#integer",
  },
};
