import { IRouter } from "~/types/Http";
import { autoInjectable } from "tsyringe";
import { HttpHeaderEnums } from "~/helpers/enums/HttpHeaderEnums";
import { HttpMethodEnums } from "~/helpers/enums/HttpMethodEnums";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { HttpContentTypeEnums } from "~/helpers/enums/HttpContentTypeEnums";
import PingHealthService from "~/api/modules/ping/services/PingHealth.service";
import { EntryPointHandler, IRequest, IResponse, INextFunction } from "~/types/Http";

@autoInjectable()
export default class PingController extends BaseController {
  static controllerName: string;
  pingHealthService: PingHealthService;
  constructor(pingHealthService: PingHealthService) {
    super();
    this.controllerName = "PingHealthController";
    this.pingHealthService = pingHealthService;
  }

  ping: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.pingHealthService.execute(), {
      [HttpHeaderEnums.CONTENT_TYPE]: HttpContentTypeEnums.TEXT_PLAIN,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());
    this.addRoute({
      method: HttpMethodEnums.GET,
      path: "/ping",
      handlers: [this.ping],
      description: "API health status endpoint",
    });
  }
}
