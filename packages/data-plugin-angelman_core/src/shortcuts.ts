import type { GraphPathShortcutMap } from "@oxfordia/data-plugin_core";
import shortcutsJson from "./shortcuts.json";

export const angelmanGraphPathShortcuts: GraphPathShortcutMap =
  shortcutsJson as unknown as GraphPathShortcutMap;
