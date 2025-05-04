import ServerConfig from "~/config/ServerConfig";
import LoggingConfig from "~/config/LoggingConfig";
import BusinessConfig from "~/config/BusinessConfig";
class AppSettings {
  Origins: string;
  ServerRoot: string;
  ServerPort: number;
  ServerHost: string;
  ServiceName: string;
  UrlBasePath: string;
  LoggingProvider: string;
  UrlExpiryMinutes: number;
  UrlShortenerLength: number;
  DefaultHealthRemoteService: string;

  constructor(serverConfig: Record<string, any>, loggingConfig: Record<string, any>, businessConfig: Record<string, any>) {
    this.ServerPort = serverConfig.Server.Port;
    this.ServerHost = serverConfig.Server.Host;
    this.ServerRoot = serverConfig.Server.Root;
    this.Origins = serverConfig.Server.Origins;
    this.UrlBasePath = businessConfig.URL_BASE_PATH;
    this.ServiceName = serverConfig.Server.ServiceName;
    this.LoggingProvider = loggingConfig.LOGGING_PROVIDER;
    this.UrlExpiryMinutes = businessConfig.URL_EXPIRTY_MINUTES;
    this.UrlShortenerLength = businessConfig.URL_SHORTENER_LENGTH;
    this.DefaultHealthRemoteService = serverConfig.Params.DefaultHealthRemoteService.Context;
  }

  getServerUrl(): string {
    return `http://${this.ServerHost}:${this.ServerPort}${this.ServerRoot}`;
  }
}

export default new AppSettings(ServerConfig, LoggingConfig, BusinessConfig);
