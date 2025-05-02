import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import ApplicationError from "./ApplicationError";

export class NotFoundError extends ApplicationError {
  constructor(description = "Not found Error") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.NOT_FOUND,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
