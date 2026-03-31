import { ResourceStore } from "@solid/community-server";
import { Logger } from "./util/logger";
import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

export interface IntegrationPodGlobals {
  baseUrl: string;
  rootFilePath: string;
  sparqlEndpoint: string;
  sparqlFetcher: SparqlEndpointFetcher;
  logger: Logger;
  resourceStore: ResourceStore;
}

const globals: IntegrationPodGlobals = {
  baseUrl: "",
  rootFilePath: "",
  sparqlEndpoint: "",
  logger: new Logger(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This will be set by the createApp function
  resourceStore: undefined,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This will be set by the createApp function
  sparqlFetcher: new SparqlEndpointFetcher(),
};

export function getGlobals(): IntegrationPodGlobals {
  return globals;
}

export function setGlobals(givenGlobals: Partial<IntegrationPodGlobals>) {
  Object.assign(globals, givenGlobals);
}
