import { IRouter } from "~/types/Http";
import { autoInjectable } from "tsyringe";
import UrlService from "~/api/modules/url/services/Url.service";
import { HttpHeaderEnums } from "~/helpers/enums/HttpHeaderEnums";
import { HttpMethodEnums } from "~/helpers/enums/HttpMethodEnums";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { HttpContentTypeEnums } from "~/helpers/enums/HttpContentTypeEnums";
import { ValidateRequestBody } from "~/api/shared/middleware/ValidateRequestBody";
import { ValidateRequestPath } from "~/api/shared/middleware/ValidateRequestPath";
import { EntryPointHandler, IRequest, IResponse, INextFunction } from "~/types/Http";
import { urlDecodeRequestSchema, urlEncodeRequestSchema, urlStatisticRequestSchema } from "~/api/modules/url/validators/Url.schema";

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
    return this.handleResult(res, next, this.urlService.execute(req.body), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.APPLICATION_JSON,
    });
  };

  decode: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.urlService.decode(req.body), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.APPLICATION_JSON,
    });
  };

  statistic: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.urlService.statistic(req.params), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.APPLICATION_JSON,
    });
  };

  list: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.urlService.list(), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.APPLICATION_JSON,
    });
  };

  redirect: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.urlService.redirect(), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnums.POST,
      path: "/api/encode",
      handlers: [ValidateRequestBody(urlEncodeRequestSchema), this.encode],
      description: "Encode a long URL to a short URL",
    });

    this.addRoute({
      method: HttpMethodEnums.POST,
      path: "/api/decode",
      handlers: [ValidateRequestBody(urlDecodeRequestSchema), this.decode],
      description: "Decode a Short URL to a Long URL",
    });

    this.addRoute({
      method: HttpMethodEnums.GET,
      path: "/api/statistic/:path",
      handlers: [ValidateRequestPath(urlStatisticRequestSchema), this.statistic],
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
