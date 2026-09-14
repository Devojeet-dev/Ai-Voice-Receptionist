/**
 * src/middleware/notFound.ts
 *
 * 404 handler — catches requests that did not match any defined route.
 * Register this AFTER all routes but BEFORE the error handler in app.ts.
 *
 * Usage in app.ts:
 *   app.use(notFound);
 *   app.use(errorHandler);
 */

import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
