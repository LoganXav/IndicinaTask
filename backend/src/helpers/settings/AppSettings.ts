import ServerConfig from "~/config/ServerConfig";
import LoggingConfig from "~/config/LoggingConfig";

class AppSettings {
  ServerRoot: string;
  ServerPort: number;
  ServerHost: string;
  Origins: string;
  ServiceName: string;
  DefaultHealthRemoteService: string;
  LoggingProvider: string;

  constructor(serverConfig: Record<string, any>, loggingConfig: Record<string, any>) {
    this.ServerPort = serverConfig.Server.Port;
    this.ServerHost = serverConfig.Server.Host;
    this.ServerRoot = serverConfig.Server.Root;
    this.Origins = serverConfig.Server.Origins;
    this.ServiceName = serverConfig.Server.ServiceName;
    this.DefaultHealthRemoteService = serverConfig.Params.DefaultHealthRemoteService.Context;
    this.LoggingProvider = loggingConfig.LOGGING_PROVIDER;
  }

  getServerUrl(): string {
    return `http://${this.ServerHost}:${this.ServerPort}${this.ServerRoot}`;
  }
}

export default new AppSettings(ServerConfig, LoggingConfig);
