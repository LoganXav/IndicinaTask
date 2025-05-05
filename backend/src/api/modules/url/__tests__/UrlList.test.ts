import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import AppSettings from "~/helpers/settings/AppSettings";
import UrlProvider from "~/api/modules/url/providers/Url.provider";
import { Application } from "~/infrastructure/internal/application";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { SUCCESS, URL_LIST_FETCHED_SUCCESSFULLY } from "~/helpers/messsges/SystemMessages";

describe("URL List Integration Tests", () => {
  let server: Server;
  let app: Application;
  let urlProvider: UrlProvider;
  let savedUrls: Array<{ url: string; shortPath: string }> = [];

  beforeEach(async () => {
    container.clearInstances();
    app = new Application();
    server = app.server.listen();
    await app.express.initializeServices();
    urlProvider = container.resolve(UrlProvider);

    // Create multiple URLs for testing
    const urls = ["https://www.example.com/first/path", "https://www.example.com/second/path", "https://www.example.com/third/path"];

    savedUrls = [];
    for (const url of urls) {
      const createResponse = await request(server).post("/api/encode").send({ url });
      savedUrls.push({
        url,
        shortPath: createResponse.body.data.data.shortUrl.replace(AppSettings.UrlBasePath, ""),
      });
    }
  });

  describe("GET /api/list", () => {
    it("should return a list of all URLs", async () => {
      const response = await request(server).get("/api/list");

      expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response.body).toMatchObject({
        status: SUCCESS,
        statusCode: HttpStatusCodeEnum.SUCCESS,
        data: {
          message: URL_LIST_FETCHED_SUCCESSFULLY,
          data: expect.arrayContaining(
            savedUrls.map((saved) =>
              expect.objectContaining({
                url: saved.url,
                shortUrl: `${AppSettings.UrlBasePath}${saved.shortPath}`,
                visitCount: expect.any(Number),
                id: expect.any(Number),
                createdAt: expect.any(String),
                expiresAt: expect.any(String),
                isActive: true,
                lastVisitedAt: null,
              })
            )
          ),
        },
      });
    });

    it("should mark expired URLs as inactive in the list", async () => {
      // Create a URL with immediate expiry
      const expiredUrl = "https://www.example.com/expired/url";
      const createResponse = await request(server).post("/api/encode").send({ url: expiredUrl });
      const expiredPath = createResponse.body.data.data.shortUrl.replace(AppSettings.UrlBasePath, "");

      // Modify the URL entry to set it as expired
      const urlEntry = await urlProvider.getByShortPath(expiredPath);
      if (urlEntry) {
        urlEntry.expiresAt = new Date(Date.now() - 1000); // Set expiry to 1 second ago
        await urlProvider.save(expiredPath, urlEntry);
      }

      const response = await request(server).get("/api/list");

      expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response.body.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: expiredUrl,
            shortUrl: `${AppSettings.UrlBasePath}${expiredPath}`,
            isActive: false,
          }),
        ])
      );
    });

    it("should handle URLs with visit counts", async () => {
      // Visit one of the URLs multiple times
      const urlToVisit = savedUrls[0];
      await request(server).get(`/${urlToVisit.shortPath}`);
      await request(server).get(`/${urlToVisit.shortPath}`);

      const response = await request(server).get("/api/list");

      expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response.body.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: urlToVisit.url,
            shortUrl: `${AppSettings.UrlBasePath}${urlToVisit.shortPath}`,
            visitCount: 2,
            lastVisitedAt: expect.any(String),
          }),
        ])
      );
    });

    it("should return an empty list when no URLs exist", async () => {
      // Clear all URLs
      const urls = await urlProvider.getAll();
      for (const url of urls) {
        const shortPath = url.shortUrl.replace(AppSettings.UrlBasePath, "");
        await urlProvider.delete(shortPath);
      }

      const response = await request(server).get("/api/list");

      expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response.body).toMatchObject({
        status: SUCCESS,
        statusCode: HttpStatusCodeEnum.SUCCESS,
        data: {
          message: URL_LIST_FETCHED_SUCCESSFULLY,
          data: [],
        },
      });
    });
  });
});
