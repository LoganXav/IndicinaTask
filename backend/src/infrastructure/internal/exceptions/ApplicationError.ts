import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";

interface ApplicationErrorArgs {
  httpStatusCode: HttpStatusCodeEnum;
  description: string;
  isOperational?: boolean;
}

export default class ApplicationError extends Error {
  public readonly description: string;
  public readonly httpStatusCode: HttpStatusCodeEnum;
  public readonly isOperational: boolean;

  constructor(applicationErrorArgs: ApplicationErrorArgs) {
    super(applicationErrorArgs.description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.description = applicationErrorArgs.description;
    this.httpStatusCode = applicationErrorArgs.httpStatusCode;

    if (applicationErrorArgs.isOperational !== undefined) {
      this.isOperational = applicationErrorArgs.isOperational;
    }
    Error.captureStackTrace(this);
  }
}
