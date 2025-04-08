"use client";

import useStore from "@/context/store";
import { getUserFavoriteCategories } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Head from "./Head";
import GridAcc from "./GridAcc";
import PubsComp from "../PubsComp";
import GridInfo from "./GridInfo";
import UnePubs from "./UnePubs";
import { Button } from "../ui/button";
import axiosConfig from "@/api/api";
import { AxiosResponse } from "axios";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import Feed from "../feed";
import ArticlePreview from "../articlePreview";
import FeedTemplate from "../feed-template";

const Accueil = () => {
  const { currentUser, setFavorite, favorite } = useStore();
  const [pub, setPub] = useState<Advertisement[]>();
  const [grid2, setGrid2] = useState<Category[]>();
  const [carrHero, setCarrHero] = useState<Article[]>();
  const [une, setUne] = useState<Category[]>();
  const [tail, setTail] = useState("max-h-[379px]");
  const axiosClient = axiosConfig();

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return axiosClient.get<any, AxiosResponse<Category[]>>(`/category`);
    },
  });

  const ads = useQuery({
    queryKey: ["advertisement"],
    queryFn: () => {
      return axiosClient.get<any, AxiosResponse<Advertisement[]>>(
        `/advertisement`
      );
    },
  });
  const articles = categories.isSuccess ? categories.data.data.filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles).filter(x=>x.status === "published") : [];
  //console.log(articles);
  const randomAd = ads.isSuccess ? Math.floor(Math.random() * ads.data.data.length) : 0;

  const handleVoirtout = () => {
    setTail("");
  };
  useEffect(() => {
    if (ads.isSuccess) {
      setPub(ads.data.data);
      //console.log(ads.data.data)
    }
  }, [ads.data]);

  useEffect(() => {
    if (categories.isSuccess) {
      setUne(categories.data.data.filter((x) => x.articles.length > 0));
      //console.log(categories.data.data);
    }
  }, [categories.data]);

  useEffect(() => {
    if (une) {
      const articles = une.slice().flatMap((cat) => cat.articles);
      setGrid2(une);
      setCarrHero(articles.slice());
      if (currentUser) {
        setFavorite(getUserFavoriteCategories(une.slice(), currentUser.id));
      }
    }
  }, [une, categories.isSuccess, categories.isError, categories.data]);

  if (categories.isLoading) {
    return (
        <main className="py-0 lg:py-8">
        <Skeleton className="block lg:hidden w-full h-auto aspect-video mb-10" />
        <div className="containerBloc grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10">
          <div className="flex flex-col gap-10 col-span-1 lg:col-span-2">
            <Skeleton className="hidden lg:block w-full h-auto aspect-video rounded-md" />
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-5">
                      <Skeleton
                        key={index}
                        className="w-full h-auto aspect-video rounded-md"
                      />
                      <div className="flex flex-col gap-0.5">
                      <Skeleton className="w-14 h-6"/>
                      <Skeleton className="w-full h-20"/>
                      </div>
  
                  </div>
              ))}
            </div>
            <Skeleton className="w-full h-auto aspect-[4/1]" />
          </div>
          <div className="col-span-1 px-7 flex flex-col gap-7">
              {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col">
                      <Skeleton className="w-full h-10"/>
                      {Array.from({ length: 2 }).map((_, i) => (
                          <div key={i} className="flex flex-col gap-2 py-4">
                              <Skeleton className="w-14 h-5"/>
                              <Skeleton className="w-full h-11"/>
                          </div>
                      ))}
                  </div>))}
          </div>
        </div>
        <div className="containerBloc py-10 sm:py-12 md:py-14 lg:py-[60px] grid gap-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <Skeleton className="w-56 h-12" />
              <Skeleton className="w-20 h-10" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Skeleton className="w-full h-auto aspect-[4/3]" />
              <div className="grid gap-5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex gap-7">
                    <Skeleton className="w-40 h-[90px] rounded" />
                    <div className="w-full grid gap-1">
                      <Skeleton className="w-14 h-5" />
                      <Skeleton className="w-full h-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </main>
    );
  }
  if(categories.isSuccess){
    return (
        <main className="py-0 lg:py-8">
            <div className="block lg:hidden mb-10">
                {/* <Head gridAff={articles} /> */}
                <ArticlePreview version="main" {...articles[0]}/>
            </div>
            <FeedTemplate>
            <div className="hidden lg:block">
                {/* <Head gridAff={articles} /> */}
                <ArticlePreview version="main" {...articles[0]}/>
            </div>
            {/**Articles map */}
                {articles.length > 0 ?
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                {articles.slice(0,6).map(article=>(
                    <ArticlePreview key={article.id} {...article} />
                ))}  
            </div>
                : <div className="w-full min-h-80 flex items-center justify-center"><span className="text-lg sm:text-xl lg:text-2xl">{"Aucun article à afficher"}</span></div>}
            { ads.isLoading && <Skeleton className="w-full h-auto aspect-[4/1]" />}
            { ads.isSuccess && ads.data.data.length > 0 &&  <Link href={ads.data.data[randomAd].url}><div className="w-full h-[200px] bg-repeat-x bg-contain" style={{backgroundImage: `url(${process.env.NEXT_PUBLIC_API}image/${ads.data.data[randomAd].image.id})`}} /></Link>}
            {/* { ads.isSuccess && ads.data.data.length > 0 && <PubsComp pub={ads.data.data} taille={"h-[200px]"} clip={""} />} */}
            </FeedTemplate>
        {
            categories.data.data.length > 0 && categories.data.data.filter(x=>x.articles.length>1).slice(0,1).map(category=>(
            <GridInfo key={category.id} gridAff={category} couleur={"bg-[#0A0E93]"} />
            ))
        }
        { ads.isSuccess && ads.data.data.length > 0 && <PubsComp pub={ads.data.data.filter((x,i)=>i!==randomAd)} taille={"h-[200px]"} clip={""} />}
        {
            categories.data.data.length > 0 && categories.data.data.filter(x=>x.articles.length>1).slice(1,categories.data.data.length).map(category=>(
            <GridInfo key={category.id} gridAff={category} couleur={"bg-[#0A0E93]"} />
            ))
        }
      </main>
    );
  }
};

export default Accueil;
