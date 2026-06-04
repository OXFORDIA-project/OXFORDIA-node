import type { DataPluginUi } from "@oxfordia/data-plugin_ui";
import { angelmanDataPlugin } from "@oxfordia/data-plugin-angelman_core";
import { AngelmanConfig } from "./AngelmanConfig";
import { AngelmanCsvResourceCreator } from "./AngelmanCsvResourceCreator";

export const angelmanDataPluginUi: DataPluginUi = {
  name: "angelman",
  resourceView: AngelmanConfig,
  resourceCreator: AngelmanCsvResourceCreator,
  dataPlugin: angelmanDataPlugin,
};

export * from "./AngelmanConfig";
export * from "./AngelmanCsvResourceCreator";
export * from "./AngelmanView";
export * from "./defaultStatisticAccessRule";
