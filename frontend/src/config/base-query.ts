import { apiConfig } from '~/config/http';

export interface PostRequestPropsType<K> {
  endpoint: string;
  payload: K;
  config?: any;
}
export interface GetRequestPropsType {
  endpoint: string;
  config?: any;
}

export interface PostRequestReturnType<T> {
  data: T;
  message: string;
  status?: string;
  statusCode?: number;
}

export interface GetRequestReturnType<T> {
  data: T;
  message: string;
  status?: string;
  statusCode?: number;
}

export const postRequest = async <T, K>({
  endpoint,
  payload,
  config = {},
}: PostRequestPropsType<K>): Promise<PostRequestReturnType<T>> => {
  return await apiConfig.post(endpoint, payload, {
    ...config,
    params: config.params,
  });
};

export const getRequest = async <T>({
  endpoint,
  config = {},
}: GetRequestPropsType): Promise<GetRequestReturnType<T>> => {
  return await apiConfig.get(endpoint, { ...config });
};
