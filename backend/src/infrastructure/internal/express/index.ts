import cors from "cors";
import helmet from "helmet";
import { resolve } from "path";
import { sync } from "fast-glob";
import { container } from "tsyringe";
import { IRouter } from "~/types/Http";
import { TypeParser } from "~/utils/TypeUtils";
import ServerConfig from "~/config/ServerConfig";
import AppSettings from "~/helpers/settings/AppSettings";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { errorHandler } from "~/infrastructure/internal/exceptions/ErrorHandler";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import express, { Application, NextFunction, Request, Response, Router, Express as Server } from "express";

export default class Express {
  app: Server;
  loggingProvider: ILoggingDriver;
  constructor() {
    this.app = express();
    this.loggingProvider = LoggingProviderFactory.build();
    this.loadMiddlewares();
    this.loadErrorHandler();
  }

  private loadMiddlewares(): void {
    this.app
      .use(cors())
      .use(helmet())
      .use(express.json())
      .use(express.urlencoded({ extended: true }));
  }

  private async loadControllersDynamically(): Promise<void> {
    const controllerPaths = sync(ServerConfig.Controllers.DefaultPath, {
      onlyFiles: true,
      ignore: ServerConfig.Controllers.Ignore,
    });

    this.loggingProvider.info(`Initializing controllers for ${AppSettings.ServiceName.toUpperCase()}`);

    for (const filePath of controllerPaths) {
      const controllerPath = resolve(filePath);

      const { default: controller } = await import(controllerPath);
      const resolvedController: BaseController = container.resolve(controller);
      resolvedController.initializeRoutes(TypeParser.cast<IRouter>(Router));
      this.app.use(AppSettings.ServerRoot, TypeParser.cast<Application>(resolvedController.router));
      this.loggingProvider.info(`${resolvedController?.controllerName} was initialized`);
    }

    return Promise.resolve();
  }

  initializeServices(): Promise<void> {
    return this.loadControllersDynamically();
  }

  private loadErrorHandler(): void {
    this.app.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
      this.loggingProvider.error(err.message);
      next(err);
    });

    this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      errorHandler.handleError(err, res);
    });
  }
}
