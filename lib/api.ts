import axiosConfig from "@/api/api";

interface response {
    status: number;
    statusText: string;
    config:any;
}
interface categoryData extends response {
    data: Category[];
}

interface PagesData {
  data: CustomPage[];
}
interface SettingsData {
  data: ConfigProps[];

}
const axiosClient = axiosConfig();

export async function fetchArticle(slug: string): Promise<Article> {
    const res = await axiosClient.get(`/articles`);
    return res.data; // Adaptez selon votre API
  }
  
  export async function fetchCategory() {
    const res:categoryData = await axiosClient.get(`/category`);
    // console.log(res.data);
    return res.data;
  }

  export async function fetchPages() {
    const res:PagesData = await axiosClient.get(`/footer/show`);
    return res.data;
  }

  export async function fetchSettings() {
    const res:SettingsData = await axiosClient.get(`/param/show`);
    return res.data;
  }
