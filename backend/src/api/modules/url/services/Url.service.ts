import { autoInjectable } from "tsyringe";
import { IResult } from "~/api/shared/result/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";

@autoInjectable()
export default class UrlService extends BaseService<undefined> {
  static serviceName = "UrlService";
  //   urlProvider: UrlProvider;
  constructor() {
    super(UrlService.serviceName);
    //   this.urlProvider = urlProvider;
  }
  public async execute(): Promise<IResult> {
    this.result.setMessage("UrlService", HttpStatusCodeEnum.SUCCESS);
    return this.result;
  }

  public async encode(): Promise<IResult> {
    this.result.setMessage("UrlService", HttpStatusCodeEnum.SUCCESS);
    return this.result;
  }

  public async decode(): Promise<IResult> {
    this.result.setMessage("UrlService", HttpStatusCodeEnum.SUCCESS);
    return this.result;
  }

  public async statistic(): Promise<IResult> {
    this.result.setMessage("UrlService", HttpStatusCodeEnum.SUCCESS);
    return this.result;
  }

  public async list(): Promise<IResult> {
    this.result.setMessage("UrlService", HttpStatusCodeEnum.SUCCESS);
    return this.result;
  }

  public async redirect(): Promise<IResult> {
    this.result.setMessage("UrlService", HttpStatusCodeEnum.SUCCESS);
    return this.result;
  }
}
