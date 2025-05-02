import { WinstonDriver } from "./WinstonDriver";
import { LoggingProvider } from "./LoggingProvider";
import AppSettings from "~/helpers/settings/AppSettings";
import { PROVIDER_NOT_FOUND } from "~/helpers/messsges/SystemMessages";

export class LoggingProviderFactory {
  public static build() {
    if (this.getLoggingProvider() === "winston") {
      return new LoggingProvider(new WinstonDriver());
    } else {
      throw new Error(PROVIDER_NOT_FOUND);
    }
  }

  public static getLoggingProvider() {
    return AppSettings.LoggingProvider;
  }
}
