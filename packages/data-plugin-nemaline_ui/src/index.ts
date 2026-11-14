import type { DataPluginUi } from "@oxfordia/data-plugin_ui";
import { nemalineDataPlugin } from "@oxfordia/data-plugin-nemaline_core";
import { NemalineConfig } from "./NemalineConfig";
import { NemalineCsvResourceCreator } from "./NemalineCsvResourceCreator";

export const nemalineDataPluginUi: DataPluginUi = {
  name: "nemaline",
  resourceView: NemalineConfig,
  resourceCreator: NemalineCsvResourceCreator,
  dataPlugin: nemalineDataPlugin,
};

export * from "./NemalineConfig";
export * from "./NemalineCsvResourceCreator";
export * from "./NemalineView";
export * from "./defaultStatisticAccessRule";
export * from "./nemalinePilotCsv";
export * from "./pilotColumns";
