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
import { legacyNemalineDataPlugin } from "@oxfordia/data-plugin-legacy-nemaline_core";
import { nemalineDataPlugin } from "@oxfordia/data-plugin-nemaline_core";
import { countPlugin } from "@oxfordia/stat-plugin-count_server";
import { kaplanMeierPlugin } from "@oxfordia/stat-plugin-kaplan-meier_server";
import { meanPlugin } from "@oxfordia/stat-plugin-mean_server";
import { standardDeviationPlugin } from "@oxfordia/stat-plugin-standard-deviation_server";
export * from "./CreatePasswordLoginHandler";
export * from "./CreatePromptFactory";
export * from "./HealthCheckHandler";

export const defaultDataPlugins = [nemalineDataPlugin, legacyNemalineDataPlugin];
export const defaultStatisticPlugins = [
  meanPlugin,
  kaplanMeierPlugin,
  countPlugin,
  standardDeviationPlugin,
];

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
