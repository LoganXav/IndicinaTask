import { QueryTagEnums } from '~/constants/query-tags';
import { getRequest, postRequest } from '~/config/base-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  UrlDecodeResponseType,
  // UrlDecodeResponseType,
  UrlEncodeResponseType,
  UrlListResponseType,
  // UrlType,
} from '~/types';
import {
  UrlShortenerDecodeRequestType,
  // UrlShortenerRequestType,
  UrlShortenerEncodeRequestType,
} from '~/features/home/home-url-shortener-schema';

export const useGetUrlListQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTagEnums.URL],
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
    },
  });

  return { urlDecode, urlDecodePending, urlDecodeError };
};

// export const useGetUrlStatisticsQuery = ({
//   path,
// }: {
//   path: { urlPath: string };
// }) => {
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: [QueryTagEnums.URL],
//     queryFn: async () => {
//       return await getRequest<UrlType[]>({
//         endpoint: `api/statistics/${path.urlPath}`,
//         config: {},
//       });
//     },
//   });

//   return { data, isLoading, error, refetch };
// };

// export const useGetUrlRedirectQuery = ({
//   path,
// }: {
//   path: { urlPath: string };
// }) => {
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: [QueryTagEnums.URL],
//     queryFn: async () => {
//       return await getRequest<UrlType[]>({
//         endpoint: `/${path.urlPath}`,
//         config: {},
//       });
//     },
//   });

//   return { data, isLoading, error, refetch };
// };
