import { autoInjectable } from "tsyringe";
import { IResult } from "~/api/shared/result/IResult";
import AppSettings from "~/helpers/settings/AppSettings";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import PingHealthProvider from "~/api/modules/ping/providers/PingHealth.provider";

@autoInjectable()
export default class PingHealthService extends BaseService<undefined> {
  static serviceName = "PingHealthService";
  pingHealthProvider: PingHealthProvider;
  constructor(pingHealthProvider: PingHealthProvider) {
    super(PingHealthService.serviceName);
    this.pingHealthProvider = pingHealthProvider;
  }
  public async execute(): Promise<IResult> {
    const message = await this.pingHealthProvider.get(AppSettings.ServiceName, new Date().toISOString());
    this.result.setMessage(message, HttpStatusCodeEnum.SUCCESS);
    return this.result;
  }
}
