import {
  HttpHandler,
  HttpHandlerInput,
} from "@solid/community-server";
import { Express } from "express";
import { getLoggerFor } from "global-logger-factory";
import { createApp } from "./createApp";
import type { PodServerConfig } from "./types";

/**
 * Handles any request to a integration route
 */
export class ApiHandler extends HttpHandler {
  private app: Express;
  protected readonly logger = getLoggerFor(this);

  constructor(config: PodServerConfig) {
    super();
    this.app = createApp(config);
  }

  async handle(input: HttpHandlerInput): Promise<void> {
    return new Promise((resolve, reject) => {
      input.response.on("finish", resolve);
      input.response.on("close", resolve);
      input.response.on("error", reject);

      this.app(input.request, input.response);
    });
  }
}
