import Express from "../index";
import { resolve } from "path";
import { NextFunction, Router } from "express";
import { container } from "tsyringe";
import { sync } from "fast-glob";
import ServerConfig from "~/config/ServerConfig";
import AppSettings from "~/helpers/settings/AppSettings";

jest.mock("fast-glob", () => ({
  sync: jest.fn(),
}));

jest.mock("tsyringe", () => ({
  container: {
    resolve: jest.fn(),
  },
}));

jest.mock("path", () => ({
  ...jest.requireActual("path"),
  resolve: jest.fn(),
}));

describe("Load Controllers Dynamically", () => {
  let app: Express;

  beforeAll(() => {
    app = new Express();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    ServerConfig.Controllers.DefaultPath = ["~/api/modules/ping/controllers/*.controller.ts"];
    AppSettings.ServerRoot = "/api";
  });

  it("Should load controllers dynamically and initialize routes", async () => {
    const mockControllerPaths = ["~/api/modules/ping/controllers/PingHealth.controller.ts"];
    (sync as jest.Mock).mockReturnValue(mockControllerPaths);

    (resolve as jest.Mock).mockImplementation((path) => path);

    const mockController = {
      initializeRoutes: jest.fn(),
      router: Router(),
      setApiDocGenerator: jest.fn(),
      controllerName: "MockController",
    };

    const appUseSpy = jest.spyOn(app.app, "use");

    jest.mock("~/api/modules/ping/controllers/PingHealth.controller", () => ({
      default: jest.fn(() => mockController),
    }));

    (container.resolve as jest.Mock).mockReturnValue(mockController);

    // Access the private method using TypeScript's index signature
    await (app as any).loadControllersDynamically();

    expect(mockController.initializeRoutes).toHaveBeenCalledWith(expect.any(Function));
    expect(appUseSpy).toHaveBeenCalledWith(AppSettings.ServerRoot, expect.any(Function));

    appUseSpy.mockRestore();
  });
});
