/**
 * src/server.ts
 *
 * Entry point — boots the HTTP server and connects to the database.
 *
 * This file should contain ONLY:
 *   - Reading PORT from env
 *   - Starting the Express app
 *   - Graceful shutdown handling
 *
 * All app configuration lives in app.ts.
 */

import app from "./app";
import { env } from "./config/env";
import prisma from "./config/database";
import { logger } from "./utils/logger";

const PORT = env.PORT;

async function bootstrap(): Promise<void> {
  try {
    // Verify database connection before accepting traffic
    await prisma.$connect();
    logger.info("✅  Database connected successfully");

    const server = app.listen(PORT, () => {
      logger.info(`🚀  Server running on http://localhost:${PORT}`);
      logger.info(`📋  Health check: http://localhost:${PORT}/health`);
      logger.info(`🌍  Environment: ${env.NODE_ENV}`);
    });

    // ─── Graceful Shutdown ─────────────────────────────────────────────────
    // When the process receives SIGTERM or SIGINT (Ctrl+C), close the server
    // gracefully so in-flight requests complete before we disconnect the DB.

    const shutdown = async (signal: string): Promise<void> => {
      logger.warn(`\n⚠️  ${signal} received — shutting down gracefully...`);

      server.close(async () => {
        await prisma.$disconnect();
        logger.info("🔌  Database disconnected. Goodbye.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Catch unhandled promise rejections that slipped through asyncHandler
    process.on("unhandledRejection", (reason: unknown) => {
      logger.error("Unhandled Rejection:", reason);
    });
  } catch (error) {
    logger.error("❌  Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
