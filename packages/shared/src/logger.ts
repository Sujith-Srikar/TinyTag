import type { LogLevel, LogMessage } from "./types/web";

class Logger {
  private isProduction = process.env.NODE_ENV === "production";

  private shouldLog(level: LogLevel) {
    if (this.isProduction && level === "debug") {
      return false;
    }

    return true;
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
      ...(data !== undefined && { data }),
    };
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    if (!this.shouldLog(level)) return;

    const log = this.formatLog(level, message, data);

    switch (level) {
      case "error":
        console.error(log);
        break;

      case "warn":
        console.warn(log);
        break;

      case "debug":
        console.debug(log);
        break;

      default:
        console.log(log);
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