/**
 * src/middleware/errorHandler.ts
 *
 * Global error handling middleware — must be registered LAST in app.ts.
 *
 * It catches every error forwarded via next(err), including:
 *   - Thrown ApiError instances (our operational errors)
 *   - Unexpected runtime errors (bugs, unhandled rejections, etc.)
 *
 * The client always receives a clean JSON payload with no stack traces in prod.
 */

import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // If it's our own ApiError, use its status code and message directly
  if (err instanceof ApiError) {
    logger.error(`[ApiError] ${err.statusCode} - ${err.message}`);

    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Unexpected error — log the full stack but hide details from the client
  logger.error("[UnhandledError]", err);

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
};
