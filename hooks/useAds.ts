import axiosConfig from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const axiosClient = axiosConfig();
export const useAds = () => {
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["advertisement"],
    queryFn: () =>
      axiosClient.get<any, AxiosResponse<Advertisement[]>>(`/advertisement`),
  });
  const ads = isSuccess ? data.data : [];
  const squareAds:Advertisement[] = ads.filter(x=>x.description === "petit");
  const largeAds:Advertisement[] = ads.filter(x=>x.description === "large");
  const randomSquare:Advertisement|undefined = squareAds[Math.floor(Math.random() * squareAds.length)];
  const randomLarge:Advertisement|undefined = largeAds[Math.floor(Math.random() * largeAds.length)];
  return {
    ads, isSuccess, isLoading, isError, squareAds, largeAds, randomSquare, randomLarge
  }
};
