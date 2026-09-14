/**
 * src/middleware/requestLogger.ts
 *
 * Simple HTTP request logger middleware.
 * Logs every incoming request: method, path, status, and duration.
 *
 * In production you would replace this with morgan or a structured logger.
 */

import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const colour =
      status >= 500
        ? "\x1b[31m" // red
        : status >= 400
        ? "\x1b[33m" // yellow
        : "\x1b[32m"; // green

    logger.info(
      `${req.method} ${req.originalUrl} ${colour}${status}\x1b[0m — ${duration}ms`
    );
  });

  next();
};
