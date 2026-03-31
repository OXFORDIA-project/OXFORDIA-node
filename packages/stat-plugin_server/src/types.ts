import type { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

export interface StatisticPluginServerGlobals {
  sparqlEndpoint: string;
  sparqlFetcher: SparqlEndpointFetcher;
}
