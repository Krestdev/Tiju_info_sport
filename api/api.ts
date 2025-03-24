import useStore from "@/context/store";
import axios from "axios";

const axiosConfig = () => {
  const { token, logout } = useStore();

  const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": "abc123"
    },
  });

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          logout();
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
