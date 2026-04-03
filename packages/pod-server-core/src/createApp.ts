import express, { Express } from "express";
import { createApiRouter } from "./api/apiRouter";
import { createPodServerGlobals, type PodServerConfig } from "./types";

/**
 * Configure Express trust proxy from TRUST_PROXY env.
 * When true/1, the app trusts X-Forwarded-For and X-Forwarded-Proto (e.g. behind F5, nginx).
 * When false/unset, only the direct connection is trusted.
 */
function applyTrustProxy(app: Express): void {
  const raw = process.env.TRUST_PROXY;
  if (raw === undefined || raw === "") {
    return;
  }
  const lower = raw.toLowerCase();
  if (lower === "true" || lower === "1") {
    app.set("trust proxy", true);
    return;
  }
  if (lower === "false" || lower === "0") {
    app.set("trust proxy", false);
    return;
  }
  const n = parseInt(raw, 10);
  if (!Number.isNaN(n) && n >= 0) {
    app.set("trust proxy", n);
  }
}

export function createApp(config: PodServerConfig): Express {
  const app = express();
  applyTrustProxy(app);
  const apiRouter = createApiRouter(createPodServerGlobals(config));

  app.use("/.api", apiRouter);

  return app;
}
