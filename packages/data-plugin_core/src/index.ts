import type { Schema } from "shexj";
import type { DataPlugin, GraphPathShortcut, GraphPathShortcutMap } from "./types";

function normalizeSchemaName(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function findDataPlugin(
  dataPlugins: DataPlugin[],
  name: string | null | undefined,
): DataPlugin | undefined {
  return dataPlugins.find(
    (plugin) => plugin.name === normalizeSchemaName(name),
  );
}

export function findDataSchema(
  dataPlugins: DataPlugin[],
  name: string | null | undefined,
): Schema | undefined {
  return findDataPlugin(dataPlugins, name)?.schema;
}

export function getGraphPathShortcutMapForDataSchema(
  dataPlugins: DataPlugin[],
  dataSchemaName: string | null | undefined,
): GraphPathShortcutMap {
  return findDataPlugin(dataPlugins, dataSchemaName)?.graphPathShortcuts ?? {};
}

export function getGraphPathShortcutsForDataSchema(
  dataPlugins: DataPlugin[],
  dataSchemaName: string | null | undefined,
): GraphPathShortcut[] {
  const shortcutMap = getGraphPathShortcutMapForDataSchema(
    dataPlugins,
    dataSchemaName,
  );
  return Object.entries(shortcutMap).map(([name, graphPath]) => ({
    name,
    graphPath: graphPath.name ? graphPath : { ...graphPath, name },
  }));
}

export function findGraphPathShortcutByName(
  dataPlugins: DataPlugin[],
  dataSchemaName: string | null | undefined,
  shortcutName: string,
): GraphPathShortcut | null {
  const shortcutMap = getGraphPathShortcutMapForDataSchema(
    dataPlugins,
    dataSchemaName,
  );
  const graphPath = shortcutMap[shortcutName];
  return graphPath
    ? {
        name: shortcutName,
        graphPath: graphPath.name ? graphPath : { ...graphPath, name: shortcutName },
      }
    : null;
}

export * from "./shortcutMatching";
export * from "./types";
