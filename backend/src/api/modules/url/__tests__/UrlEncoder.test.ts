import request from "supertest";
import { Server } from "http";
import { container } from "tsyringe";
import AppSettings from "~/helpers/settings/AppSettings";
import UrlProvider from "~/api/modules/url/providers/Url.provider";
import { Application } from "~/infrastructure/internal/application";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { SUCCESS, URL_ENCODED_SUCCESSFULLY, ERROR } from "~/helpers/messsges/SystemMessages";

describe("URL Encoder Integration Tests", () => {
  let server: Server;
  let app: Application;
  let urlProvider: UrlProvider;

  beforeEach(async () => {
    container.clearInstances();
    app = new Application();
    server = app.server.listen();
    await app.express.initializeServices();
    urlProvider = container.resolve(UrlProvider);
  });

  describe("POST /api/encode", () => {
    it("should encode a long URL to a short URL", async () => {
      const url = "https://www.example.com/very/long/url/path";

      const response = await request(server).post("/api/encode").send({ url: url });

      expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response.body).toMatchObject({
        status: SUCCESS,
        statusCode: HttpStatusCodeEnum.SUCCESS,
        data: {
          message: URL_ENCODED_SUCCESSFULLY,
          data: {
            url,
            shortUrl: expect.stringMatching(new RegExp(`^${AppSettings.UrlBasePath}.{${AppSettings.UrlShortenerLength}}$`)),
            visitCount: expect.any(Number),
            id: expect.any(Number),
            createdAt: expect.any(String),
          },
        },
      });
    });

    it("should return the same short URL for duplicate long URLs", async () => {
      const url = "https://www.example.com/duplicate/test";

      // First request
      const response1 = await request(server).post("/api/encode").send({ url });

      expect(response1.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response1.body).toMatchObject({
        status: SUCCESS,
        statusCode: HttpStatusCodeEnum.SUCCESS,
        data: {
          message: URL_ENCODED_SUCCESSFULLY,
          data: {
            url,
            shortUrl: expect.stringMatching(new RegExp(`^${AppSettings.UrlBasePath}.{${AppSettings.UrlShortenerLength}}$`)),
            visitCount: expect.any(Number),
            id: expect.any(Number),
            createdAt: expect.any(String),
          },
        },
      });

      // Second request with same URL
      const response2 = await request(server).post("/api/encode").send({ url });

      expect(response2.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response2.body).toMatchObject({
        status: SUCCESS,
        statusCode: HttpStatusCodeEnum.SUCCESS,
        data: {
          message: URL_ENCODED_SUCCESSFULLY,
          data: {
            url,
            shortUrl: response1.body.data.data.shortUrl,
            visitCount: expect.any(Number),
            id: expect.any(Number),
            createdAt: expect.any(String),
          },
        },
      });
    });

    it("should validate the input URL", async () => {
      const invalidUrl = "not-a-url";

      const response = await request(server).post("/api/encode").send({ url: invalidUrl });

      expect(response.status).toBe(HttpStatusCodeEnum.BAD_REQUEST);
      expect(response.body).toMatchObject({
        status: ERROR,
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        details: expect.any(Array),
      });
    });

    it("should not allow shortening an already shortened URL", async () => {
      // First create a shortened URL
      const originalUrl = "https://www.example.com/very/long/url/path";
      const firstResponse = await request(server).post("/api/encode").send({ url: originalUrl });
      const shortUrl = firstResponse.body.data.data.shortUrl;

      // Try to shorten the shortened URL
      const response = await request(server).post("/api/encode").send({ url: shortUrl });

      expect(response.status).toBe(HttpStatusCodeEnum.BAD_REQUEST);
      expect(response.body).toMatchObject({
        status: ERROR,
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        details: [
          {
            message: "Cannot shorten an already shortened URL",
          },
        ],
      });
    });
  });
});
