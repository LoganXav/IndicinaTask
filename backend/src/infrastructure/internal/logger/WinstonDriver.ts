import winston from "winston";
import { ILoggingDriver } from "./ILoggingDriver";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    success: 3,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "blue",
    success: "green",
  },
};

export class WinstonDriver implements ILoggingDriver {
  winston: winston.Logger;

  constructor() {
    const customLogFormat = winston.format.printf(({ timestamp, message, level }) => {
      return `[${level.toUpperCase()}] ${timestamp} ${message}`;
    });
    this.winston = winston.createLogger({
      levels: customLevels.levels,
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          level: "info",
          filename: "logs/infoLogs",
        }),
        new winston.transports.File({
          level: "success",
          filename: "logs/accessLogs",
        }),
        new winston.transports.File({
          level: "warn",
          filename: "logs/warningLogs",
        }),
        new winston.transports.File({
          level: "error",
          filename: "logs/errorLogs",
        }),
      ],
      format: winston.format.combine(winston.format.json(), winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customLogFormat),
    });

    winston.addColors(customLevels.colors);
  }

  info(data: string): void {
    this.winston.info(data);
  }
  success(data: string): void {
    this.winston.log("success", data);
  }
  warning(data: string): void {
    this.winston.warn(data);
  }
  error(data: string): void {
    this.winston.error(data);
  }
}
