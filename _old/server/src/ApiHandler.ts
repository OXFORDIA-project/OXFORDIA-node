import {
  HttpHandler,
  HttpHandlerInput,
  ResourceStore,
} from "@solid/community-server";
import { Express, response } from "express";
import { getLoggerFor } from "global-logger-factory";
import { createApp } from "./createApp";

export interface ApiHandlerArgs {
  baseUrl: string;
  rootFilePath: string;
  sparqlEndpoint: string;
  resourceStore: ResourceStore;
}

/**
 * Handles any request to a integration route
 */
export class ApiHandler extends HttpHandler {
  private app: Express;
  protected readonly logger = getLoggerFor(this);

  constructor(args: ApiHandlerArgs) {
    super();

    this.app = createApp(
      args.baseUrl,
      args.rootFilePath,
      args.sparqlEndpoint,
      args.resourceStore,
    );
  }

  async handle(input: HttpHandlerInput): Promise<void> {
    return new Promise((resolve, reject) => {
      response.on("finish", resolve); // success
      response.on("close", resolve); // e.g. client aborted
      response.on("error", reject); // error sending response

      // Trigger the app
      this.app(input.request, input.response);
    });
  }
}
