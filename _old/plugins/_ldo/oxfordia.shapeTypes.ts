import { ShapeType } from "@ldo/ldo";
import { oxfordiaSchema } from "./oxfordia.schema";
import { oxfordiaContext } from "./oxfordia.context";
import {
  StatisticAccessRuleDocument,
  StatisticPolicy,
  Person,
  MFMAssessmentEvent,
  KaplanMeierObservation,
  AssessmentResult,
  TimeFromBaselineMagnitude,
  MFMScoreMagnitude,
  TotalMFMMagnitude,
  KaplanMeierEventMagnitude,
  KaplanMeierTimeMagnitude,
  BaselineAgeMagnitude,
  LoAAgeMagnitude,
  ID,
  MeanStatisticAccessRule,
  MeanAllowedPath,
  KaplanMeierStatisticAccessRule,
  KaplanMeierAllowedPath,
  GraphPath,
  GraphNodeFilter,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
  GraphLiteralFilter,
} from "./oxfordia.typings";

/**
 * =============================================================================
 * LDO ShapeTypes oxfordia
 * =============================================================================
 */

/**
 * StatisticAccessRuleDocument ShapeType
 */
export const StatisticAccessRuleDocumentShapeType: ShapeType<StatisticAccessRuleDocument> =
  {
    schema: oxfordiaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRuleDocumentShape",
    context: oxfordiaContext,
  };

/**
 * StatisticPolicy ShapeType
 */
export const StatisticPolicyShapeType: ShapeType<StatisticPolicy> = {
  schema: oxfordiaSchema,
  shape:
    "https://oxfordia.setmeld.com/statistic-access-rule#StatisticPolicyShape",
  context: oxfordiaContext,
};

/**
 * Person ShapeType
 */
export const PersonShapeType: ShapeType<Person> = {
  schema: oxfordiaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/PersonShape",
  context: oxfordiaContext,
};

/**
 * MFMAssessmentEvent ShapeType
 */
export const MFMAssessmentEventShapeType: ShapeType<MFMAssessmentEvent> = {
  schema: oxfordiaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMAssessmentEventShape",
  context: oxfordiaContext,
};

/**
 * KaplanMeierObservation ShapeType
 */
export const KaplanMeierObservationShapeType: ShapeType<KaplanMeierObservation> =
  {
    schema: oxfordiaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/KaplanMeierObservationShape",
    context: oxfordiaContext,
  };

/**
 * AssessmentResult ShapeType
 */
export const AssessmentResultShapeType: ShapeType<AssessmentResult> = {
  schema: oxfordiaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentResult",
  context: oxfordiaContext,
};

/**
 * TimeFromBaselineMagnitude ShapeType
 */
export const TimeFromBaselineMagnitudeShapeType: ShapeType<TimeFromBaselineMagnitude> =
  {
    schema: oxfordiaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TimeFromBaselineMagnitude",
    context: oxfordiaContext,
  };

/**
 * MFMScoreMagnitude ShapeType
 */
export const MFMScoreMagnitudeShapeType: ShapeType<MFMScoreMagnitude> = {
  schema: oxfordiaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMScoreMagnitude",
  context: oxfordiaContext,
};

/**
 * TotalMFMMagnitude ShapeType
 */
export const TotalMFMMagnitudeShapeType: ShapeType<TotalMFMMagnitude> = {
  schema: oxfordiaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/TotalMFMMagnitude",
  context: oxfordiaContext,
};

/**
 * KaplanMeierEventMagnitude ShapeType
 */
export const KaplanMeierEventMagnitudeShapeType: ShapeType<KaplanMeierEventMagnitude> =
  {
    schema: oxfordiaSchema,
    shape: "https://paediatrics.ox.ac.uk/terms/KaplanMeierEventMagnitude",
    context: oxfordiaContext,
  };

/**
 * KaplanMeierTimeMagnitude ShapeType
 */
export const KaplanMeierTimeMagnitudeShapeType: ShapeType<KaplanMeierTimeMagnitude> =
  {
    schema: oxfordiaSchema,
    shape: "https://paediatrics.ox.ac.uk/terms/KaplanMeierTimeMagnitude",
    context: oxfordiaContext,
  };

/**
 * BaselineAgeMagnitude ShapeType
 */
export const BaselineAgeMagnitudeShapeType: ShapeType<BaselineAgeMagnitude> = {
  schema: oxfordiaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/BaselineAgeMagnitude",
  context: oxfordiaContext,
};

/**
 * LoAAgeMagnitude ShapeType
 */
export const LoAAgeMagnitudeShapeType: ShapeType<LoAAgeMagnitude> = {
  schema: oxfordiaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/LoAAgeMagnitude",
  context: oxfordiaContext,
};

/**
 * ID ShapeType
 */
export const IDShapeType: ShapeType<ID> = {
  schema: oxfordiaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/IDShape",
  context: oxfordiaContext,
};

/**
 * MeanStatisticAccessRule ShapeType
 */
export const MeanStatisticAccessRuleShapeType: ShapeType<MeanStatisticAccessRule> =
  {
    schema: oxfordiaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistics#MeanStatisticAccessRuleShape",
    context: oxfordiaContext,
  };

/**
 * MeanAllowedPath ShapeType
 */
export const MeanAllowedPathShapeType: ShapeType<MeanAllowedPath> = {
  schema: oxfordiaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#MeanAllowedPathShape",
  context: oxfordiaContext,
};

/**
 * KaplanMeierStatisticAccessRule ShapeType
 */
export const KaplanMeierStatisticAccessRuleShapeType: ShapeType<KaplanMeierStatisticAccessRule> =
  {
    schema: oxfordiaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistics#KaplanMeierStatisticAccessRuleShape",
    context: oxfordiaContext,
  };

/**
 * KaplanMeierAllowedPath ShapeType
 */
export const KaplanMeierAllowedPathShapeType: ShapeType<KaplanMeierAllowedPath> =
  {
    schema: oxfordiaSchema,
    shape:
      "https://oxfordia.setmeld.com/statistics#KaplanMeierAllowedPathShape",
    context: oxfordiaContext,
  };

/**
 * GraphPath ShapeType
 */
export const GraphPathShapeType: ShapeType<GraphPath> = {
  schema: oxfordiaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPathShape",
  context: oxfordiaContext,
};

/**
 * GraphNodeFilter ShapeType
 */
export const GraphNodeFilterShapeType: ShapeType<GraphNodeFilter> = {
  schema: oxfordiaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
  context: oxfordiaContext,
};

/**
 * GraphPredicateFilter ShapeType
 */
export const GraphPredicateFilterShapeType: ShapeType<GraphPredicateFilter> = {
  schema: oxfordiaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphPredicateFilterShape",
  context: oxfordiaContext,
};

/**
 * GraphTraversalStep ShapeType
 */
export const GraphTraversalStepShapeType: ShapeType<GraphTraversalStep> = {
  schema: oxfordiaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphTraversalStepShape",
  context: oxfordiaContext,
};

/**
 * GraphValueSelector ShapeType
 */
export const GraphValueSelectorShapeType: ShapeType<GraphValueSelector> = {
  schema: oxfordiaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
  context: oxfordiaContext,
};

/**
 * GraphLiteralFilter ShapeType
 */
export const GraphLiteralFilterShapeType: ShapeType<GraphLiteralFilter> = {
  schema: oxfordiaSchema,
  shape: "https://oxfordia.setmeld.com/statistics#GraphLiteralFilterShape",
  context: oxfordiaContext,
};
