import "server-only";

export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.1";

export interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaChatOptions {
  model?: string;
  messages: OllamaChatMessage[];
  temperature?: number;
  format?: "json";
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

export async function chatWithOllama(options: OllamaChatOptions): Promise<string> {
  const response = await fetch(`${normalizeBaseUrl(OLLAMA_BASE_URL)}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? OLLAMA_MODEL,
      stream: false,
      format: options.format ?? "json",
      options: {
        temperature: options.temperature ?? 0.2,
      },
      messages: options.messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed with ${response.status}: ${errorText}`);
  }

  const payload = await response.json() as {
    message?: { content?: string };
    response?: string;
  };

  const content = payload.message?.content ?? payload.response;

  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("Ollama returned an empty response.");
  }

  return content;
}