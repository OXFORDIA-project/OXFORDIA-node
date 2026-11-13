import type { DataPluginUi } from "@oxfordia/data-plugin_ui";
import { legacyNemalineDataPlugin } from "@oxfordia/data-plugin-legacy-nemaline_core";
import { LegacyNemalineConfig } from "./LegacyNemalineConfig";
import { LegacyNemalineCsvResourceCreator } from "./LegacyNemalineCsvResourceCreator";

export const legacyNemalineDataPluginUi: DataPluginUi = {
  name: "legacy-nemaline",
  resourceView: LegacyNemalineConfig,
  resourceCreator: LegacyNemalineCsvResourceCreator,
  dataPlugin: legacyNemalineDataPlugin,
};

export * from "./KaplanMeierObservationsTester";
export * from "./MeanQueryTester";
export * from "./LegacyNemalineConfig";
export * from "./LegacyNemalineCsvResourceCreator";
export * from "./LegacyNemalineView";
export * from "./defaultStatisticAccessRule";
