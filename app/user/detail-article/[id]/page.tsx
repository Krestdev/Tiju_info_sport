"use client";

import { useEffect, useState, use } from "react";
import Detail from "@/components/DetailArticle/Detail";
import PubsComp from "@/components/PubsComp";
import useStore from "@/context/store";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "@/api/api";
import { AxiosResponse } from "axios";

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

  const articleData = useQuery({
          queryKey: ["categoryv"],
          queryFn: () => {
              return axiosClient.get<any, AxiosResponse<Category[]>>(
                  `/category`
              );
          },
      });

  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data.data);
    }
  }, [pubData.data, pubData.isSuccess]);

  useEffect(() => {
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
  }, [articleData.data, id, articleData.isSuccess]);

  if (!article) {
    return <div>Chargement ou article introuvable...</div>;
  }

  console.log(article);
  

  return (
    <div className="containerBloc gap-3">
      <div className="px-7">
        {pub && <PubsComp pub={pub} taille={"h-[200px]"} clip={""} />}
      </div>
      <Detail details={article} similaire={similaire} pub={pub} dataArticle={cate} favorite={favorite} />
    </div>
  );
};

export default Page;
