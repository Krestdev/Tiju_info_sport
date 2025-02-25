"use client"

import Accueil from "@/components/Accueil/Accueil";
import Grid from "@/components/Accueil/Grid";
import GridInfo from "@/components/Accueil/GridInfo";
import Hero from "@/components/Accueil/Hero";
import Footbar from "@/components/footbar";
import { MenuComp } from "@/components/menu";
import Navbar from "@/components/navbar";
import PubsComp from "@/components/PubsComp";
import useStore from "@/context/store";
import { Article, Categorie, Pubs } from "@/data/temps";
import { getUserFavoriteCategories } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function HomePage() {

  const { logoutAdmin, } = useStore()
  const router = useRouter();
  const pathname = usePathname();

  const { dataPubs, dataArticles, currentUser, favorite, setFavorite } = useStore();
  const [art, setArt] = useState<Categorie[]>();
  const [pub, setPub] = useState<Pubs[]>();
  const [pub1, setPu1] = useState<Pubs>();
  const [pub2, setPu2] = useState<Pubs>();
  const [blog1, setBlog1] = useState<Article>();
  const [blog2, setBlog2] = useState<Article>();
  const [grid1, setGrid1] = useState<Categorie[]>();
  const [grid2, setGrid2] = useState<Categorie[]>();
  const [carrHero, setCarrHero] = useState<Article[]>();

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
      setPub(pubData.data)
      setPu1(pubData.data[0])
      setPu2(pubData.data[1])
    }
  }, [pubData.data])

  useEffect(() => {
    if (articleData.isSuccess) {
      const articles = articleData.data.slice().flatMap(cate => cate.donnees)
      setBlog1(articles[articles.length - 2])
      setBlog2(articles[articles.length - 1])
      setGrid1(favorite?.slice(0))
      setGrid2(favorite?.slice(1))
      setCarrHero(articles.slice(0, 4))
      setArt(articleData.data)
    };
    if (currentUser && articleData.data) {
      setFavorite(getUserFavoriteCategories(articleData.data.slice(), currentUser.id))
    }
  }, [articleData.data])

  return (
    <div>
      <Navbar />
      <div className="pt-[65px] md:pt-0">
        <MenuComp />
        <Accueil />
        {/* {carrHero && <Hero gridAff={carrHero} />}
        {grid1 && <Grid gridAff={favorite} pubAff={pub} />}
        {grid1 && <GridInfo gridAff={grid1} />} */}
        {/* <div className="containerBloc">{pub && <PubsComp pub={pub} />}</div> */}
        {/* {blog1 && <Blog {...blog1} />} */}
        {/* {grid2 && <GridInfo gridAff={grid2} />} */}
        {/* <div className="containerBloc">{pub && <PubsComp pub={pub?.slice().reverse()} />}</div> */}
        {/* {blog2 && <Blog {...blog2} />} */}
      </div>
      <Footbar categorie={art} />
    </div>
  );
}
