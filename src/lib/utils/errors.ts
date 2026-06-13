import { NextResponse } from "next/server";

import { createLogger } from "./logger";

const logger = createLogger("api/errors");

export class AppError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.name = "AppError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function createSafeErrorResponse(error: unknown) {
  if (isAppError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  logger.error("Unexpected error", { error });
  return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
}

export function createMethodNotAllowedResponse() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
