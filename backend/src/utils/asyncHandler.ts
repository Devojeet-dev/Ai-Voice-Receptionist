/**
 * src/utils/asyncHandler.ts
 *
 * A tiny wrapper for async Express route handlers.
 *
 * Without this wrapper you would have to write try/catch in every controller.
 * With it, any thrown error (including ApiError instances) is automatically
 * forwarded to Express's next() and caught by the global error handler.
 *
 * Usage:
 *   router.get("/", asyncHandler(myController.getAll));
 */

import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler =
  (fn: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
