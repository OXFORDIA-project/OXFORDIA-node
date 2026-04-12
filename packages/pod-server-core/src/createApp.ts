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

async function checkTriplestore(sparqlEndpoint: string): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(sparqlEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/sparql-results+json, application/json;q=0.9, */*;q=0.1",
      },
      body: "query=ASK%20%7B%20%3Fs%20%3Fp%20%3Fo%20%7D",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`SPARQL endpoint responded with ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

export function createApp(config: PodServerConfig): Express {
  const app = express();
  applyTrustProxy(app);
  const apiRouter = createApiRouter(createPodServerGlobals(config));

  app.get("/healthz", async (_req, res) => {
    try {
      if (config.sparqlEndpoint) {
        await checkTriplestore(config.sparqlEndpoint);
      }

      res.status(200).json({ ok: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown health check error";
      res.status(503).json({ ok: false, error: message });
    }
  });

  app.use("/.api", apiRouter);

  return app;
}
