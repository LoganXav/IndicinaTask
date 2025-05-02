export interface ILoggingDriver {
  info(msg: string): void;
  success(msg: string): void;
  warning(msg: string): void;
  error(msg: string): void;
}
