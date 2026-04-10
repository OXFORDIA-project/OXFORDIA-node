import express, { NextFunction, Request, Response } from "express";
import { createValidateWebId } from "./validateWebId";
import { HttpError } from "./HttpError";
import { createStatisticQueryHandler } from "./statistic/statisticQueryHandler";
import type { PodServerGlobals } from "../types";

function truncateForLog(value: string, maxChars = 4000): string {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, maxChars)}... [truncated]`;
}

function serializeForLog(value: unknown, maxChars = 4000): string {
  try {
    return truncateForLog(JSON.stringify(value, null, 2), maxChars);
  } catch {
    return truncateForLog(String(value), maxChars);
  }
}

function formatUnknownError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}

function wasLogged(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      (error as { oxfordiaLogged?: unknown }).oxfordiaLogged === true,
  );
}

function renderApiErrorLog(
  err: unknown,
  req: Request,
  res: Response,
  status: number,
): string {
  const lines = [
    `API Error ${req.method} ${req.originalUrl} -> ${status}`,
  ];

  if (req.params?.route) {
    lines.push(`Route: ${req.params.route}`);
  }
  if (res.locals.authenticatedAgent) {
    lines.push(
      `Authenticated agent: ${String(res.locals.authenticatedAgent)}`,
    );
  }
  if (req.body !== undefined) {
    lines.push("Request body:");
    lines.push(serializeForLog(req.body));
  }

  lines.push(`Error: ${formatUnknownError(err)}`);

  if (err instanceof Error && err.stack) {
    lines.push("Stack:");
    lines.push(truncateForLog(err.stack, 8000));
  }

  return lines.join("\n");
}

export function createApiRouter(globals: PodServerGlobals) {
  const apiRouter = express.Router();
  const handleStatiscQuery = createStatisticQueryHandler(globals);

  /**
   * ===========================================================================
   * AUTHENTICATED FUNCTIONS
   * ===========================================================================
   */
  apiRouter.use(createValidateWebId(globals));
  apiRouter.use(express.json({ limit: "1mb" }));

  /**
   * ===========================================================================
   * STATISTICS ROUTES
   * ===========================================================================
   */
  apiRouter.post("/stat/:route", handleStatiscQuery);

  /**
   * ===========================================================================
   * ERROR HANDLING
   * ===========================================================================
   */
  apiRouter.use(
    (err: unknown, req: Request, res: Response, _next: NextFunction) => {
      const { logger } = globals;
      const error = HttpError.from(err);
      if (!wasLogged(err)) {
        logger.error(
          renderApiErrorLog(err, req, res, error.status),
          err instanceof Error
            ? { error: err.message, stack: err.stack, status: error.status }
            : { status: error.status },
        );
      }
      res.status(error.status).send(error.message);
    },
  );

  return apiRouter;
}
