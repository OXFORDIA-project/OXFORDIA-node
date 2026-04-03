import type { Schema } from "shexj";
import type { DataPlugin, GraphPathShortcut, GraphPathShortcutMap } from "./types";
export declare function findDataPlugin(dataPlugins: DataPlugin[], name: string | null | undefined): DataPlugin | undefined;
export declare function findDataSchema(dataPlugins: DataPlugin[], name: string | null | undefined): Schema | undefined;
export declare function getGraphPathShortcutMapForDataSchema(dataPlugins: DataPlugin[], dataSchemaName: string | null | undefined): GraphPathShortcutMap;
export declare function getGraphPathShortcutsForDataSchema(dataPlugins: DataPlugin[], dataSchemaName: string | null | undefined): GraphPathShortcut[];
export declare function findGraphPathShortcutByName(dataPlugins: DataPlugin[], dataSchemaName: string | null | undefined, shortcutName: string): GraphPathShortcut | null;
export * from "./shortcutMatching";
export * from "./types";
//# sourceMappingURL=index.d.ts.map