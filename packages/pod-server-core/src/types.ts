import type { ResourceStore } from "@solid/community-server";
import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";
import type { DataPlugin } from "@oxfordia/data-plugin_core";
import type {
  AnyStatisticApiPlugin,
  StatisticPluginServerGlobals,
} from "@oxfordia/stat-plugin_server";
import { Logger } from "./util/logger";

export interface PodServerConfig {
  baseUrl: string;
  rootFilePath: string;
  sparqlEndpoint: string;
  resourceStore: ResourceStore;
  dataPlugins?: DataPlugin[];
  statisticPlugins: AnyStatisticApiPlugin<PodServerGlobals>[];
  sparqlFetcher?: SparqlEndpointFetcher;
  logger?: Logger;
}

export interface PodServerGlobals extends StatisticPluginServerGlobals {
  baseUrl: string;
  rootFilePath: string;
  resourceStore: ResourceStore;
  dataPlugins: DataPlugin[];
  statisticPlugins: AnyStatisticApiPlugin<PodServerGlobals>[];
  logger: Logger;
}

export function createPodServerGlobals(config: PodServerConfig): PodServerGlobals {
  return {
    baseUrl: config.baseUrl,
    rootFilePath: config.rootFilePath,
    sparqlEndpoint: config.sparqlEndpoint,
    resourceStore: config.resourceStore,
    dataPlugins: config.dataPlugins ?? [],
    statisticPlugins: config.statisticPlugins,
    sparqlFetcher: config.sparqlFetcher ?? new SparqlEndpointFetcher(),
    logger: config.logger ?? new Logger(),
  };
}
