import { Server, createServer } from "http";
import Express from "~/infrastructure/internal/express";
import AppSettings from "~/helpers/settings/AppSettings";

export class Application {
  express: Express;
  server: Server;

  constructor() {
    this.express = new Express();
    this.server = createServer(this.express.app);
  }

  start(startAt: Date): void {
    this.express
      .initializeServices()
      .then(() => {
        this.server.listen(AppSettings.ServerPort);
      })
      .catch((error: Error) => {
        this.express.loggingProvider.error(`Starting server error: ${error}`);
      });

    this.server.on("listening", () => {
      this.express.loggingProvider.info(`${AppSettings.ServiceName.toUpperCase()} Server running on ${AppSettings.ServerHost}:${AppSettings.ServerPort}${AppSettings.ServerRoot}`);
      const processUptime = process.uptime().toFixed(3);
      const totalStartupTime = ((new Date().valueOf() - startAt.valueOf()) / 1000).toFixed(3);
      this.express.loggingProvider.info(`Application startup took ${totalStartupTime} seconds (Node process has been running for ${processUptime} seconds)`);
    });
  }
}
