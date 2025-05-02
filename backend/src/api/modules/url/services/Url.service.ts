import { autoInjectable } from "tsyringe";
import { StringUtils } from "~/utils/StringUtils";
import { IResult } from "~/api/shared/result/IResult";
import AppSettings from "~/helpers/settings/AppSettings";
import UrlProvider from "~/api/modules/url/providers/Url.provider";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { UrlEncodeRequestType } from "~/api/modules/url/validators/Url.schema";
import { SUCCESS, URL_ENCODED_SUCCESSFULLY } from "~/helpers/messsges/SystemMessages";
@autoInjectable()
export default class UrlService extends BaseService<UrlEncodeRequestType> {
  static serviceName = "UrlService";
  urlProvider: UrlProvider;

  constructor(urlProvider: UrlProvider) {
    super(UrlService.serviceName);
    this.urlProvider = urlProvider;
  }

  public async execute(args: UrlEncodeRequestType): Promise<IResult> {
    const { url } = args;

    let urlEntry = await this.urlProvider.getByUrl(url);

    if (!urlEntry) {
      const id = await this.urlProvider.getNextId();
      const shortPath = StringUtils.generateShortPath();

      urlEntry = {
        id,
        url,
        shortUrl: `${AppSettings.UrlBasePath}${shortPath}`,
        createdAt: new Date(),
        visitCount: 0,
      };

      await this.urlProvider.save(shortPath, urlEntry);
    }

    this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, URL_ENCODED_SUCCESSFULLY, urlEntry);
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
