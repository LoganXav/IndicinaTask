import request from "supertest";
import { Server } from "http";
import { container } from "tsyringe";
import AppSettings from "~/helpers/settings/AppSettings";
import UrlProvider from "~/api/modules/url/providers/Url.provider";
import { Application } from "~/infrastructure/internal/application";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { SUCCESS, URL_DECODED_SUCCESSFULLY, ERROR, URL_NOT_FOUND } from "~/helpers/messsges/SystemMessages";

describe("URL Decoder Integration Tests", () => {
  let server: Server;
  let app: Application;
  let urlProvider: UrlProvider;
  let savedUrl: string;
  let savedShortUrl: string;

  beforeEach(async () => {
    container.clearInstances();
    app = new Application();
    server = app.server.listen();
    await app.express.initializeServices();
    urlProvider = container.resolve(UrlProvider);

    // Create a URL first that we can decode
    const url = "https://www.example.com/very/long/url/path";
    const createResponse = await request(server).post("/api/encode").send({ url });
    savedUrl = url;
    savedShortUrl = createResponse.body.result.shortUrl;
  });

  describe("POST /api/decode", () => {
    it("should decode a short URL back to the original URL", async () => {
      const response = await request(server).post("/api/decode").send({ shortUrl: savedShortUrl });

      expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response.body).toMatchObject({
        status: SUCCESS,
        statusCode: HttpStatusCodeEnum.SUCCESS,
        message: URL_DECODED_SUCCESSFULLY,
        result: {
          url: savedUrl,
          shortUrl: savedShortUrl,
          visitCount: expect.any(Number),
          id: expect.any(Number),
          createdAt: expect.any(String),
        },
      });
    });

    it("should return error for non-existent short URL", async () => {
      const nonExistentShortUrl = `${AppSettings.UrlBasePath}nonexist`;

      const response = await request(server).post("/api/decode").send({ shortUrl: nonExistentShortUrl });

      expect(response.status).toBe(HttpStatusCodeEnum.BAD_REQUEST);
      expect(response.body).toMatchObject({
        status: ERROR,
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: URL_NOT_FOUND,
        result: null,
      });
    });

    it("should validate the input short URL format", async () => {
      const invalidShortUrl = "not-a-valid-short-url";

      const response = await request(server).post("/api/decode").send({ shortUrl: invalidShortUrl });

      expect(response.status).toBe(HttpStatusCodeEnum.BAD_REQUEST);
      expect(response.body).toMatchObject({
        status: ERROR,
        details: [
          {
            message: expect.any(String),
          },
        ],
      });
    });
  });
});
