import type { ShapeType } from "@ldo/ldo";
import { nemalineDataSchemaSchema } from "./nemaline_dataSchema.schema";
import { nemalineDataSchemaContext } from "./nemaline_dataSchema.context";
import type {
  Person,
  GeneticVariant,
  BaselineAgeMagnitude,
  NumberOfVariantsMagnitude,
  FirstSymptomAgeMagnitude,
  PresentationAgeMagnitude,
  DiagnosisAgeMagnitude,
  AmbulationAchievedAgeMagnitude,
  AmbulationLostAgeMagnitude,
  SittingAchievedAgeMagnitude,
  SittingLostAgeMagnitude,
  VentilationHoursOnMagnitude,
  VentilationHoursOffMagnitude,
  TubeFeedingAgeMagnitude,
  CEDASScoreMagnitude,
  WeightMagnitude,
  HeightMagnitude,
  CobbAngleMagnitude,
  CobbAngleAgeMagnitude,
  SpinalSurgeryAgeMagnitude,
  CHOPINTENDTotalMagnitude,
  MFM32TotalMagnitude,
  MFM32D1Magnitude,
  MFM32D2Magnitude,
  MFM32D3Magnitude,
  GripStrengthRightMagnitude,
  GripStrengthLeftMagnitude,
  PinchStrengthRightMagnitude,
  PinchStrengthLeftMagnitude,
  HeightZScoreMagnitude,
  WeightZScoreMagnitude,
  AmbulationGainEventMagnitude,
  AmbulationGainTimeMagnitude,
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
  schema: nemalineDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PersonShape",
  context: nemalineDataSchemaContext,
};

/**
 * GeneticVariant ShapeType
 */
export const GeneticVariantShapeType: ShapeType<GeneticVariant> = {
  schema: nemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticVariantShape",
  context: nemalineDataSchemaContext,
};

/**
 * BaselineAgeMagnitude ShapeType
 */
export const BaselineAgeMagnitudeShapeType: ShapeType<BaselineAgeMagnitude> = {
  schema: nemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BaselineAgeMagnitude",
  context: nemalineDataSchemaContext,
};

/**
 * NumberOfVariantsMagnitude ShapeType
 */
export const NumberOfVariantsMagnitudeShapeType: ShapeType<NumberOfVariantsMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/NumberOfVariantsMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * FirstSymptomAgeMagnitude ShapeType
 */
export const FirstSymptomAgeMagnitudeShapeType: ShapeType<FirstSymptomAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptomAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * PresentationAgeMagnitude ShapeType
 */
export const PresentationAgeMagnitudeShapeType: ShapeType<PresentationAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PresentationAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * DiagnosisAgeMagnitude ShapeType
 */
export const DiagnosisAgeMagnitudeShapeType: ShapeType<DiagnosisAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/DiagnosisAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * AmbulationAchievedAgeMagnitude ShapeType
 */
export const AmbulationAchievedAgeMagnitudeShapeType: ShapeType<AmbulationAchievedAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationAchievedAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * AmbulationLostAgeMagnitude ShapeType
 */
export const AmbulationLostAgeMagnitudeShapeType: ShapeType<AmbulationLostAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationLostAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * SittingAchievedAgeMagnitude ShapeType
 */
export const SittingAchievedAgeMagnitudeShapeType: ShapeType<SittingAchievedAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingAchievedAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * SittingLostAgeMagnitude ShapeType
 */
export const SittingLostAgeMagnitudeShapeType: ShapeType<SittingLostAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingLostAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * VentilationHoursOnMagnitude ShapeType
 */
export const VentilationHoursOnMagnitudeShapeType: ShapeType<VentilationHoursOnMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VentilationHoursOnMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * VentilationHoursOffMagnitude ShapeType
 */
export const VentilationHoursOffMagnitudeShapeType: ShapeType<VentilationHoursOffMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VentilationHoursOffMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * TubeFeedingAgeMagnitude ShapeType
 */
export const TubeFeedingAgeMagnitudeShapeType: ShapeType<TubeFeedingAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TubeFeedingAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * CEDASScoreMagnitude ShapeType
 */
export const CEDASScoreMagnitudeShapeType: ShapeType<CEDASScoreMagnitude> = {
  schema: nemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CEDASScoreMagnitude",
  context: nemalineDataSchemaContext,
};

/**
 * WeightMagnitude ShapeType
 */
export const WeightMagnitudeShapeType: ShapeType<WeightMagnitude> = {
  schema: nemalineDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/WeightMagnitude",
  context: nemalineDataSchemaContext,
};

/**
 * HeightMagnitude ShapeType
 */
export const HeightMagnitudeShapeType: ShapeType<HeightMagnitude> = {
  schema: nemalineDataSchemaSchema,
  shape: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/HeightMagnitude",
  context: nemalineDataSchemaContext,
};

/**
 * CobbAngleMagnitude ShapeType
 */
export const CobbAngleMagnitudeShapeType: ShapeType<CobbAngleMagnitude> = {
  schema: nemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CobbAngleMagnitude",
  context: nemalineDataSchemaContext,
};

/**
 * CobbAngleAgeMagnitude ShapeType
 */
export const CobbAngleAgeMagnitudeShapeType: ShapeType<CobbAngleAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CobbAngleAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * SpinalSurgeryAgeMagnitude ShapeType
 */
export const SpinalSurgeryAgeMagnitudeShapeType: ShapeType<SpinalSurgeryAgeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SpinalSurgeryAgeMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * CHOPINTENDTotalMagnitude ShapeType
 */
export const CHOPINTENDTotalMagnitudeShapeType: ShapeType<CHOPINTENDTotalMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CHOPINTENDTotalMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * MFM32TotalMagnitude ShapeType
 */
export const MFM32TotalMagnitudeShapeType: ShapeType<MFM32TotalMagnitude> = {
  schema: nemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32TotalMagnitude",
  context: nemalineDataSchemaContext,
};

/**
 * MFM32D1Magnitude ShapeType
 */
export const MFM32D1MagnitudeShapeType: ShapeType<MFM32D1Magnitude> = {
  schema: nemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32D1Magnitude",
  context: nemalineDataSchemaContext,
};

/**
 * MFM32D2Magnitude ShapeType
 */
export const MFM32D2MagnitudeShapeType: ShapeType<MFM32D2Magnitude> = {
  schema: nemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32D2Magnitude",
  context: nemalineDataSchemaContext,
};

/**
 * MFM32D3Magnitude ShapeType
 */
export const MFM32D3MagnitudeShapeType: ShapeType<MFM32D3Magnitude> = {
  schema: nemalineDataSchemaSchema,
  shape:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32D3Magnitude",
  context: nemalineDataSchemaContext,
};

/**
 * GripStrengthRightMagnitude ShapeType
 */
export const GripStrengthRightMagnitudeShapeType: ShapeType<GripStrengthRightMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripStrengthRightMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * GripStrengthLeftMagnitude ShapeType
 */
export const GripStrengthLeftMagnitudeShapeType: ShapeType<GripStrengthLeftMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripStrengthLeftMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * PinchStrengthRightMagnitude ShapeType
 */
export const PinchStrengthRightMagnitudeShapeType: ShapeType<PinchStrengthRightMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchStrengthRightMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * PinchStrengthLeftMagnitude ShapeType
 */
export const PinchStrengthLeftMagnitudeShapeType: ShapeType<PinchStrengthLeftMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchStrengthLeftMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * HeightZScoreMagnitude ShapeType
 */
export const HeightZScoreMagnitudeShapeType: ShapeType<HeightZScoreMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/HeightZScoreMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * WeightZScoreMagnitude ShapeType
 */
export const WeightZScoreMagnitudeShapeType: ShapeType<WeightZScoreMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/WeightZScoreMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * AmbulationGainEventMagnitude ShapeType
 */
export const AmbulationGainEventMagnitudeShapeType: ShapeType<AmbulationGainEventMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationGainEventMagnitude",
    context: nemalineDataSchemaContext,
  };

/**
 * AmbulationGainTimeMagnitude ShapeType
 */
export const AmbulationGainTimeMagnitudeShapeType: ShapeType<AmbulationGainTimeMagnitude> =
  {
    schema: nemalineDataSchemaSchema,
    shape:
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationGainTimeMagnitude",
    context: nemalineDataSchemaContext,
  };
