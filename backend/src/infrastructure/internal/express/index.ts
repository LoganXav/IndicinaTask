import cors from "cors";
import helmet from "helmet";
import express, { Express as Server } from "express";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

export default class Express {
  app: Server;
  loggingProvider: ILoggingDriver;
  constructor() {
    this.app = express();
    this.loggingProvider = LoggingProviderFactory.build();
    this.loadMiddlewares();
  }

  private loadMiddlewares(): void {
    this.app
      .use(cors())
      .use(helmet())
      .use(express.json())
      .use(express.urlencoded({ extended: true }));
  }

  private loadControllersDynamically(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load controllers dynamically here.
      // reject if any error with loading controllers.
      return resolve();
    });
  }

  initializeServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadControllersDynamically()
        .then(async () => {
          // Initialize database service and other services here.
          // reject if any error with database or other service.
          return resolve();
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}
