"use client"

import Blog from "@/components/Accueil/Blog";
import GridInfo from "@/components/Accueil/GridInfo";
import Hero from "@/components/Accueil/Hero";
import PubsComp from "@/components/PubsComp";
import useStore from "@/context/store";
import { Article, Pubs } from "@/data/temps";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const { dataPubs, dataArticles } = useStore();
  const [pub1, setPu1] = useState<Pubs>()
  const [pub2, setPu2] = useState<Pubs>()
  const [blog1, setBlog1] = useState<Article>()
  const [blog2, setBlog2] = useState<Article>()
  const [grid1, setGrid1] = useState<Article[]>()
  const [grid2, setGrid2] = useState<Article[]>()
  const [carrHero, setCarrHero] = useState<Article[]>()

  const pubData = useQuery({
    queryKey: ["pubs"],
    queryFn: async () => dataPubs,
  });

  const articleData = useQuery({
    queryKey: ["articles"],
    queryFn: async () => dataArticles,
  });


  useEffect(() => {
    if (pubData.isSuccess) {
      setPu1(pubData.data[0])
      setPu2(pubData.data[1])
    }
  }, [pubData.data])

  useEffect(() => {
    if (articleData.isSuccess) {
      setBlog1(articleData.data[articleData.data.length - 2])
      setBlog2(articleData.data[articleData.data.length - 1])
      setGrid1(articleData.data.slice(1, 7))
      setGrid2(articleData.data.slice(1, 7))
      setCarrHero(articleData.data.slice(0, 4))
    }
  }, [articleData.data])



  return (
    <div>
      {carrHero && <Hero gridAff={carrHero} />}
      {grid1 && <GridInfo gridAff={grid1} />}
      {pub1 && <PubsComp {...pub1} />}
      {blog1 && <Blog {...blog1} />}
      {grid2 && <GridInfo gridAff={grid2} />}
      {pub2 && <PubsComp id={pub2.id} lien={pub2.lien} image={pub2.image} />}
      {blog2 && <Blog {...blog2} />}
    </div>
  );
}
