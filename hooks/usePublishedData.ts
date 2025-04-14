import axiosConfig from "@/api/api";
import useStore from "@/context/store";
import { fetchCategory } from "@/lib/api";
import { sortArticles } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const today = new Date();

export const usePublishedArticles = () =>{

    const {token} = useStore()
    const axiosClient = axiosConfig({
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        });
    const {data, isSuccess, isError, isLoading} = useQuery({
        queryKey: ["categories"],
        // queryFn: ()=> fetchCategory()
        queryFn: () => {
                    return axiosClient.get<any, AxiosResponse<Category[]>>(
                        `/category`
                    );
                },
    });
    const categories:Category[] = isSuccess ? data.data : [];
    const allArticles:Article[] = data !== undefined && isSuccess ? sortArticles(data.data.filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles)) : [];
    const publishedArticles:Article[] = isSuccess ? sortArticles(data.data.filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles).filter(x=>x.status==="published")) : [];
    const todayArticles:Article[] = publishedArticles.filter(article=>new Date(article.created_at).getDate()=== today.getDate());
    const headline:Article[]= publishedArticles.filter(x=>x.headline=== true);
    const mainCategories = categories.filter(x=>x.parent === null);
    const childCategories = categories.filter(x=>x.parent !== null && x.articles.length > 0 );
    const allchildCategories = categories.filter(x=>x.parent !== null );

    return {
        isSuccess, isLoading, isError, categories, publishedArticles, todayArticles, headline, mainCategories, childCategories, allArticles, allchildCategories
    }
}