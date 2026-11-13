import type { DataPlugin } from "@oxfordia/data-plugin_core";
import { nemalineDataSchemaContext } from "./generated/nemaline_dataSchema.context";
import { nemalineDataSchemaSchema } from "./generated/nemaline_dataSchema.schema";
import {
  AmbulationAchievedAgeMagnitudeShapeType,
  AmbulationLostAgeMagnitudeShapeType,
  BaselineAgeMagnitudeShapeType,
  CEDASScoreMagnitudeShapeType,
  CHOPINTENDTotalMagnitudeShapeType,
  CobbAngleAgeMagnitudeShapeType,
  CobbAngleMagnitudeShapeType,
  DiagnosisAgeMagnitudeShapeType,
  FirstSymptomAgeMagnitudeShapeType,
  GeneticVariantShapeType,
  GripStrengthLeftMagnitudeShapeType,
  GripStrengthRightMagnitudeShapeType,
  HeightMagnitudeShapeType,
  MFM32D1MagnitudeShapeType,
  MFM32D2MagnitudeShapeType,
  MFM32D3MagnitudeShapeType,
  MFM32TotalMagnitudeShapeType,
  NumberOfVariantsMagnitudeShapeType,
  PersonShapeType,
  PinchStrengthLeftMagnitudeShapeType,
  PinchStrengthRightMagnitudeShapeType,
  PresentationAgeMagnitudeShapeType,
  SittingAchievedAgeMagnitudeShapeType,
  SittingLostAgeMagnitudeShapeType,
  SpinalSurgeryAgeMagnitudeShapeType,
  TubeFeedingAgeMagnitudeShapeType,
  VentilationHoursOffMagnitudeShapeType,
  VentilationHoursOnMagnitudeShapeType,
  WeightMagnitudeShapeType,
} from "./generated/nemaline_dataSchema.shapeTypes";
export * from "./generated/nemaline_dataSchema.context";
export * from "./generated/nemaline_dataSchema.schema";
export * from "./generated/nemaline_dataSchema.shapeTypes";
export * from "./generated/nemaline_dataSchema.typings";
import { nemalineGraphPathShortcuts } from "./shortcuts";
export * from "./shortcuts";

export const nemalineDataPlugin: DataPlugin = {
  name: "nemaline",
  schema: nemalineDataSchemaSchema,
  context: nemalineDataSchemaContext,
  shapeTypes: {
    AmbulationAchievedAgeMagnitudeShapeType,
    AmbulationLostAgeMagnitudeShapeType,
    BaselineAgeMagnitudeShapeType,
    CEDASScoreMagnitudeShapeType,
    CHOPINTENDTotalMagnitudeShapeType,
    CobbAngleAgeMagnitudeShapeType,
    CobbAngleMagnitudeShapeType,
    DiagnosisAgeMagnitudeShapeType,
    FirstSymptomAgeMagnitudeShapeType,
    GeneticVariantShapeType,
    GripStrengthLeftMagnitudeShapeType,
    GripStrengthRightMagnitudeShapeType,
    HeightMagnitudeShapeType,
    MFM32D1MagnitudeShapeType,
    MFM32D2MagnitudeShapeType,
    MFM32D3MagnitudeShapeType,
    MFM32TotalMagnitudeShapeType,
    NumberOfVariantsMagnitudeShapeType,
    PersonShapeType,
    PinchStrengthLeftMagnitudeShapeType,
    PinchStrengthRightMagnitudeShapeType,
    PresentationAgeMagnitudeShapeType,
    SittingAchievedAgeMagnitudeShapeType,
    SittingLostAgeMagnitudeShapeType,
    SpinalSurgeryAgeMagnitudeShapeType,
    TubeFeedingAgeMagnitudeShapeType,
    VentilationHoursOffMagnitudeShapeType,
    VentilationHoursOnMagnitudeShapeType,
    WeightMagnitudeShapeType,
  },
  graphPathShortcuts: nemalineGraphPathShortcuts,
};
