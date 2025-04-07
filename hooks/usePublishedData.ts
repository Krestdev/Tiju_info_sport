import axiosConfig from "@/api/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios";

const axiosClient = axiosConfig();
const today = new Date();

export const usePublishedArticles = () =>{
    const {data, isSuccess, isError, isLoading} = useQuery({
        queryKey: ["categories"],
        queryFn: ()=> axiosClient.get<any, AxiosResponse<Category[]>>(`/category`)
    });
    const categories:Category[] = isSuccess ? data.data : [];
    const publishedArticles:Article[] = isSuccess ? data.data.filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles).filter(x=>x.status==="published") : [];
    const todayArticles:Article[] = publishedArticles.filter(article=>new Date(article.created_at).getDate()=== today.getDate());
    const mainArticles:Article[]= publishedArticles; // TODO: filter by category or other criteria

    return {
        isSuccess, isLoading, isError, categories, publishedArticles, todayArticles, mainArticles
    }
}