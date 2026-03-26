import type { Schema } from "shexj";
import type { GraphPathShortcut, GraphPathShortcutMap } from "./types";
import { nemalineDataPlugin } from "./nemaline";

const dataPlugins = [nemalineDataPlugin];

function normalizeSchemaName(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function findDataSchema(name: string): Schema | undefined {
  return dataPlugins.find((plugin) => plugin.name === normalizeSchemaName(name))?.schema;
}

export function getGraphPathShortcutMapForDataSchema(
  dataSchemaName: string | null | undefined,
): GraphPathShortcutMap {
  return (
    dataPlugins.find((plugin) => plugin.name === normalizeSchemaName(dataSchemaName))
      ?.graphPathShortcuts ?? {}
  );
}

export function getGraphPathShortcutsForDataSchema(
  dataSchemaName: string | null | undefined,
): GraphPathShortcut[] {
  const shortcutMap = getGraphPathShortcutMapForDataSchema(dataSchemaName);
  return Object.entries(shortcutMap).map(([name, graphPath]) => ({ name, graphPath }));
}

export function findGraphPathShortcutByName(
  dataSchemaName: string | null | undefined,
  shortcutName: string,
): GraphPathShortcut | null {
  const shortcutMap = getGraphPathShortcutMapForDataSchema(dataSchemaName);
  const graphPath = shortcutMap[shortcutName];
  return graphPath ? { name: shortcutName, graphPath } : null;
}

export * from "./nemaline";
export * from "./shortcutMatching";
export * from "./types";
