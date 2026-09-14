import { z } from "zod";

export interface ToolDefinition<TInput = unknown, TResult = unknown> {
  name: string;
  description: string;
  inputSchema: z.ZodType<TInput>;
  execute: (input: TInput) => Promise<TResult> | TResult;
}

export type ToolRegistry = Record<string, ToolDefinition<unknown, unknown>>;
