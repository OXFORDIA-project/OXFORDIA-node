import type { GraphPath } from "../_ldo/oxfordia.typings";

export type GraphPathShortcutMap = Record<string, () => GraphPath>;

export type GraphPathShortcut = {
  name: string;
  graphPath: GraphPath;
};
