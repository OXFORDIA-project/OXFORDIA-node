import type { ShapeType } from "@ldo/ldo";
import { legacyNemalineDataSchemaSchema } from "./legacyNemaline_dataSchema.schema";
import { legacyNemalineDataSchemaContext } from "./legacyNemaline_dataSchema.context";
import type {
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
} from "./legacyNemaline_dataSchema.typings";

/**
 * =============================================================================
 * LDO ShapeTypes legacyNemaline_dataSchema
 * =============================================================================
 */

/**
 * Person ShapeType
 */
export const PersonShapeType: ShapeType<Person> = {
  schema: legacyNemalineDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/PersonShape",
  context: legacyNemalineDataSchemaContext,
};

/**
 * MFMAssessmentEvent ShapeType
 */
export const MFMAssessmentEventShapeType: ShapeType<MFMAssessmentEvent> = {
  schema: legacyNemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMAssessmentEventShape",
  context: legacyNemalineDataSchemaContext,
};

/**
 * KaplanMeierObservation ShapeType
 */
export const KaplanMeierObservationShapeType: ShapeType<KaplanMeierObservation> =
  {
    schema: legacyNemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/KaplanMeierObservationShape",
    context: legacyNemalineDataSchemaContext,
  };

/**
 * AssessmentResult ShapeType
 */
export const AssessmentResultShapeType: ShapeType<AssessmentResult> = {
  schema: legacyNemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentResult",
  context: legacyNemalineDataSchemaContext,
};

/**
 * TimeFromBaselineMagnitude ShapeType
 */
export const TimeFromBaselineMagnitudeShapeType: ShapeType<TimeFromBaselineMagnitude> =
  {
    schema: legacyNemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TimeFromBaselineMagnitude",
    context: legacyNemalineDataSchemaContext,
  };

/**
 * MFMScoreMagnitude ShapeType
 */
export const MFMScoreMagnitudeShapeType: ShapeType<MFMScoreMagnitude> = {
  schema: legacyNemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMScoreMagnitude",
  context: legacyNemalineDataSchemaContext,
};

/**
 * TotalMFMMagnitude ShapeType
 */
export const TotalMFMMagnitudeShapeType: ShapeType<TotalMFMMagnitude> = {
  schema: legacyNemalineDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/TotalMFMMagnitude",
  context: legacyNemalineDataSchemaContext,
};

/**
 * KaplanMeierEventMagnitude ShapeType
 */
export const KaplanMeierEventMagnitudeShapeType: ShapeType<KaplanMeierEventMagnitude> =
  {
    schema: legacyNemalineDataSchemaSchema,
    shape: "https://paediatrics.ox.ac.uk/terms/KaplanMeierEventMagnitude",
    context: legacyNemalineDataSchemaContext,
  };

/**
 * KaplanMeierTimeMagnitude ShapeType
 */
export const KaplanMeierTimeMagnitudeShapeType: ShapeType<KaplanMeierTimeMagnitude> =
  {
    schema: legacyNemalineDataSchemaSchema,
    shape: "https://paediatrics.ox.ac.uk/terms/KaplanMeierTimeMagnitude",
    context: legacyNemalineDataSchemaContext,
  };

/**
 * BaselineAgeMagnitude ShapeType
 */
export const BaselineAgeMagnitudeShapeType: ShapeType<BaselineAgeMagnitude> = {
  schema: legacyNemalineDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/BaselineAgeMagnitude",
  context: legacyNemalineDataSchemaContext,
};

/**
 * LoAAgeMagnitude ShapeType
 */
export const LoAAgeMagnitudeShapeType: ShapeType<LoAAgeMagnitude> = {
  schema: legacyNemalineDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/LoAAgeMagnitude",
  context: legacyNemalineDataSchemaContext,
};

/**
 * ID ShapeType
 */
export const IDShapeType: ShapeType<ID> = {
  schema: legacyNemalineDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/terms/IDShape",
  context: legacyNemalineDataSchemaContext,
};
