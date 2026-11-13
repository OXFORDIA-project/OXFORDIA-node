import type { DataPlugin } from "@oxfordia/data-plugin_core";
import { legacyNemalineDataSchemaContext } from "./generated/legacyNemaline_dataSchema.context";
import { legacyNemalineDataSchemaSchema } from "./generated/legacyNemaline_dataSchema.schema";
import {
  AssessmentResultShapeType,
  BaselineAgeMagnitudeShapeType,
  IDShapeType,
  KaplanMeierEventMagnitudeShapeType,
  KaplanMeierObservationShapeType,
  KaplanMeierTimeMagnitudeShapeType,
  LoAAgeMagnitudeShapeType,
  MFMAssessmentEventShapeType,
  MFMScoreMagnitudeShapeType,
  PersonShapeType,
  TimeFromBaselineMagnitudeShapeType,
  TotalMFMMagnitudeShapeType,
} from "./generated/legacyNemaline_dataSchema.shapeTypes";
export * from "./generated/legacyNemaline_dataSchema.context";
export * from "./generated/legacyNemaline_dataSchema.schema";
export * from "./generated/legacyNemaline_dataSchema.shapeTypes";
export * from "./generated/legacyNemaline_dataSchema.typings";
import { legacyNemalineGraphPathShortcuts } from "./shortcuts";
export * from "./shortcuts";

export const legacyNemalineDataPlugin: DataPlugin = {
  name: "legacy-nemaline",
  schema: legacyNemalineDataSchemaSchema,
  context: legacyNemalineDataSchemaContext,
  shapeTypes: {
    AssessmentResultShapeType,
    BaselineAgeMagnitudeShapeType,
    IDShapeType,
    KaplanMeierEventMagnitudeShapeType,
    KaplanMeierObservationShapeType,
    KaplanMeierTimeMagnitudeShapeType,
    LoAAgeMagnitudeShapeType,
    MFMAssessmentEventShapeType,
    MFMScoreMagnitudeShapeType,
    PersonShapeType,
    TimeFromBaselineMagnitudeShapeType,
    TotalMFMMagnitudeShapeType,
  },
  graphPathShortcuts: legacyNemalineGraphPathShortcuts,
};
