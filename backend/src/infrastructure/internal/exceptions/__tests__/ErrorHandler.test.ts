import request from "supertest";
import { NextFunction, Request, Response } from "express";
import { Application } from "~/infrastructure/internal/application";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { errorHandler } from "~/infrastructure/internal/exceptions/ErrorHandler";
import { CRITICAL_ERROR_EXITING, ERROR } from "~/helpers/messsges/SystemMessages";
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";

describe("ErrorHandler", () => {
  // Mock process.exit to prevent tests from actually exiting
  const mockExit = jest.spyOn(process, "exit").mockImplementation((code?: number | string | null) => {
    return undefined as never;
  });

  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should handle trusted errors", async () => {
    const app = new Application();
    const server = app.express.app;
    const error = new ApplicationError({
      httpStatusCode: HttpStatusCodeEnum.BAD_REQUEST,
      description: "Test error",
      isOperational: true,
    });

    server.use((_req: Request, res: Response, _next: NextFunction) => {
      errorHandler.handleError(error, res);
    });

    const response = await request(server).get("/api/ping");

    expect(response.status).toBe(error.httpStatusCode);
    expect(response.body).toEqual({
      statusCode: error.httpStatusCode,
      status: ERROR,
      message: error.message,
    });
    // Should not call process.exit for trusted errors
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("Should handle critical errors with proper shutdown sequence", async () => {
    const app = new Application();
    const server = app.express.app;
    const error = new Error("Test critical error");

    // Mock setTimeout to execute immediately
    jest.useFakeTimers();

    server.use((_req: Request, res: Response, _next: NextFunction) => {
      errorHandler.handleError(error, res);
    });

    const response = await request(server).get("/api/ping");

    expect(response.status).toBe(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      status: ERROR,
      message: CRITICAL_ERROR_EXITING,
    });

    // Fast-forward timers
    jest.runAllTimers();

    // Verify shutdown sequence
    expect(process.exitCode).toBe(1);
    expect(mockExit).toHaveBeenCalledWith(1);

    // Restore real timers
    jest.useRealTimers();
  });

  it("Should handle critical errors without response object", () => {
    const error = new Error("Test critical error");

    // Mock setTimeout to execute immediately
    jest.useFakeTimers();

    errorHandler.handleError(error);

    // Fast-forward timers
    jest.runAllTimers();

    // Verify shutdown sequence
    expect(process.exitCode).toBe(1);
    expect(mockExit).toHaveBeenCalledWith(1);

    // Restore real timers
    jest.useRealTimers();
  });

  it("Should handle errors during shutdown gracefully", () => {
    const error = new Error("Test critical error");

    // Force an error during shutdown
    jest.spyOn(errorHandler["loggingProvider"], "error").mockImplementationOnce(() => {
      throw new Error("Logging failed");
    });

    errorHandler.handleError(error);

    // Should still exit
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
