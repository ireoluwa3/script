// File: backend/utils/logger.ts

import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const logging = createLogger({
  levels: logLevels,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
});

const categoryTransports = new Map<string, DailyRotateFile>();

function ensureCategoryTransport(category: string) {
  if (!categoryTransports.has(category)) {
    const transport = new DailyRotateFile({
      filename: `logs/%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      level: "info",
      handleExceptions: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: format.combine(
        format.label({ label: category }),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.json()
      ),
    });

    logging.add(transport);
    categoryTransports.set(category, transport);
  }
}

function logger(
  level: keyof typeof logLevels,
  category: string,
  file: any,
  message: string
) {
  ensureCategoryTransport(category);
  logging.log(level, message, { category, file });
}

export function logError(category: string, error: Error, filePath: string) {
  const errorMessage = error.message || error.stack || "Unknown error";
  console.log(errorMessage);
  logger("error", category, filePath, errorMessage);
}

export default logger;
