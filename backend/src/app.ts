/**
 * src/app.ts
 *
 * Express application factory.
 * Responsible for:
 *   1. Applying global middleware (CORS, JSON parsing, request logging)
 *   2. Mounting all API routes under /api
 *   3. Health check endpoint
 *   4. 404 + error handler (always last)
 *
 * Keeping this separate from server.ts allows you to import `app` in tests
 * without actually binding to a port.
 */

import express, { Application, Request, Response } from "express";
import cors from "cors";


import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { requestLogger } from "./middleware/requestLogger";
import { env } from "./config/env";
import apiRoutes from "./routes";

const app: Application = express();

// ─── Global Middleware ──────────────────────────────────────────────────────

app.use(
  cors({
    origin: env.NODE_ENV === "production" ? process.env.ALLOWED_ORIGINS?.split(",") : "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);

// ─── Health Check ────────────────────────────────────────────────────────────
// GET /health
// Used by Docker health checks, load balancers, and uptime monitors.
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server running",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api", apiRoutes);

// ─── 404 + Error Handlers (must be last) ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
