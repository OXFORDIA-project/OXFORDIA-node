import type {
  ResourceCreatorConfig,
  ResourceViewConfig,
} from "linked-data-browser";
import type { DataPlugin } from "@oxfordia/data-plugin_core";

export interface DataPluginUi {
  name: string;
  resourceView: ResourceViewConfig;
  resourceCreator: ResourceCreatorConfig;
  dataPlugin?: DataPlugin;
}
