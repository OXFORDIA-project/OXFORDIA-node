import type { GraphPathShortcutMap } from "@oxfordia/data-plugin_core";
import shortcutsJson from "./shortcuts.json";

export const legacyNemalineGraphPathShortcuts: GraphPathShortcutMap =
  shortcutsJson as unknown as GraphPathShortcutMap;
