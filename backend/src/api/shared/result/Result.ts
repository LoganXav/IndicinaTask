import { IResult, Metadata, ResultDto } from "~/api/shared/result/IResult";

export class Result implements IResult {
  public statusCode: number | string;
  public success: boolean;
  public message: string;
  public status: string;
  public url?: string;
  public error: string;
  public result: unknown;
  public data: { message: string; data: unknown };
  private metadata: Metadata = {};

  setStatusCode(statusCode: number | string, success: boolean): void {
    this.statusCode = statusCode;
    this.success = success;
  }
  setData(status: string, statusCode: number | string, message: string, result: unknown, url?: string): void {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.result = result;
    this.url = url;
  }
  setMessage(message: string, statusCode: number | string): void {
    this.message = message;
    this.statusCode = statusCode;
  }
  setError(status: string, statusCode: number | string, message: string): void {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.result = null;
  }
  hasError(): boolean {
    return !!this.error;
  }
  hasMessage(): boolean {
    return !!this.message;
  }
  toResultDto(): ResultDto {
    return {
      status: this.status,
      statusCode: this.statusCode,
      data: {
        message: this.message,
        data: this.result,
      },
    };
  }
  setMetadata(headers: Metadata): void {
    this.metadata = headers;
  }
  addMetadata(key: string, value: string | number): void {
    this.metadata[key] = value;
  }
  getMetadata(): Metadata {
    return this.metadata;
  }

  hasMetadata(): boolean {
    return Object.keys(this.metadata).length > 0;
  }

  clear(): void {
    this.statusCode = 0;
    this.success = false;
    this.message = "";
    this.status = "";
    this.url = undefined;
    this.result = null;
    this.data = { message: "", data: null };
    this.metadata = {};
    this.error = "";
  }
}
