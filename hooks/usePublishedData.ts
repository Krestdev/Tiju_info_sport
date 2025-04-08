import axiosConfig from "@/api/api";
import { fetchCategory } from "@/lib/api";
import { sortArticles } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();
const today = new Date();

export const usePublishedArticles = () =>{
    const {data, isSuccess, isError, isLoading} = useQuery({
        queryKey: ["categories"],
        queryFn: ()=> fetchCategory()
    });
    const categories:Category[] = isSuccess ? data : [];
    const publishedArticles:Article[] = isSuccess ? sortArticles(data.filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles).filter(x=>x.status==="published")) : [];
    const todayArticles:Article[] = publishedArticles.filter(article=>new Date(article.created_at).getDate()=== today.getDate());
    const headline:Article[]= publishedArticles.filter(x=>x.headline=== true);

    return {
        isSuccess, isLoading, isError, categories, publishedArticles, todayArticles, headline
    }
}