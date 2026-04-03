import type { DataPlugin } from "@oxfordia/data-plugin_core";
import { nemaline_dataSchemaContext } from "./generated/nemaline_dataSchema.context";
import { nemaline_dataSchemaSchema } from "./generated/nemaline_dataSchema.schema";
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
} from "./generated/nemaline_dataSchema.shapeTypes";
export * from "./generated/nemaline_dataSchema.context";
export * from "./generated/nemaline_dataSchema.schema";
export * from "./generated/nemaline_dataSchema.shapeTypes";
export * from "./generated/nemaline_dataSchema.typings";
import { nemalineGraphPathShortcuts } from "./shortcuts";
export * from "./shortcutHelpers";
export * from "./shortcuts";

export const nemalineDataPlugin: DataPlugin = {
  name: "nemaline",
  schema: nemaline_dataSchemaSchema,
  context: nemaline_dataSchemaContext,
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
  graphPathShortcuts: nemalineGraphPathShortcuts,
};
