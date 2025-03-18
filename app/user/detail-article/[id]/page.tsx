"use client";

import { useEffect, useState, use } from "react";
import Detail from "@/components/DetailArticle/Detail";
import PubsComp from "@/components/PubsComp";
import useStore from "@/context/store";
import { Article, Pubs } from "@/data/temps";
import { useQuery } from "@tanstack/react-query";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  // ✅ Utilisation de `use()` pour extraire l'ID
  const { id } = use(params);

  const { dataArticles, dataPubs, favorite } = useStore();
  const [article, setArticle] = useState<Article | undefined>();
  const [pub, setPub] = useState<Pubs[]>();
  const [similaire, setSimilaire] = useState<Article[] | undefined>();

  const articleData = useQuery({
    queryKey: ["articles"],
    queryFn: async () => dataArticles,
  });

  const pubData = useQuery({
    queryKey: ["pubs"],
    queryFn: async () => dataPubs,
  });

  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data);
    }
  }, [pubData.data, pubData.isSuccess]);

  useEffect(() => {
    if (articleData.isSuccess) {
      const articles = articleData.data.flatMap((cate) => cate.donnees);
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

  return (
    <div className="containerBloc gap-3">
      <div className="px-7">
        {pub && <PubsComp pub={pub} taille={"h-[200px]"} clip={""} />}
      </div>
      <Detail details={article} similaire={similaire} pub={pub} dataArticle={articleData.data} favorite={favorite} />
    </div>
  );
};

export default Page;
