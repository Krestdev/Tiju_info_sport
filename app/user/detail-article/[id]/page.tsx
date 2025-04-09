"use client";

import { useEffect, useState, use } from "react";
import Detail from "@/components/DetailArticle/Detail";
import PubsComp from "@/components/PubsComp";
import useStore from "@/context/store";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "@/api/api";
import { AxiosResponse } from "axios";
import Head from "next/head";
import { usePublishedArticles } from "@/hooks/usePublishedData";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  // ✅ Utilisation de `use()` pour extraire l'ID
  const { id } = use(params);

  const { favorite } = useStore();
  const [article, setArticle] = useState<Article>();
  const [pub, setPub] = useState<Advertisement[]>();
  const [similaire, setSimilaire] = useState<Article[]>();
  const [cate, setCate] = useState<Category[]>()
  const axiosClient = axiosConfig();

  const pubData = useQuery({
    queryKey: ["advertisement"],
    queryFn: () => {
      return axiosClient.get<any, AxiosResponse<Advertisement[]>>(
        `/advertisement`
      );
    },
  });

  const {categories, isSuccess, isLoading, publishedArticles} = usePublishedArticles();
  const currentArticle = publishedArticles.find(y=>y.id.toString()===decodeURIComponent(id));
  const similarArticles = publishedArticles.filter(x=>x.slug === currentArticle?.slug);

  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data.data);
    }
  }, [pubData.data, pubData.isSuccess]);

/*   useEffect(() => {
    if (articleData.isSuccess) {
      setCate(articleData.data.data)
      const articles = articleData.data.data.flatMap((cate) => cate.articles);
      const foundArticle = articles.find((x) => x.id === Number(id));
      setArticle(foundArticle);

      setSimilaire(
        articles
          .filter((x) => x.type === foundArticle?.type && x.id !== foundArticle.id)
          .slice(0, 2)
      );

      if (typeof window !== "undefined" && window.gtag && foundArticle) {
        console.log("🔍 Tracking page view:", `/detail-article/${id}`);
        window.gtag("event", "page_view", {
          page_path: `/detail-article/${id}`,
          page_title: "/detail-article",
        });
      }
    }
  }, [articleData.data, id, articleData.isSuccess]); */

  if (!currentArticle) {
    return <div>Chargement ou article introuvable...</div>;
  }

   // URL de l'image de l'article ou image par défaut si absente
   const imageUrl = currentArticle.images && currentArticle.images.length > 0
   ? `https://tiju.krestdev.com/api/image/${currentArticle.images[0].id}`
   : 'https://tiju.krestdev.com/path/to/noImage.jpg';

   if(currentArticle){
     return (
       <div className="containerBloc gap-3">
         <Head>
           <meta property="og:title" content={currentArticle.title} />
           <meta property="og:description" content={currentArticle.summery} />
           <meta property="og:image" content={imageUrl} />
           <meta property="og:url" content={`https://www.tyjuinfosport.com/user/detail-article/${currentArticle.id}`} />
    
           <meta name="twitter:title" content={currentArticle.title} />
           <meta name="twitter:description" content={currentArticle.summery} />
           <meta name="twitter:image" content={imageUrl} />
           <meta name="twitter:card" content="summary_large_image" />
         </Head>
    
          {pub && <PubsComp pub={pub} taille={"h-[200px]"} clip={""} />}
          <Detail details={currentArticle} similaire={similarArticles} pub={pub} dataArticle={categories} favorite={favorite} />
        </div>
      );
   }
};

export default Page;
