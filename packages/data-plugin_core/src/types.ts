import type { LdoBase, LdoJsonldContext, ShapeType } from "@ldo/ldo";
import type { Schema } from "shexj";
import type { GraphPath } from "@oxfordia/stat-plugin_core";

export type GraphPathShortcutMap = Record<string, () => GraphPath>;

export type GraphPathShortcut = {
  name: string;
  graphPath: GraphPath;
};

export interface DataPlugin {
  name: string;
  schema: Schema;
  context: LdoJsonldContext;
  shapeTypes: Record<string, ShapeType<LdoBase>>;
  graphPathShortcuts: GraphPathShortcutMap;
}
