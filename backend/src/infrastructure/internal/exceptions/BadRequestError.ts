import ApplicationError from "./ApplicationError";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
export class BadRequestError extends ApplicationError {
  constructor(description = "Bad Request Error", httpStatusCode = HttpStatusCodeEnum.BAD_REQUEST) {
    super({
      description,
      httpStatusCode,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
