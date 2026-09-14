/**
 * src/utils/logger.ts
 *
 * A minimal, colour-coded console logger.
 * Replace with Winston or Pino later for production-grade logging with
 * structured JSON output, log levels, and file transports.
 *
 * Usage:
 *   logger.info("Server started on port 5000");
 *   logger.error("Something went wrong", err);
 */

const colours = {
  reset: "\x1b[0m",
  info: "\x1b[36m",   // cyan
  warn: "\x1b[33m",   // yellow
  error: "\x1b[31m",  // red
  debug: "\x1b[35m",  // magenta
} as const;

const timestamp = (): string => new Date().toISOString();

export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    console.log(`${colours.info}[INFO]${colours.reset} [${timestamp()}] ${message}`, ...args);
  },

  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`${colours.warn}[WARN]${colours.reset} [${timestamp()}] ${message}`, ...args);
  },

  error: (message: string, ...args: unknown[]): void => {
    console.error(`${colours.error}[ERROR]${colours.reset} [${timestamp()}] ${message}`, ...args);
  },

  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`${colours.debug}[DEBUG]${colours.reset} [${timestamp()}] ${message}`, ...args);
    }
  },
};
