import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import AppSettings from "~/helpers/settings/AppSettings";
import UrlProvider from "~/api/modules/url/providers/Url.provider";
import { Application } from "~/infrastructure/internal/application";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { SUCCESS, URL_DECODED_SUCCESSFULLY, ERROR, URL_NOT_FOUND, URL_EXPIRED } from "~/helpers/messsges/SystemMessages";

describe("URL Decoder Integration Tests", () => {
  let server: Server;
  let app: Application;
  let savedUrl: string;
  let savedShortUrl: string;
  let urlProvider: UrlProvider;

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
    savedShortUrl = createResponse.body.data.data.shortUrl;
  });

  describe("POST /api/decode", () => {
    it("should decode a short URL back to the original URL", async () => {
      const response = await request(server).post("/api/decode").send({ shortUrl: savedShortUrl });

      expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
      expect(response.body).toMatchObject({
        status: SUCCESS,
        statusCode: HttpStatusCodeEnum.SUCCESS,
        data: {
          message: URL_DECODED_SUCCESSFULLY,
          data: {
            url: savedUrl,
            shortUrl: savedShortUrl,
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

    it("should return error for expired URL", async () => {
      // Create a URL with immediate expiry
      const url = "https://www.example.com/expired/url";
      const createResponse = await request(server).post("/api/encode").send({ url });
      const expiredShortUrl = createResponse.body.data.data.shortUrl;

      // Modify the URL entry to set it as expired
      const shortPath = expiredShortUrl.replace(AppSettings.UrlBasePath, "");
      const urlEntry = await urlProvider.getByShortPath(shortPath);

      if (urlEntry) {
        urlEntry.expiresAt = new Date(Date.now() - 1000); // Set expiry to 1 second ago
        await urlProvider.save(shortPath, urlEntry);
      }

      // Try to decode the expired URL
      const response = await request(server).post("/api/decode").send({ shortUrl: expiredShortUrl });

      expect(response.status).toBe(HttpStatusCodeEnum.BAD_REQUEST);
      expect(response.body).toMatchObject({
        status: ERROR,
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        data: {
          message: URL_EXPIRED,
          data: null,
        },
      });

      // Verify the URL is marked as inactive
      const updatedEntry = await urlProvider.getByShortPath(shortPath);
      expect(updatedEntry?.isActive).toBe(false);
    });

    it("should return error for non-existent short URL", async () => {
      const nonExistentShortUrl = `${AppSettings.UrlBasePath}nonexist`;

      const response = await request(server).post("/api/decode").send({ shortUrl: nonExistentShortUrl });

      expect(response.status).toBe(HttpStatusCodeEnum.NOT_FOUND);
      expect(response.body).toMatchObject({
        status: ERROR,
        statusCode: HttpStatusCodeEnum.NOT_FOUND,
        data: {
          message: URL_NOT_FOUND,
          data: null,
        },
      });
    });

    it("should validate the input short URL format", async () => {
      const invalidShortUrl = "not-a-valid-short-url";

      const response = await request(server).post("/api/decode").send({ shortUrl: invalidShortUrl });

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
  });
});
