import request from "supertest";
import { Application } from "~/infrastructure/internal/application";
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";
import { errorHandler } from "~/infrastructure/internal/exceptions/ErrorHandler";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { CRITICAL_ERROR_EXITING, ERROR } from "~/helpers/messsges/SystemMessages";
import { NextFunction, Request, Response } from "express";

describe("ErrorHandler", () => {
  it("Should handle trusted errors", async () => {
    const app = new Application();
    const server = app.express.app;
    const error = new ApplicationError({
      httpStatusCode: HttpStatusCodeEnum.BAD_REQUEST,
      description: "Test error",
      isOperational: true,
    });

    server.use((req: Request, res: Response, next: NextFunction) => {
      errorHandler.handleError(error, res);
    });

    const response = await request(server).get("/api/ping");

    expect(response.status).toBe(error.httpStatusCode);
    expect(response.body).toEqual({
      statusCode: error.httpStatusCode,
      status: ERROR,
      message: error.message,
    });
  });

  it("Should handle critical errors", async () => {
    const app = new Application();
    const server = app.express.app;
    const error = new Error("Test critical error");

    server.use((req: Request, res: Response, next: NextFunction) => {
      errorHandler.handleError(error, res);
    });

    const response = await request(server).get("/api/ping");

    expect(response.status).toBe(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      status: ERROR,
      message: CRITICAL_ERROR_EXITING,
    });
  });

  it("Should handle critical errors without response object", () => {
    const error = new Error("Test critical error");
    expect(() => errorHandler.handleError(error)).not.toThrow();
  });
});
