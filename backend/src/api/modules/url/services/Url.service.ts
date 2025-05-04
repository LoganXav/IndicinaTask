import { autoInjectable } from "tsyringe";
import { StringUtils } from "~/utils/StringUtils";
import { IResult } from "~/api/shared/result/IResult";
import AppSettings from "~/helpers/settings/AppSettings";
import UrlProvider from "~/api/modules/url/providers/Url.provider";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { UrlDecodeRequestType, UrlEncodeRequestType, UrlRedirectRequestType, UrlStatisticRequestType } from "~/api/modules/url/validators/Url.schema";
import { ERROR, SUCCESS, URL_DECODED_SUCCESSFULLY, URL_ENCODED_SUCCESSFULLY, URL_EXPIRED, URL_LIST_FETCHED_SUCCESSFULLY, URL_NOT_FOUND, URL_PATH_NOT_FOUND, URL_REDIRECTED_SUCCESSFULLY, URL_STATISTIC_FETCHED_SUCCESSFULLY } from "~/helpers/messsges/SystemMessages";
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
        expiresAt: new Date(Date.now() + AppSettings.UrlExpiryMinutes * 60 * 1000),
        visitCount: 0,
        isActive: true,
        lastVisitedAt: null,
      };

      await this.urlProvider.save(shortPath, urlEntry);
    } else {
      // Update existing URL entry
      const shortPath = urlEntry.shortUrl.replace(AppSettings.UrlBasePath, "");
      urlEntry.isActive = true;
      urlEntry.expiresAt = new Date(Date.now() + AppSettings.UrlExpiryMinutes * 60 * 1000);
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

      const now = new Date();
      if (urlEntry.expiresAt && now > new Date(urlEntry.expiresAt)) {
        // Get the path from the shortUrl to use for saving
        const shortPath = urlEntry.shortUrl.replace(AppSettings.UrlBasePath, "");

        urlEntry.isActive = false;
        await this.urlProvider.save(shortPath, urlEntry);

        throw new BadRequestError(URL_EXPIRED);
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

      const now = new Date();
      if (urlEntry.expiresAt && now > new Date(urlEntry.expiresAt)) {
        // Get the path from the shortUrl to use for saving
        const shortPath = urlEntry.shortUrl.replace(AppSettings.UrlBasePath, "");

        urlEntry.isActive = false;
        await this.urlProvider.save(shortPath, urlEntry);
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

    // Check each entry for expiration and update if needed
    const now = new Date();
    const updatedEntries = await Promise.all(
      urlEntries.map(async (entry) => {
        if (entry.expiresAt && now > new Date(entry.expiresAt) && entry.isActive) {
          const shortPath = entry.shortUrl.replace(AppSettings.UrlBasePath, "");

          entry.isActive = false;
          await this.urlProvider.save(shortPath, entry);
        }
        return entry;
      })
    );

    this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, URL_LIST_FETCHED_SUCCESSFULLY, updatedEntries);
    return this.result;
  }

  public async redirect(args: UrlRedirectRequestType): Promise<IResult> {
    try {
      const { path } = args;
      const urlEntry = await this.urlProvider.getByShortPath(path);

      if (!urlEntry) {
        throw new NotFoundError(URL_NOT_FOUND);
      }

      // Check if URL has expired
      const now = new Date();
      if (urlEntry.expiresAt && now > new Date(urlEntry.expiresAt)) {
        // Update the URL to inactive status
        urlEntry.isActive = false;
        await this.urlProvider.save(path, urlEntry);

        throw new BadRequestError(URL_EXPIRED);
      }

      urlEntry.lastVisitedAt = now;

      urlEntry.visitCount++;

      await this.urlProvider.save(path, urlEntry);

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
