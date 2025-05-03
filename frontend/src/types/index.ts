export type UrlType = {
  id: number;
  url: string;
  shortUrl: string;
  createdAt: string;
  updatedAt: string;
  action: 'encode' | 'decode';
};

export type UrlEncodeResponseType = {
  data: UrlType;
  message: string;
  status: string;
  statusCode: number;
};

export type UrlDecodeResponseType = {
  data: UrlType;
  message: string;
  status: string;
  statusCode: number;
};

export type UrlStatisticsResponseType = {
  data: UrlType;
  message: string;
  status: string;
  statusCode: number;
};

export type UrlRedirectResponseType = {
  data: UrlType;
  message: string;
  status: string;
  statusCode: number;
};

export type UrlListResponseType = {
  data: UrlType[];
  message: string;
  status: string;
  statusCode: number;
};

export type ActionType = 'encode' | 'decode';

export interface EncodePayload {
  action: 'encode';
  url: string;
}

export interface DecodePayload {
  action: 'decode';
  shortUrl: string;
}

export type ActionPayload = EncodePayload | DecodePayload;
