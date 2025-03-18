"use client";

import CategoryComp from "@/components/Category/CategoriesComp";
import PubsComp from "@/components/PubsComp";
import useStore from "@/context/store";
import { Article, Pubs } from "@/data/temps";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Page = ({ params }: { params: Promise<{ sous: string; id: string }> }) => {
  const param = React.use(params);

  const { dataArticles, dataPubs } = useStore();
  const [article, setArticle] = useState<Article[]>();
  const [pub, setPub] = useState<Pubs[]>();

  const articleData = useQuery({
    queryKey: ["articles"],
    queryFn: async () => dataArticles,
  });

  const pubData = useQuery({
    queryKey: ["pubs"],
    queryFn: async () => dataPubs,
  });

  useEffect(() => {
    if (articleData.isSuccess && param.sous) {
      setArticle(
        articleData.data
          .flatMap((x) => x.donnees)
          .filter((x) => x.type === decodeURIComponent(param.sous))
      );

      // ✅ Envoi d'un événement Google Analytics
      if (typeof window !== "undefined" && window.gtag) {;
        window.gtag("event", "page_view", {
          page_path: `/category`,
          page_title: `category ${decodeURIComponent(param.sous)}`,
        });
      }
    }
  }, [articleData.data, param]);

  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data);
    }
  }, [pubData.data]);

  return (
    <div className="containerBloc items-center pb-[60px]">
      <div className="px-7 py-5 md:py-10">
        {pub && <PubsComp pub={pub} taille={"h-[180px]"} clip={""} />}
      </div>
      <CategoryComp article={article} ad={pub} categorie={articleData.data} />
    </div>
  );
};

export default Page;
