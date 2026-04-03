import express, { NextFunction, Request, Response } from "express";
import { createValidateWebId } from "./validateWebId";
import { HttpError } from "./HttpError";
import { createStatisticQueryHandler } from "./statistic/statisticQueryHandler";
import type { PodServerGlobals } from "../types";

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
      if (err instanceof Error) {
        logger.error("API Error", { error: err.message, stack: err.stack });
      }
      const error = HttpError.from(err);
      res.status(error.status).send(error.message);
    },
  );

  return apiRouter;
}
