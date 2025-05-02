import { Response } from "express";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { CRITICAL_ERROR_EXITING, ERROR } from "~/helpers/messsges/SystemMessages";
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

/**
 * @description Handles errors in the application.
 * @author [@codeconcisely](https://www.codeconcisely.com/posts/how-to-handle-errors-in-express-with-typescript/)
 */

class ErrorHandler {
  private loggingProvider = LoggingProviderFactory.build();

  public handleError(error: Error | ApplicationError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as ApplicationError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private isTrustedError(error: Error): boolean {
    if (error instanceof ApplicationError) {
      return !!error.isOperational;
    }
    return false;
  }

  private handleTrustedError(error: ApplicationError, response: Response): void {
    response.status(error.httpStatusCode).json({
      statusCode: error.httpStatusCode,
      status: ERROR,
      message: error.message,
    });
  }
  private handleCriticalError(_error: Error | ApplicationError, response?: Response): void {
    try {
      if (response && !response.headersSent) {
        response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: CRITICAL_ERROR_EXITING,
        });
      }

      this.loggingProvider.error("Critical error encountered. Beginning graceful shutdown...");

      process.exitCode = 1;

      // Short delay to allow logs to flush
      setTimeout(() => {
        this.loggingProvider.info("Exiting process now.");
        process.exit(1);
      }, 1000);
    } catch (handlingError: any) {
      this.loggingProvider.error("Failed to complete graceful shutdown. Forcing exit.");
      process.exit(1);
    }
  }
}
export const errorHandler = new ErrorHandler();
