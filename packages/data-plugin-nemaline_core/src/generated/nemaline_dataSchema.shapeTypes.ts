import { ShapeType } from "@ldo/ldo";
import { nemaline_dataSchemaSchema } from "./nemaline_dataSchema.schema";
import { nemaline_dataSchemaContext } from "./nemaline_dataSchema.context";
import {
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
} from "./nemaline_dataSchema.typings";

/**
 * =============================================================================
 * LDO ShapeTypes nemaline_dataSchema
 * =============================================================================
 */

/**
 * Person ShapeType
 */
export const PersonShapeType: ShapeType<Person> = {
  schema: nemaline_dataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/PersonShape",
  context: nemaline_dataSchemaContext,
};

/**
 * MFMAssessmentEvent ShapeType
 */
export const MFMAssessmentEventShapeType: ShapeType<MFMAssessmentEvent> = {
  schema: nemaline_dataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMAssessmentEventShape",
  context: nemaline_dataSchemaContext,
};

/**
 * KaplanMeierObservation ShapeType
 */
export const KaplanMeierObservationShapeType: ShapeType<KaplanMeierObservation> =
  {
    schema: nemaline_dataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/KaplanMeierObservationShape",
    context: nemaline_dataSchemaContext,
  };

/**
 * AssessmentResult ShapeType
 */
export const AssessmentResultShapeType: ShapeType<AssessmentResult> = {
  schema: nemaline_dataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentResult",
  context: nemaline_dataSchemaContext,
};

/**
 * TimeFromBaselineMagnitude ShapeType
 */
export const TimeFromBaselineMagnitudeShapeType: ShapeType<TimeFromBaselineMagnitude> =
  {
    schema: nemaline_dataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TimeFromBaselineMagnitude",
    context: nemaline_dataSchemaContext,
  };

/**
 * MFMScoreMagnitude ShapeType
 */
export const MFMScoreMagnitudeShapeType: ShapeType<MFMScoreMagnitude> = {
  schema: nemaline_dataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMScoreMagnitude",
  context: nemaline_dataSchemaContext,
};

/**
 * TotalMFMMagnitude ShapeType
 */
export const TotalMFMMagnitudeShapeType: ShapeType<TotalMFMMagnitude> = {
  schema: nemaline_dataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/TotalMFMMagnitude",
  context: nemaline_dataSchemaContext,
};

/**
 * KaplanMeierEventMagnitude ShapeType
 */
export const KaplanMeierEventMagnitudeShapeType: ShapeType<KaplanMeierEventMagnitude> =
  {
    schema: nemaline_dataSchemaSchema,
    shape: "https://paediatrics.ox.ac.uk/terms/KaplanMeierEventMagnitude",
    context: nemaline_dataSchemaContext,
  };

/**
 * KaplanMeierTimeMagnitude ShapeType
 */
export const KaplanMeierTimeMagnitudeShapeType: ShapeType<KaplanMeierTimeMagnitude> =
  {
    schema: nemaline_dataSchemaSchema,
    shape: "https://paediatrics.ox.ac.uk/terms/KaplanMeierTimeMagnitude",
    context: nemaline_dataSchemaContext,
  };

/**
 * BaselineAgeMagnitude ShapeType
 */
export const BaselineAgeMagnitudeShapeType: ShapeType<BaselineAgeMagnitude> = {
  schema: nemaline_dataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/BaselineAgeMagnitude",
  context: nemaline_dataSchemaContext,
};

/**
 * LoAAgeMagnitude ShapeType
 */
export const LoAAgeMagnitudeShapeType: ShapeType<LoAAgeMagnitude> = {
  schema: nemaline_dataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/LoAAgeMagnitude",
  context: nemaline_dataSchemaContext,
};

/**
 * ID ShapeType
 */
export const IDShapeType: ShapeType<ID> = {
  schema: nemaline_dataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/IDShape",
  context: nemaline_dataSchemaContext,
};
