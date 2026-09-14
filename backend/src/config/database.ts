/**
 * src/config/database.ts
 *
 * Exports a single PrismaClient instance (singleton pattern).
 *
 * Why singleton?
 * In development, ts-node-dev restarts the process frequently. Without this
 * pattern, each restart would open a fresh DB connection pool and exhaust the
 * limit quickly. The global trick prevents that in development while ensuring
 * a clean single instance in production.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// Extend the global type so TypeScript accepts our custom property
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

export default prisma;
