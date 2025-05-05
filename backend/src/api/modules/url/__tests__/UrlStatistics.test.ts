import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import AppSettings from "~/helpers/settings/AppSettings";
import UrlProvider from "~/api/modules/url/providers/Url.provider";
import { Application } from "~/infrastructure/internal/application";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { SUCCESS, ERROR, URL_PATH_NOT_FOUND, URL_STATISTIC_FETCHED_SUCCESSFULLY } from "~/helpers/messsges/SystemMessages";

describe("URL Statistics Integration Tests", () => {
  let server: Server;
  let app: Application;
  let urlProvider: UrlProvider;
  let savedShortPath: string;

  beforeEach(async () => {
    container.clearInstances();
    app = new Application();
    server = app.server.listen();
    await app.express.initializeServices();
    urlProvider = container.resolve(UrlProvider);

    // Create a URL first that we can get statistics for
    const url = "https://www.example.com/very/long/url/path";
    const createResponse = await request(server).post("/api/encode").send({ url });
    savedShortPath = createResponse.body.data.data.shortUrl.replace(AppSettings.UrlBasePath, "");
  });

  describe("GET /api/statistic/:path", () => {
    it("should return statistics for a valid short URL path", async () => {
      const response = await request(server).get(`/api/statistic/${savedShortPath}`);

      expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response.body).toMatchObject({
        status: SUCCESS,
        statusCode: HttpStatusCodeEnum.SUCCESS,
        data: {
          message: URL_STATISTIC_FETCHED_SUCCESSFULLY,
          data: {
            visitCount: expect.any(Number),
            id: expect.any(Number),
            createdAt: expect.any(String),
            expiresAt: expect.any(String),
            isActive: true,
            lastVisitedAt: null,
          },
        },
      });
    });

    it("should return error for non-existent path", async () => {
      const nonExistentPath = "nonexi";
      const response = await request(server).get(`/api/statistic/${nonExistentPath}`);

      expect(response.status).toBe(HttpStatusCodeEnum.NOT_FOUND);
      expect(response.body).toMatchObject({
        status: ERROR,
        statusCode: HttpStatusCodeEnum.NOT_FOUND,
        data: {
          message: URL_PATH_NOT_FOUND,
          data: null,
        },
      });
    });

    it("should return error for non-valid path", async () => {
      const nonValidPath = "toolongpath";
      const response = await request(server).get(`/api/statistic/${nonValidPath}`);

      expect(response.status).toBe(HttpStatusCodeEnum.BAD_REQUEST);
      expect(response.body).toMatchObject({
        status: ERROR,
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        details: [
          {
            message: expect.any(String),
          },
        ],
      });
    });

    it("should handle expired URLs correctly", async () => {
      // Create a URL with immediate expiry
      const url = "https://www.example.com/expired/url";
      const createResponse = await request(server).post("/api/encode").send({ url });
      const expiredPath = createResponse.body.data.data.shortUrl.replace(AppSettings.UrlBasePath, "");

      // Modify the URL entry to set it as expired
      const urlEntry = await urlProvider.getByShortPath(expiredPath);
      if (urlEntry) {
        urlEntry.expiresAt = new Date(Date.now() - 1000); // Set expiry to 1 second ago
        await urlProvider.save(expiredPath, urlEntry);
      }

      const response = await request(server).get(`/api/statistic/${expiredPath}`);

      expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response.body).toMatchObject({
        status: SUCCESS,
        statusCode: HttpStatusCodeEnum.SUCCESS,
        data: {
          message: URL_STATISTIC_FETCHED_SUCCESSFULLY,
          data: {
            isActive: false,
            visitCount: expect.any(Number),
          },
        },
      });

      // Verify the URL is marked as inactive
      const updatedEntry = await urlProvider.getByShortPath(expiredPath);
      expect(updatedEntry?.isActive).toBe(false);
    });
  });
});
