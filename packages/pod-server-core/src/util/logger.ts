import { getLoggerFor } from "global-logger-factory";

export class Logger {
  private winstonLogger = getLoggerFor(this);

  // General logging methods (using winston)
  info(message: string, meta?: Record<string, unknown>): void {
    this.winstonLogger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.winstonLogger.warn(message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.winstonLogger.error(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (meta) {
      this.winstonLogger.debug(`${message} ${JSON.stringify(meta)}`);
    } else {
      this.winstonLogger.debug(message);
    }
  }
}

// Create a singleton instance
export const logger = new Logger();
