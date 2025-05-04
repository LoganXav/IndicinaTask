import { autoInjectable } from "tsyringe";
import { StringUtils } from "~/utils/StringUtils";
import { IResult } from "~/api/shared/result/IResult";
import AppSettings from "~/helpers/settings/AppSettings";
import UrlProvider from "~/api/modules/url/providers/Url.provider";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { UrlDecodeRequestType, UrlEncodeRequestType, UrlRedirectRequestType, UrlStatisticRequestType } from "~/api/modules/url/validators/Url.schema";
import { ERROR, SUCCESS, URL_DECODED_SUCCESSFULLY, URL_ENCODED_SUCCESSFULLY, URL_LIST_FETCHED_SUCCESSFULLY, URL_NOT_FOUND, URL_PATH_NOT_FOUND, URL_REDIRECTED_SUCCESSFULLY, URL_STATISTIC_FETCHED_SUCCESSFULLY } from "~/helpers/messsges/SystemMessages";
@autoInjectable()
export default class UrlService extends BaseService<UrlEncodeRequestType> {
  static serviceName = "UrlService";
  urlProvider: UrlProvider;
  loggingProvider: ILoggingDriver;

  constructor(urlProvider: UrlProvider) {
    super(UrlService.serviceName);
    this.urlProvider = urlProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(args: UrlEncodeRequestType): Promise<IResult> {
    const { url } = args;
    let urlEntry = await this.urlProvider.getByUrl(url);

    if (!urlEntry) {
      const id = await this.urlProvider.getNextId();
      const shortPath = StringUtils.generateShortPath(AppSettings.UrlShortenerLength);

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

  public async decode(args: UrlDecodeRequestType): Promise<IResult> {
    try {
      const { shortUrl } = args;
      const urlEntry = await this.urlProvider.getByShortUrl(shortUrl);

      if (!urlEntry) {
        throw new NotFoundError(URL_NOT_FOUND);
      }

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, URL_DECODED_SUCCESSFULLY, urlEntry);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async statistic(args: UrlStatisticRequestType): Promise<IResult> {
    try {
      const { path } = args;
      const urlEntry = await this.urlProvider.getByShortPath(path);

      if (!urlEntry) {
        throw new NotFoundError(URL_PATH_NOT_FOUND);
      }

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, URL_STATISTIC_FETCHED_SUCCESSFULLY, urlEntry);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async list(): Promise<IResult> {
    const urlEntries = await this.urlProvider.getAll();
    this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, URL_LIST_FETCHED_SUCCESSFULLY, urlEntries);
    return this.result;
  }

  public async redirect(args: UrlRedirectRequestType): Promise<IResult> {
    try {
      const { path } = args;
      const urlEntry = await this.urlProvider.getByShortPath(path);

      if (!urlEntry) {
        throw new NotFoundError(URL_NOT_FOUND);
      }

      await this.urlProvider.updateVisitCount(path, urlEntry);

      const redirectUrl = urlEntry.url;
      this.result.setData(SUCCESS, HttpStatusCodeEnum.REDIRECT, URL_REDIRECTED_SUCCESSFULLY, {}, redirectUrl);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
