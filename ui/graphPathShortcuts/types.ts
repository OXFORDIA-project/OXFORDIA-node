import type { GraphPath } from "@oxfordia/types";

export type GraphPathShortcutMap = Record<string, GraphPath>;

export type GraphPathShortcut = {
  name: string;
  graphPath: GraphPath;
};

export type GraphPathShortcutRegistry = Record<string, GraphPathShortcutMap>;
