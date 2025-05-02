import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import ApplicationError from "./ApplicationError";

export class InternalServerError extends ApplicationError {
  constructor(description = "Internal Server Error") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
