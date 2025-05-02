import { Response } from "express";
import { CRITICAL_ERROR_EXITING, ERROR } from "~/helpers/messsges/SystemMessages";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { LoggingProviderFactory } from "../logger/LoggingProviderFactory";
import ApplicationError from "./ApplicationError";

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

  private isTrustedError(error: Error) {
    if (error instanceof ApplicationError) {
      return !!error.isOperational;
    }
  }

  private handleTrustedError(error: ApplicationError, response: Response): void {
    response.status(error.httpStatusCode).json({
      statusCode: error.httpStatusCode,
      status: ERROR,
      message: error.message,
    });
  }
  private handleCriticalError(error: Error | ApplicationError, response?: Response): void {
    try {
      response?.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: CRITICAL_ERROR_EXITING,
      });
    } catch (error: any) {
      this.loggingProvider.error(`Critical: Error in Error handling: ${error.message}`);
    }
  }
}
export const errorHandler = new ErrorHandler();
