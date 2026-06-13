export interface LogContext {
  [key: string]: unknown;
}

export interface Logger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
}

function writeLog(level: "info" | "warn" | "error" | "debug", scope: string, message: string, context?: LogContext) {
  const payload = context ? { scope, ...context } : { scope };

  if (level === "error") {
    console.error(message, payload);
    return;
  }

  if (level === "warn") {
    console.warn(message, payload);
    return;
  }

  if (level === "debug") {
    console.debug(message, payload);
    return;
  }

  console.info(message, payload);
}

export function createLogger(scope: string): Logger {
  return {
    info(message, context) {
      writeLog("info", scope, message, context);
    },
    warn(message, context) {
      writeLog("warn", scope, message, context);
    },
    error(message, context) {
      writeLog("error", scope, message, context);
    },
    debug(message, context) {
      writeLog("debug", scope, message, context);
    },
  };
}