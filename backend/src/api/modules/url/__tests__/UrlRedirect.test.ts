import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import AppSettings from "~/helpers/settings/AppSettings";
import UrlProvider from "~/api/modules/url/providers/Url.provider";
import { Application } from "~/infrastructure/internal/application";
import { HttpStatusCodeEnum } from "~/helpers/enums/HttpStatusCodeEnums";
import { ERROR, URL_NOT_FOUND, URL_EXPIRED } from "~/helpers/messsges/SystemMessages";

describe("URL Redirect Integration Tests", () => {
  let server: Server;
  let app: Application;
  let urlProvider: UrlProvider;
  let savedUrl: string;
  let savedShortPath: string;

  beforeEach(async () => {
    container.clearInstances();
    app = new Application();
    server = app.server.listen();
    await app.express.initializeServices();
    urlProvider = container.resolve(UrlProvider);

    // Create a URL first that we can redirect to
    savedUrl = "https://www.example.com/very/long/url/path";
    const createResponse = await request(server).post("/api/encode").send({ url: savedUrl });
    savedShortPath = createResponse.body.data.data.shortUrl.replace(AppSettings.UrlBasePath, "");
  });

  describe("GET /:path", () => {
    it("should redirect to the original URL and update visit count", async () => {
      const response = await request(server).get(`/${savedShortPath}`);

      expect(response.status).toBe(HttpStatusCodeEnum.REDIRECT);
      expect(response.header.location).toBe(savedUrl);

      // Verify visit count was incremented
      const urlEntry = await urlProvider.getByShortPath(savedShortPath);
      expect(urlEntry?.visitCount).toBe(1);
      expect(urlEntry?.lastVisitedAt).toBeTruthy();
    });

    it("should handle multiple visits correctly", async () => {
      // Reset visit count for this test
      const initialEntry = await urlProvider.getByShortPath(savedShortPath);
      if (initialEntry) {
        initialEntry.visitCount = 0;
        await urlProvider.save(savedShortPath, initialEntry);
      }

      // Visit the URL multiple times
      await request(server).get(`/${savedShortPath}`);
      await request(server).get(`/${savedShortPath}`);
      const response = await request(server).get(`/${savedShortPath}`);

      expect(response.status).toBe(HttpStatusCodeEnum.REDIRECT);
      expect(response.header.location).toBe(savedUrl);

      // Verify visit count was incremented correctly
      const urlEntry = await urlProvider.getByShortPath(savedShortPath);
      expect(urlEntry?.visitCount).toBe(3);
    });

    it("should return error for non-existent path", async () => {
      const nonExistentPath = "nonexi";
      const response = await request(server).get(`/${nonExistentPath}`);

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

    it("should return error for non-valid path", async () => {
      const nonValidPath = "toolongpath";
      const response = await request(server).get(`/${nonValidPath}`);

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

      const response = await request(server).get(`/${expiredPath}`);

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
      const updatedEntry = await urlProvider.getByShortPath(expiredPath);
      expect(updatedEntry?.isActive).toBe(false);
      expect(updatedEntry?.visitCount).toBe(0); // Visit count should not increment for expired URLs
    });
  });
});
