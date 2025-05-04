export type UrlType = {
  id: number;
  url: string;
  shortUrl: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  visitCount: number;
  lastVisitedAt: string;
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

export type UrlStatisticResponseType = {
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
