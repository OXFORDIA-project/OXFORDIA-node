import type { GraphPathShortcutMap } from "../types";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const GIST_PERSON = "https://w3id.org/semanticarts/ns/ontology/gist/Person";
const GIST_IS_IDENTIFIED_BY = "https://w3id.org/semanticarts/ns/ontology/gist/isIdentifiedBy";
const GIST_UNIQUE_TEXT = "https://w3id.org/semanticarts/ns/ontology/gist/uniqueText";
const GIST_IS_CATEGORIZED_BY = "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy";
const GIST_HAS_PARTICIPANT = "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant";
const GIST_HAS_MAGNITUDE = "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude";
const GIST_HAS_ASPECT = "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect";
const GIST_NUMERIC_VALUE = "https://w3id.org/semanticarts/ns/ontology/gist/numericValue";
const GIST_PRODUCES = "https://w3id.org/semanticarts/ns/ontology/gist/produces";

const NM_CLUSTER_1 = "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_1";
const NM_CLUSTER_2 = "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_2";
const NM_CLUSTER_3 = "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_3";
const NM_GENETIC_VARIANT_1 =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant1";
const NM_GENETIC_VARIANT_2 =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant2";
const NM_GENETIC_VARIANT_3 =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant3";
const NM_STATUS_AMBULANT =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Status_Ambulant";
const NM_STATUS_NON_AMBULANT =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Status_NonAmbulant";
const OX_LEFT_HANDED = "https://paediatrics.ox.ac.uk/terms/LeftHanded";
const OX_RIGHT_HANDED = "https://paediatrics.ox.ac.uk/terms/RightHanded";
const NM_PERFORMANCE_BELOW_AVERAGE =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Performance_BelowAverage";
const NM_ASPECT_AGE_AT_LOSS_OF_AMBULATION =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtLossOfAmbulation";
const NM_ASPECT_MFM32_AGGREGATE_SCORE =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_AggregateScore";
const NM_ASSESSMENT_TYPE_KAPLAN_MEIER =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_KaplanMeier";
const NM_ASSESSMENT_TYPE_MFM32 =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_MFM32";
const NM_ASPECT_KAPLAN_MEIER_EVENT_INDICATOR =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierEventIndicator";
const NM_ASPECT_KAPLAN_MEIER_TIME_TO_EVENT =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierTimeToEvent";
const NM_ASPECT_DURATION_SINCE_STUDY_ENROLLMENT =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_DurationSinceStudyEnrollment";
const NM_ASPECT_MFM32_VISIT_SCORE =
  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_VisitScore";
const GIST_ASPECT_AGE = "https://w3id.org/semanticarts/ns/ontology/gist/Aspect_Age";

function iriRef(value: string): { "@id": string } {
  return { "@id": value };
}

const PERSON_START_SELECTOR = {
  predicates: [
    {
      predicate: iriRef(RDF_TYPE),
      some: {
        node: {
          iri: GIST_PERSON,
        },
      },
    },
  ],
};

export const nemalineGraphPathShortcuts = {
  PersonId: {
    start: PERSON_START_SELECTOR,
    steps: [{ via: iriRef(GIST_IS_IDENTIFIED_BY) }, { via: iriRef(GIST_UNIQUE_TEXT) }],
  },
  ClusterCategory: {
    start: PERSON_START_SELECTOR,
    steps: [{ via: iriRef(GIST_IS_CATEGORIZED_BY) }],
    target: { node: { iri: [NM_CLUSTER_1, NM_CLUSTER_2, NM_CLUSTER_3] } },
  },
  GeneticGroup: {
    start: PERSON_START_SELECTOR,
    steps: [{ via: iriRef(GIST_IS_CATEGORIZED_BY) }],
    target: { node: { iri: [NM_GENETIC_VARIANT_1, NM_GENETIC_VARIANT_2, NM_GENETIC_VARIANT_3] } },
  },
  AmbulationStatus: {
    start: PERSON_START_SELECTOR,
    steps: [{ via: iriRef(GIST_IS_CATEGORIZED_BY) }],
    target: { node: { iri: [NM_STATUS_AMBULANT, NM_STATUS_NON_AMBULANT] } },
  },
  DominantHand: {
    start: PERSON_START_SELECTOR,
    steps: [{ via: iriRef(GIST_IS_CATEGORIZED_BY) }],
    target: { node: { iri: [OX_LEFT_HANDED, OX_RIGHT_HANDED] } },
  },
  BelowAverageFlag: {
    start: PERSON_START_SELECTOR,
    steps: [{ via: iriRef(GIST_IS_CATEGORIZED_BY) }],
    target: { node: { iri: NM_PERFORMANCE_BELOW_AVERAGE } },
  },
  BaselineAge: {
    start: PERSON_START_SELECTOR,
    steps: [
      {
        via: iriRef(GIST_HAS_MAGNITUDE),
        where: {
          predicates: [
            { predicate: iriRef(GIST_HAS_ASPECT), some: { node: { iri: GIST_ASPECT_AGE } } },
          ],
        },
      },
      { via: iriRef(GIST_NUMERIC_VALUE) },
    ],
  },
  LoAAge: {
    start: PERSON_START_SELECTOR,
    steps: [
      {
        via: iriRef(GIST_HAS_MAGNITUDE),
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_HAS_ASPECT),
              some: { node: { iri: NM_ASPECT_AGE_AT_LOSS_OF_AMBULATION } },
            },
          ],
        },
      },
      { via: iriRef(GIST_NUMERIC_VALUE) },
    ],
  },
  TotalMFM: {
    start: PERSON_START_SELECTOR,
    steps: [
      {
        via: iriRef(GIST_HAS_MAGNITUDE),
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_HAS_ASPECT),
              some: { node: { iri: NM_ASPECT_MFM32_AGGREGATE_SCORE } },
            },
          ],
        },
      },
      { via: iriRef(GIST_NUMERIC_VALUE) },
    ],
  },
  KaplanMeierEvent: {
    start: PERSON_START_SELECTOR,
    steps: [
      {
        via: iriRef(GIST_HAS_PARTICIPANT),
        inverse: true,
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_IS_CATEGORIZED_BY),
              some: { node: { iri: NM_ASSESSMENT_TYPE_KAPLAN_MEIER } },
            },
          ],
        },
      },
      {
        via: iriRef(GIST_HAS_MAGNITUDE),
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_HAS_ASPECT),
              some: { node: { iri: NM_ASPECT_KAPLAN_MEIER_EVENT_INDICATOR } },
            },
          ],
        },
      },
      { via: iriRef(GIST_NUMERIC_VALUE) },
    ],
  },
  KaplanMeierTime: {
    start: PERSON_START_SELECTOR,
    steps: [
      {
        via: iriRef(GIST_HAS_PARTICIPANT),
        inverse: true,
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_IS_CATEGORIZED_BY),
              some: { node: { iri: NM_ASSESSMENT_TYPE_KAPLAN_MEIER } },
            },
          ],
        },
      },
      {
        via: iriRef(GIST_HAS_MAGNITUDE),
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_HAS_ASPECT),
              some: { node: { iri: NM_ASPECT_KAPLAN_MEIER_TIME_TO_EVENT } },
            },
          ],
        },
      },
      { via: iriRef(GIST_NUMERIC_VALUE) },
    ],
  },
  MFMVisitTimeFromBaseline: {
    start: PERSON_START_SELECTOR,
    steps: [
      {
        via: iriRef(GIST_HAS_PARTICIPANT),
        inverse: true,
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_IS_CATEGORIZED_BY),
              some: { node: { iri: NM_ASSESSMENT_TYPE_MFM32 } },
            },
          ],
        },
      },
      {
        via: iriRef(GIST_HAS_MAGNITUDE),
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_HAS_ASPECT),
              some: { node: { iri: NM_ASPECT_DURATION_SINCE_STUDY_ENROLLMENT } },
            },
          ],
        },
      },
      { via: iriRef(GIST_NUMERIC_VALUE) },
    ],
  },
  MFMVisitScore: {
    start: PERSON_START_SELECTOR,
    steps: [
      {
        via: iriRef(GIST_HAS_PARTICIPANT),
        inverse: true,
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_IS_CATEGORIZED_BY),
              some: { node: { iri: NM_ASSESSMENT_TYPE_MFM32 } },
            },
          ],
        },
      },
      { via: iriRef(GIST_PRODUCES) },
      {
        via: iriRef(GIST_HAS_MAGNITUDE),
        where: {
          predicates: [
            {
              predicate: iriRef(GIST_HAS_ASPECT),
              some: { node: { iri: NM_ASPECT_MFM32_VISIT_SCORE } },
            },
          ],
        },
      },
      { via: iriRef(GIST_NUMERIC_VALUE) },
    ],
  },
} as unknown as GraphPathShortcutMap;
