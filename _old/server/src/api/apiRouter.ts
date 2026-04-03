import express, { NextFunction, Request, Response } from "express";
import { createValidateWebId } from "./validateWebId";
import { HttpError } from "./HttpError";
import { getGlobals } from "../globals";
import { createStatisticQueryHandler } from "./statistic/statisticQueryHandler";

export function createApiRouter() {
  const apiRouter = express.Router();
  const globals = getGlobals();
  const handleStatiscQuery = createStatisticQueryHandler(globals);

  /**
   * ===========================================================================
   * AUTHENTICATED FUNCTIONS
   * ===========================================================================
   */
  apiRouter.use(createValidateWebId());
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
      const { logger } = getGlobals();
      if (err instanceof Error) {
        logger.error("API Error", { error: err.message, stack: err.stack });
      }
      const error = HttpError.from(err);
      res.status(error.status).send(error.message);
    },
  );

  return apiRouter;
}
