"use client"

import Blog from "@/components/Accueil/Blog";
import Grid from "@/components/Accueil/Grid";
import GridInfo from "@/components/Accueil/GridInfo";
import Hero from "@/components/Accueil/Hero";
import Footbar from "@/components/footbar";
import Navbar from "@/components/navbar";
import PubsComp from "@/components/PubsComp";
import useStore from "@/context/store";
import { Article, Categorie, Pubs } from "@/data/temps";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {

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



  const getUserFavoriteCategories = (
    categories: Categorie[],
    userId: number
  ): Categorie[] => {
    // Étape 1 : Filtrer les catégories où l'utilisateur a liké au moins un article
    const userFavoriteCategories = categories.filter(categorie =>
      categorie.donnees.some(article =>
        article.like.some(user => user.id === userId)
      )
    );
    // Étape 2 : Trier les catégories par popularité (total des likes de tous les articles)
    const sortedCategories = userFavoriteCategories.map(categorie => {
      const sortedDonnees = categorie.donnees.sort((a, b) => {
        // Articles likés par l'utilisateur en tête
        const aLikedByUser = a.like.some(user => user.id === userId) ? 1 : 0;
        const bLikedByUser = b.like.some(user => user.id === userId) ? 1 : 0;
        // Si les deux articles sont ou ne sont pas likés, trier par nombre de likes total
        if (aLikedByUser === bLikedByUser) {
          return b.like.length - a.like.length; // Articles avec plus de likes en premier
        }
        return bLikedByUser - aLikedByUser; // Articles likés par l'utilisateur en premier
      });
      return { ...categorie, donnees: sortedDonnees };
    });
    // Étape 3 : Retourner les catégories favorites
    return sortedCategories
  };




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
      const articles = articleData.data.flatMap(cate => cate.donnees)
      setBlog1(articles[articles.length - 2])
      setBlog2(articles[articles.length - 1])
      setGrid1(favorite?.slice(0))
      setGrid2(favorite?.slice(1))
      setCarrHero(articles.slice(0, 4))
      setArt(articleData.data)
    };
    if (currentUser && articleData.data) {
      setFavorite(getUserFavoriteCategories(articleData.data, currentUser.id))
    }
    console.log(favorite);
  }, [articleData.data])





  return (
    <div>
      <Navbar />
      {carrHero && <Hero gridAff={carrHero} />}
      {grid1 && <Grid gridAff={art} pubAff={pub} />}
      {grid1 && <GridInfo gridAff={grid1} />}
      {pub1 && <PubsComp {...pub1} />}
      {/* {blog1 && <Blog {...blog1} />} */}
      {grid2 && <GridInfo gridAff={grid2} />}
      {pub2 && <PubsComp id={pub2.id} lien={pub2.lien} image={pub2.image} />}
      {/* {blog2 && <Blog {...blog2} />} */}
      <Footbar />
    </div>
  );
}
