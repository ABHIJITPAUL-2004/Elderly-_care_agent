import "server-only";

import type { ZodType } from "zod";

import { chatWithOllama, OLLAMA_MODEL, type OllamaChatMessage } from "@/lib/services/ollama";
import { AppError } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";
import { DEFAULT_AGENT_RETRIES, DEFAULT_AGENT_TEMPERATURE } from "./constants";

const logger = createLogger("ai/framework");

export interface StructuredAgentOptions<TInput, TOutput> {
  name: string;
  systemPrompt: string;
  inputSchema: ZodType<TInput>;
  outputSchema: ZodType<TOutput>;
  buildUserMessage: (input: TInput) => string;
  model?: string;
  temperature?: number;
  retries?: number;
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error.";
}

function parseStructuredJson(content: string) {
  return JSON.parse(content) as unknown;
}

async function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function executeStructuredAgent<TInput, TOutput>(
  options: StructuredAgentOptions<TInput, TOutput>,
  rawInput: unknown,
): Promise<TOutput> {
  const input = options.inputSchema.parse(rawInput);
  const attempts = Math.max(1, options.retries ?? DEFAULT_AGENT_RETRIES + 1);
  let lastErrorMessage = "";

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const messages: OllamaChatMessage[] = [
        { role: "system", content: options.systemPrompt },
        { role: "user", content: options.buildUserMessage(input) },
      ];

      if (lastErrorMessage) {
        messages.splice(1, 0, {
          role: "system",
          content: `The previous response was invalid. Return only valid JSON that matches the schema. Validation issue: ${lastErrorMessage}`,
        });
      }

      const content = await chatWithOllama({
        model: options.model ?? OLLAMA_MODEL,
        temperature: options.temperature ?? DEFAULT_AGENT_TEMPERATURE,
        format: "json",
        messages,
      });

      if (typeof content !== "string" || content.trim().length === 0) {
        throw new Error("Empty model response.");
      }

      const parsed = parseStructuredJson(content);
      return options.outputSchema.parse(parsed);
    } catch (error) {
      lastErrorMessage = serializeError(error);
      logger.error(`${options.name} attempt ${attempt} failed`, { error: lastErrorMessage });

      if (attempt >= attempts) {
        throw new AppError(`${options.name} failed to produce a valid structured response.`, 502);
      }

      await delay(attempt * 150);
    }
  }

  throw new AppError(`${options.name} failed to produce a valid structured response.`, 502);
}
