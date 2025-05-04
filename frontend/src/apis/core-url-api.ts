import { QueryTagEnums } from '~/constants/query-tags';
import {
  UrlListResponseType,
  UrlEncodeResponseType,
  UrlDecodeResponseType,
  UrlStatisticResponseType,
} from '~/types';
import {
  UrlShortenerDecodeRequestType,
  UrlShortenerEncodeRequestType,
} from '~/features/home/home-url-shortener-schema';
import { getRequest, postRequest } from '~/config/base-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetUrlListQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTagEnums.URL_LIST],
    queryFn: async () => {
      return await getRequest<UrlListResponseType>({
        endpoint: `api/list`,
        config: {},
      });
    },
  });

  return { data, isLoading, error, refetch };
};

export const useUrlEncodeMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: urlEncode,
    isPending: urlEncodePending,
    error: urlEncodeError,
  } = useMutation({
    mutationFn: async ({
      payload,
    }: {
      payload: UrlShortenerEncodeRequestType;
    }) => {
      const data = await postRequest<
        UrlEncodeResponseType,
        UrlShortenerEncodeRequestType
      >({
        endpoint: `api/encode`,
        payload,
        config: {},
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryTagEnums.URL] });
      queryClient.invalidateQueries({ queryKey: [QueryTagEnums.URL_LIST] });
    },
  });

  return { urlEncode, urlEncodePending, urlEncodeError };
};

export const useUrlDecodeMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: urlDecode,
    isPending: urlDecodePending,
    error: urlDecodeError,
  } = useMutation({
    mutationFn: async ({
      payload,
    }: {
      payload: UrlShortenerDecodeRequestType;
    }) => {
      const data = await postRequest<
        UrlDecodeResponseType,
        UrlShortenerDecodeRequestType
      >({
        endpoint: `api/decode`,
        payload,
        config: {},
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryTagEnums.URL] });
      queryClient.invalidateQueries({ queryKey: [QueryTagEnums.URL_LIST] });
    },
  });

  return { urlDecode, urlDecodePending, urlDecodeError };
};

export const useGetUrlStatisticsQuery = ({
  path,
}: {
  path: { urlPath: string };
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTagEnums.URL, 'statistics', path.urlPath],
    queryFn: async () => {
      return await getRequest<UrlStatisticResponseType>({
        endpoint: `api/statistic/${path.urlPath}`,
        config: {},
      });
    },
    enabled: !!path.urlPath,
    staleTime: 0,
  });

  return { data, isLoading, error, refetch };
};
