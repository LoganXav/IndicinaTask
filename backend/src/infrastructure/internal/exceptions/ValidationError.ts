import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import ApplicationError from "./ApplicationError";

export class ValidationError extends ApplicationError {
  constructor(description = "Validation Error") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.UNPROCESSABLE_ENTITY,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
