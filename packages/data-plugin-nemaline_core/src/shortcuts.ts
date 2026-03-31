import type {
  GraphNodeFilter,
  GraphPath,
  GraphTraversalStep,
} from "@oxfordia/stat-plugin_core";
import type { GraphPathShortcutMap } from "@oxfordia/data-plugin_core";
import {
  graphPath,
  nodeFilter,
  nodeSelector,
  predicateFilter,
  traversalStep,
} from "./shortcutHelpers";

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

function personStartSelector(): GraphNodeFilter {
  return nodeFilter({
    predicates: [
      predicateFilter({
        predicate: RDF_TYPE,
        some: nodeSelector(nodeFilter({ iri: [GIST_PERSON] })),
      }),
    ],
  });
}

function categorizedTargetPath(targetIris: string[]): GraphPath {
  return graphPath({
    start: personStartSelector(),
    steps: [traversalStep({ via: GIST_IS_CATEGORIZED_BY })],
    target: nodeSelector(nodeFilter({ iri: targetIris })),
  });
}

function magnitudePath(aspectIri: string): GraphPath {
  return graphPath({
    start: personStartSelector(),
    steps: [
      traversalStep({
        via: GIST_HAS_MAGNITUDE,
        where: nodeFilter({
          predicates: [
            predicateFilter({
              predicate: GIST_HAS_ASPECT,
              some: nodeSelector(nodeFilter({ iri: [aspectIri] })),
            }),
          ],
        }),
      }),
      traversalStep({ via: GIST_NUMERIC_VALUE }),
    ],
  });
}

function assessmentMagnitudePath(params: {
  assessmentTypeIri: string;
  aspectIri: string;
  includeProduces?: boolean;
}): GraphPath {
  const steps: GraphTraversalStep[] = [
    traversalStep({
      via: GIST_HAS_PARTICIPANT,
      inverse: true,
      where: nodeFilter({
        predicates: [
          predicateFilter({
            predicate: GIST_IS_CATEGORIZED_BY,
            some: nodeSelector(nodeFilter({ iri: [params.assessmentTypeIri] })),
          }),
        ],
      }),
    }),
  ];

  if (params.includeProduces) {
    steps.push(traversalStep({ via: GIST_PRODUCES }));
  }

  steps.push(
    traversalStep({
      via: GIST_HAS_MAGNITUDE,
      where: nodeFilter({
        predicates: [
          predicateFilter({
            predicate: GIST_HAS_ASPECT,
            some: nodeSelector(nodeFilter({ iri: [params.aspectIri] })),
          }),
        ],
      }),
    }),
    traversalStep({ via: GIST_NUMERIC_VALUE }),
  );

  return graphPath({
    start: personStartSelector(),
    steps,
  });
}

export const nemalineGraphPathShortcuts: GraphPathShortcutMap = {
  PersonId: () =>
    graphPath({
      name: "PersonId",
      start: personStartSelector(),
      steps: [
        traversalStep({ via: GIST_IS_IDENTIFIED_BY }),
        traversalStep({ via: GIST_UNIQUE_TEXT }),
      ],
    }),
  ClusterCategory: () =>
    ({ ...categorizedTargetPath([NM_CLUSTER_1, NM_CLUSTER_2, NM_CLUSTER_3]), name: "ClusterCategory" }),
  GeneticGroup: () =>
    ({
      ...categorizedTargetPath([
        NM_GENETIC_VARIANT_1,
        NM_GENETIC_VARIANT_2,
        NM_GENETIC_VARIANT_3,
      ]),
      name: "GeneticGroup",
    }),
  AmbulationStatus: () =>
    ({
      ...categorizedTargetPath([NM_STATUS_AMBULANT, NM_STATUS_NON_AMBULANT]),
      name: "AmbulationStatus",
    }),
  DominantHand: () =>
    ({ ...categorizedTargetPath([OX_LEFT_HANDED, OX_RIGHT_HANDED]), name: "DominantHand" }),
  BelowAverageFlag: () =>
    ({ ...categorizedTargetPath([NM_PERFORMANCE_BELOW_AVERAGE]), name: "BelowAverageFlag" }),
  BaselineAge: () => ({ ...magnitudePath(GIST_ASPECT_AGE), name: "BaselineAge" }),
  LoAAge: () =>
    ({ ...magnitudePath(NM_ASPECT_AGE_AT_LOSS_OF_AMBULATION), name: "LoAAge" }),
  TotalMFM: () =>
    ({ ...magnitudePath(NM_ASPECT_MFM32_AGGREGATE_SCORE), name: "TotalMFM" }),
  KaplanMeierEvent: () =>
    ({
      ...assessmentMagnitudePath({
        assessmentTypeIri: NM_ASSESSMENT_TYPE_KAPLAN_MEIER,
        aspectIri: NM_ASPECT_KAPLAN_MEIER_EVENT_INDICATOR,
      }),
      name: "KaplanMeierEvent",
    }),
  KaplanMeierTime: () =>
    ({
      ...assessmentMagnitudePath({
        assessmentTypeIri: NM_ASSESSMENT_TYPE_KAPLAN_MEIER,
        aspectIri: NM_ASPECT_KAPLAN_MEIER_TIME_TO_EVENT,
      }),
      name: "KaplanMeierTime",
    }),
  MFMVisitTimeFromBaseline: () =>
    ({
      ...assessmentMagnitudePath({
        assessmentTypeIri: NM_ASSESSMENT_TYPE_MFM32,
        aspectIri: NM_ASPECT_DURATION_SINCE_STUDY_ENROLLMENT,
      }),
      name: "MFMVisitTimeFromBaseline",
    }),
  MFMVisitScore: () =>
    ({
      ...assessmentMagnitudePath({
        assessmentTypeIri: NM_ASSESSMENT_TYPE_MFM32,
        aspectIri: NM_ASPECT_MFM32_VISIT_SCORE,
        includeProduces: true,
      }),
      name: "MFMVisitScore",
    }),
};
