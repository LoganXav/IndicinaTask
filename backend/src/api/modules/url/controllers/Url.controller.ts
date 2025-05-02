import { IRouter } from "~/types/Http";
import { autoInjectable } from "tsyringe";
import UrlService from "~/api/modules/url/services/Url.service";
import { urlEncodeSchema } from "../validators/UrlEncode.schema";
import { HttpHeaderEnums } from "~/helpers/enums/HttpHeaderEnums";
import { HttpMethodEnums } from "~/helpers/enums/HttpMethodEnums";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { HttpContentTypeEnums } from "~/helpers/enums/HttpContentTypeEnums";
import { ValidateRequestBody } from "~/api/shared/middleware/ValidateRequestBody";
import { EntryPointHandler, IRequest, IResponse, INextFunction } from "~/types/Http";

@autoInjectable()
export default class UrlController extends BaseController {
  static controllerName: string;
  urlService: UrlService;
  constructor(urlService: UrlService) {
    super();
    this.controllerName = "UrlController";
    this.urlService = urlService;
  }

  encode: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.urlService.encode(), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.TEXT_PLAIN,
    });
  };

  decode: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.urlService.decode(), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.TEXT_PLAIN,
    });
  };

  statistic: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.urlService.statistic(), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.TEXT_PLAIN,
    });
  };

  list: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.urlService.list(), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.TEXT_PLAIN,
    });
  };

  redirect: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.urlService.redirect(), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.TEXT_PLAIN,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnums.POST,
      path: "/api/encode",
      handlers: [ValidateRequestBody(urlEncodeSchema), this.encode],
      description: "Encode a Long URL to a Short URL",
    });

    this.addRoute({
      method: HttpMethodEnums.POST,
      path: "/api/decode",
      handlers: [this.decode],
      description: "Decode a Short URL to a Long URL",
    });

    this.addRoute({
      method: HttpMethodEnums.GET,
      path: "/api/statistic:url",
      handlers: [this.statistic],
      description: "Get the statistic of a Short URL",
    });

    this.addRoute({
      method: HttpMethodEnums.GET,
      path: "/api/list",
      handlers: [this.list],
      description: "Get the list of Short URLs",
    });

    this.addRoute({
      method: HttpMethodEnums.GET,
      path: "/:url",
      handlers: [this.redirect],
      description: "Redirect to the Long URL",
    });
  }
}
