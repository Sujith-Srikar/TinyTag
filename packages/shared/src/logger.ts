import type { LogLevel, LogMessage } from "./types/web";

class Logger {
  private readonly isProduction = process.env.NODE_ENV === "production";

  private shouldLog(level: LogLevel) {
    return !(this.isProduction && level === "debug");
  }

  private serialize(value: unknown): unknown {
    if (value instanceof Error) {
      const error = value as Error & {
        cause?: unknown;
        data?: unknown;
        shape?: unknown;
      };

      return {
        name: error.name,
        message: error.message,
        stack: this.isProduction ? undefined : error.stack,
        cause:
          error.cause !== undefined ? this.serialize(error.cause) : undefined,
        data: error.data !== undefined ? this.serialize(error.data) : undefined,
        shape:
          error.shape !== undefined ? this.serialize(error.shape) : undefined,
      };
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.serialize(item));
    }

    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, this.serialize(val)]),
      );
    }

    return value;
  }

  private formatLog(
    level: LogLevel,
    message: string,
    data?: unknown,
  ): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(data !== undefined && {
        data: this.serialize(data),
      }),
    };
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    if (!this.shouldLog(level)) return;

    const entry = this.formatLog(level, message, data);

    switch (level) {
      case "error":
        console.error(entry);
        break;

      case "warn":
        console.warn(entry);
        break;

      case "debug":
        console.debug(entry);
        break;

      default:
        console.info(entry);
    }
  }

  info(message: string, data?: unknown) {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown) {
    this.log("warn", message, data);
  }

  error(message: string, data?: unknown) {
    this.log("error", message, data);
  }

  debug(message: string, data?: unknown) {
    this.log("debug", message, data);
  }
}

export const logger = new Logger();