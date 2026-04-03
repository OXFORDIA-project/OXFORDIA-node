import type { Request, RequestHandler, Response, NextFunction } from "express";
import type {
  RequestMethod,
  SolidTokenVerifierFunction,
} from "@solid/access-token-verifier";
import { createSolidTokenVerifier } from "@solid/access-token-verifier";
import { HttpError } from "./HttpError";
import { parseForwarded } from "@solid/community-server";
import type { PodServerGlobals } from "../types";

const solidOidcAccessTokenVerifier: SolidTokenVerifierFunction =
  createSolidTokenVerifier();

export function createValidateWebId(_globals: PodServerGlobals) {
  const validateWebId: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { headers } = request;
      const forwarded = parseForwarded(headers);
      const { webid: webId } = await solidOidcAccessTokenVerifier(
        request.headers["authorization"] as string,
        {
          header: request.headers["dpop"] as string,
          method: request.method as RequestMethod,
          url:
            (forwarded?.proto ?? request.protocol) +
            "://" +
            (forwarded?.host ?? request.get("host")) +
            request.originalUrl,
        },
      );

      if (!webId) {
        throw new HttpError(401, "Access token did not contain a WebID.");
      }
      response.locals.authenticatedAgent = webId;
      next();
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        throw error;
      }
      const message = `Error verifying Access Token via WebID: ${(error as Error).message}`;

      throw new HttpError(401, message);
    }
  };
  return validateWebId;
}
