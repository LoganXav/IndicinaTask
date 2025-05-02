import { IResult } from "~/api/shared/result/IResult";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HeaderType, INextFunction, IResponse, IRouter, RouteType } from "~/types/Http";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

export default abstract class BaseController {
  controllerName: string;
  router?: IRouter;
  loggingProvider: ILoggingDriver;

  constructor() {
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public abstract initializeRoutes(router: IRouter): void;

  public setRouter(router: IRouter): void {
    this.router = router;
  }

  public addRoute(route: RouteType): void {
    const { method, handlers, path } = route;

    if (!this.router) {
      throw new InternalServerError("Router not initialized, you should call setRouter before addRoute.", false);
    }
    // Calls the routes with the path and handlers i.e controllers with the given HTTP method
    this.router[method](path, ...handlers);
  }

  public async handleResultData(res: IResponse, next: INextFunction, servicePromise: Promise<IResult>, headersToSet?: HeaderType): Promise<void> {
    try {
      return await this.getResultData(res, await servicePromise, headersToSet);
    } catch (error) {
      return next(error);
    }
  }

  public async handleResult(res: IResponse, next: INextFunction, servicePromise: Promise<IResult>, headersToSet?: HeaderType): Promise<void> {
    try {
      return await this.getResult(res, await servicePromise, headersToSet);
    } catch (error) {
      return next(error);
    }
  }

  // <===========+ Helper Methods +============> //

  private async getResultData(res: IResponse, result: IResult, headersToSet?: HeaderType): Promise<void> {
    this.setHeaders(res, headersToSet);

    res.status(Number(result.statusCode)).json(result.message ? result.toResultDto() : result.toResultDto().data);
  }

  private setHeaders(res: IResponse, headersToSet?: HeaderType): void {
    if (headersToSet) {
      Object.entries(headersToSet).forEach(([key, value]) => res.setHeader(key, value));
    }
  }

  private async getResult(res: IResponse, result: IResult, headersToSet?: HeaderType): Promise<void> {
    this.setHeaders(res, headersToSet);
    res.status(Number(result.statusCode)).json(result);
  }
}
