import type { DataPlugin } from "@oxfordia/data-plugin_core";
import { angelman_dataSchemaContext } from "./generated/angelman_dataSchema.context";
import { angelman_dataSchemaSchema } from "./generated/angelman_dataSchema.schema";
import { PersonShapeType } from "./generated/angelman_dataSchema.shapeTypes";
export * from "./generated/angelman_dataSchema.context";
export * from "./generated/angelman_dataSchema.schema";
export * from "./generated/angelman_dataSchema.shapeTypes";
export * from "./generated/angelman_dataSchema.typings";
import { angelmanGraphPathShortcuts } from "./shortcuts";
export * from "./shortcutHelpers";
export * from "./shortcuts";

export const angelmanDataPlugin: DataPlugin = {
  name: "angelman",
  schema: angelman_dataSchemaSchema,
  context: angelman_dataSchemaContext,
  shapeTypes: {
    PersonShapeType,
  },
  graphPathShortcuts: angelmanGraphPathShortcuts,
};
