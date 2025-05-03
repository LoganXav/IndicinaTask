import { Request, Response, NextFunction } from "express";
import { HttpHeaderEnums } from "~/helpers/enums/HttpHeaderEnums";
import { LocaleTypeEnums } from "~/helpers/enums/LocaleTypeEnums";
import { HttpMethodEnums } from "~/helpers/enums/HttpMethodEnums";
import { HttpContentTypeEnums } from "~/helpers/enums/HttpContentTypeEnums";

export type HeaderType = {
  [key in HttpHeaderEnums]?: HttpContentTypeEnums | string;
};

export type EntryPointHandler = (req: IRequest, res: IResponse, next: INextFunction) => Promise<void>;

export interface IResponse {
  status(code: number): IResponse;
  send(body: unknown): IResponse;
  json(body: unknown): IResponse;
  setHeader(name: string, value: number | string): this;
  redirect(url: string): IResponse;
}

export interface IRequest {
  isWhiteList: boolean;
  isProtected: boolean;
  session: ISession;
  body: any;
  params: any;
  query: any;
  locale: LocaleTypeEnums;
  ipAddress: string;
  userAgent: string;
  origin: string;
}

export interface INextFunction {
  (error?: unknown): void;
}

export interface ISession {
  sessionId: string;
  maskedUserUid: string;
  email: string;
  emailVerified: boolean;
  name: string;
  iat: number;
  exp: number;
}

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export interface IRouter {
  (): IRouter;
  [HttpMethodEnums.GET](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnums.POST](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnums.PUT](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnums.DELETE](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnums.PATCH](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnums.OPTIONS](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnums.HEAD](path: string, ...handlers: EntryPointHandler[]): IRouter;
}

export type RouteType = {
  method: HttpMethodEnums;
  path: string;
  handlers: EntryPointHandler[];
  description?: string;
};
