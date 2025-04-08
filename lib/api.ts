import axiosConfig from "@/api/api";

interface response {
    status: number;
    statusText: string;
    config:any;
}
interface categoryData extends response {
    data: Category[];
}

const axiosClient = axiosConfig();

export async function fetchArticle(slug: string): Promise<Article> {
    const res = await axiosClient.get(`/articles`);
    return res.data; // Adaptez selon votre API
  }
  
  export async function fetchCategory(): Promise<Category[]> {
    const res:categoryData = await axiosClient.get(`/category`);
    console.log(res.data);
    return res.data;
  }