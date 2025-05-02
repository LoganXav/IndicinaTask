import "dotenv/config";
import "reflect-metadata";
import { Application } from "~/infrastructure/internal/application";
import { errorHandler } from "~/infrastructure/internal/exceptions/ErrorHandler";

const app = new Application();

app.start(new Date());

process.on("uncaughtException", (error: Error) => {
  errorHandler.handleError(error);
});
