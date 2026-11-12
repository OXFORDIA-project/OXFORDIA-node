import type { GraphPathShortcutMap } from "@oxfordia/data-plugin_core";
import shortcutsJson from "./shortcuts.json";

export const nemalineGraphPathShortcuts: GraphPathShortcutMap =
  shortcutsJson as unknown as GraphPathShortcutMap;
