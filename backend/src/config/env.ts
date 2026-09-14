/**
 * src/config/env.ts
 *
 * Centralised environment variable loader.
 * dotenv is called here so it runs before anything else imports from config.
 * Every module that needs an env var should import it from here — never from
 * process.env directly — so we get type-safety and a single source of truth.
 */

import dotenv from "dotenv";
import path from "path";

// Load .env from the project root (one level above src/)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const databaseUrl = process.env.DATABASE_URL ?? "";

export const env: {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  WHISPER_API_URL: string;
  OLLAMA_BASE_URL: string;
  OLLAMA_MODEL: string;
} = {
  PORT: parseInt(process.env.PORT ?? "5000", 10),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DATABASE_URL: databaseUrl,

  // Future integrations — safe to leave empty for now
  WHISPER_API_URL: process.env.WHISPER_API_URL ?? "",
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL ?? "qwen2.5",
};

// Validate critical variables at startup
const required: (keyof typeof env)[] = ["DATABASE_URL"];
for (const key of required) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
