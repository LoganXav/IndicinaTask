import axios from 'axios';

export const BACKEND_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5500';

export const apiConfig = axios.create({
  baseURL: BACKEND_URL,
});

apiConfig.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.groupCollapsed(`@Request`, config.url);
    if (config.params) {
      console.groupCollapsed('Params');
      console.info(config.params);
      console.groupEnd();
    }
    if (config.data) {
      console.groupCollapsed('Data');
      console.info(config.data);
      console.groupEnd();
    }
    console.groupEnd();
  }

  return config;
});

apiConfig.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.groupCollapsed(`@Response`, response.config.url, response.status);
      if (response.data) {
        console.groupCollapsed('Data');
        console.info(response.data);
        console.groupEnd();
      }
      if (response.config.params) {
        console.groupCollapsed('Params');
        console.info(response.config.params);
        console.groupEnd();
      }
      if (response.headers) {
        console.groupCollapsed('Headers');
        console.info(response.headers);
        console.groupEnd();
      }
      console.groupEnd();
    }

    return response.data;
  },
  (error) => {
    return Promise.reject(
      error.response
        ? {
            message:
              error.response.data?.errors?.[0]?.message ||
              error?.response?.data?.data?.message ||
              error?.response?.data?.message ||
              error?.response?.data?.details?.[0]?.message ||
              error?.response?.data?.result?.message?.name ||
              error?.response?.data?.result?.message ||
              'Something went wrong. Please contact admin.',

            status: error.response.status,
          }
        : {
            message: 'Something went wrong. Please contact admin.',
            status: 500,
          }
    );
  }
);
