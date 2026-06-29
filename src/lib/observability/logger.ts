export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogContext {
  module?: string;
  userId?: string;
  organizationId?: string;
  traceId?: string;
  meta?: Record<string, unknown>;
}

/**
 * Logger (Production-ready abstraction layer)
 *
 * Replace console.log usage across system with this.
 * Later integrates with:
 * - Datadog
 * - Sentry
 * - OpenTelemetry
 */
class Logger {
  private format(level: LogLevel, message: string, context?: LogContext) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };
  }

  info(message: string, context?: LogContext) {
    console.log(JSON.stringify(this.format("info", message, context)));
  }

  warn(message: string, context?: LogContext) {
    console.warn(JSON.stringify(this.format("warn", message, context)));
  }

  error(message: string, context?: LogContext) {
    console.error(JSON.stringify(this.format("error", message, context)));
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(JSON.stringify(this.format("debug", message, context)));
    }
  }
}

export const logger = new Logger();