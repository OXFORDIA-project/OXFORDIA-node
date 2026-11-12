import { checkTriplestore } from "@oxfordia/pod-server-core";
import {
  HttpHandler,
  HttpHandlerInput,
  NotImplementedHttpError,
} from "@solid/community-server";

export interface HealthCheckHandlerArgs {
  sparqlEndpoint: string;
}

/**
 * Answers `GET /healthz` by raw request path, before CSS resolves the request
 * against the base URL, so probes that hit the container directly (kubelet,
 * Docker HEALTHCHECK) work regardless of the Host header.
 */
export class HealthCheckHandler extends HttpHandler {
  private readonly sparqlEndpoint: string;

  public constructor(args: HealthCheckHandlerArgs) {
    super();
    this.sparqlEndpoint = args.sparqlEndpoint;
  }

  public async canHandle({ request }: HttpHandlerInput): Promise<void> {
    const path = (request.url ?? "").split("?")[0];
    if (path !== "/healthz" || (request.method !== "GET" && request.method !== "HEAD")) {
      throw new NotImplementedHttpError("Not a health check request");
    }
  }

  public async handle({ response }: HttpHandlerInput): Promise<void> {
    let status = 200;
    let body: { ok: boolean; error?: string } = { ok: true };
    try {
      if (this.sparqlEndpoint) {
        await checkTriplestore(this.sparqlEndpoint);
      }
    } catch (error) {
      status = 503;
      body = {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown health check error",
      };
    }
    response.writeHead(status, { "content-type": "application/json" });
    response.end(JSON.stringify(body));
  }
}
