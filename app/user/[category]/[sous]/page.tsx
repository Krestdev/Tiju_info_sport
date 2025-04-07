"use client";

import axiosConfig from "@/api/api";
import CategoryComp from "@/components/Category/CategoriesComp";
import PubsComp from "@/components/PubsComp";
import useStore from "@/context/store";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Page = ({ params }: { params: Promise<{ sous: string; id: string }> }) => {
  const param = React.use(params);

  const [article, setArticle] = useState<Article[]>();
  const [pub, setPub] = useState<Advertisement[]>();
  const [cate, setCate] = useState<Category[]>()

  const axiosClient = axiosConfig();

  const articleData = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return axiosClient.get<any, AxiosResponse<Category[]>>(
        `/category`
      );
    },
  });

  const pubData = useQuery({
    queryKey: ["advertisement"],
    queryFn: () => {
      return axiosClient.get<any, AxiosResponse<Advertisement[]>>(
        `/advertisement`
      );
    },
  });


  useEffect(() => {
    if (articleData.isSuccess) {
      setCate(articleData.data.data)
    }
  }, [articleData.data])

  useEffect(() => {
    if (cate && param.sous) {

      setArticle(
        cate
          .flatMap((x) => x.articles)
          .filter((x) => x.type === decodeURIComponent(param.sous))
      );

      // ✅ Envoi d'un événement Google Analytics
      if (typeof window !== "undefined" && window.gtag) {
        ;
        window.gtag("event", "page_view", {
          page_path: `/category`,
          page_title: `category ${decodeURIComponent(param.sous)}`,
        });
      }
    }
  }, [cate, param]);

  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data.data);
    }
  }, [pubData.data]);

  return (
    <div className="containerBloc items-center pb-[60px]">
      <div className="px-7 py-5 md:py-10">
        {pub && <PubsComp pub={pub} taille={"h-[180px]"} clip={""} />}
      </div>
      <CategoryComp article={article} ad={pub} categorie={cate} categoriesList={articleData.data?.data} setArticle={setArticle} />
    </div>
  );
};

export default Page;
