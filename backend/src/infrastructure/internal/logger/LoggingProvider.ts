import { ILoggingDriver } from "./ILoggingDriver";

export class LoggingProvider {
  constructor(private driver: ILoggingDriver) {}

  public info(str: string) {
    return this.driver.info(str);
  }

  public success(str: string) {
    return this.driver.success(str);
  }

  public warning(str: string) {
    return this.driver.warning(str);
  }

  public error(err: string) {
    return this.driver.error(err);
  }
}
