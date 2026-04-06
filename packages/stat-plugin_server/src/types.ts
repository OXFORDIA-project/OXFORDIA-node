import type { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

export interface StatisticPluginServerLogger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}

export interface StatisticPluginServerGlobals {
  sparqlEndpoint: string;
  sparqlFetcher: SparqlEndpointFetcher;
  logger?: StatisticPluginServerLogger;
}
