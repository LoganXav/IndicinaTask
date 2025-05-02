import { ZodError, z } from "zod";
import { INextFunction, IRequest, IResponse } from "~/types/Http";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { ERROR, INTERNAL_SERVER_ERROR } from "~/helpers/messsges/SystemMessages";

export function ValidateRequestPath(schema: z.ZodObject<any, any>) {
  return async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      console.log(req.params);

      const validatedData = await schema.parseAsync(req.params);

      console.log(validatedData);
      req.params = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: issue.message,
        }));
        res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ status: ERROR, statusCode: HttpStatusCodeEnum.BAD_REQUEST, details: errorMessages });
      } else {
        res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({ status: ERROR, statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, message: INTERNAL_SERVER_ERROR });
      }
    }
  };
}
