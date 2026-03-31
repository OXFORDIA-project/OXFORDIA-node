import {
  type PodServerConfig,
  createApp as createCoreApp,
} from "@oxfordia/pod-server-core";
import {
  HttpHandler,
  HttpHandlerInput,
  ResourceStore,
} from "@solid/community-server";
import { Express } from "express";
import { getLoggerFor } from "global-logger-factory";
import { nemalineDataPlugin } from "@oxfordia/data-plugin-nemaline_core";
import { kaplanMeierPlugin } from "@oxfordia/stat-plugin-kaplan-meier_server";
import { meanPlugin } from "@oxfordia/stat-plugin-mean_server";
export * from "./CreatePasswordLoginHandler";
export * from "./CreatePromptFactory";

export const defaultDataPlugins = [nemalineDataPlugin];
export const defaultStatisticPlugins = [meanPlugin, kaplanMeierPlugin];

export function createApp(
  config: Omit<PodServerConfig, "dataPlugins" | "statisticPlugins">,
) {
  return createCoreApp({
    ...config,
    dataPlugins: defaultDataPlugins,
    statisticPlugins: defaultStatisticPlugins,
  });
}

export interface ApiHandlerArgs {
  baseUrl: string;
  rootFilePath: string;
  sparqlEndpoint: string;
  resourceStore: ResourceStore;
}

export class ApiHandler extends HttpHandler {
  private app: Express;
  protected readonly logger = getLoggerFor(this);

  public constructor(config: ApiHandlerArgs) {
    super();
    this.app = createApp(config);
  }

  public async handle(input: HttpHandlerInput): Promise<void> {
    return new Promise((resolve, reject) => {
      input.response.on("finish", resolve);
      input.response.on("close", resolve);
      input.response.on("error", reject);

      this.app(input.request, input.response);
    });
  }
}
