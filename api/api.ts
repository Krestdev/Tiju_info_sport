import axios, { AxiosRequestConfig } from "axios";

const axiosConfig = (headers?: AxiosRequestConfig['headers']) => {
  const isServer = typeof window === 'undefined';
  const finalHeaders = {
    ...headers,
    ...(isServer ? { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } : {})
  };

  const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: finalHeaders,
  });

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          console.log('Non autorisé');
        }
      } else {
        console.error("Erreur inconnue :", error);
      }
      throw error;
    }
  );

  return axiosClient;
};

export default axiosConfig;
