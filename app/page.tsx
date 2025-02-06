"use client"

import Grid from "@/components/Accueil/Grid";
import GridInfo from "@/components/Accueil/GridInfo";
import Hero from "@/components/Accueil/Hero";
import Footbar from "@/components/footbar";
import Navbar from "@/components/navbar";
import PubsComp from "@/components/PubsComp";
import useStore from "@/context/store";
import { Article, Categorie, Pubs } from "@/data/temps";
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
    const handleRouteChange = () => {
      if (!window.location.pathname.startsWith("/dashboard")) {
        // Déconnecter l'utilisateur
        logoutAdmin();
      }
    };

    // Ajouter un écouteur sur les changements de l'historique
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [pathname]);

  const isNewArticle = (createdAt: string): boolean => {
    const dateAjout = new Date(createdAt);
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - 1); // Considéré "nouveau" s'il a moins de 7 jours
    return dateAjout > dateLimite;
  };
  
  const getUserFavoriteCategories = (
    categories: Categorie[],
    userId: number
  ): Categorie[] => {
    // Étape 1 : Trier les catégories selon la présence d'un nouvel article
    const sortedCategories = categories.sort((a, b) => {
      const aHasNewArticle = a.donnees.some(article => isNewArticle(article.ajouteLe));
      const bHasNewArticle = b.donnees.some(article => isNewArticle(article.ajouteLe));
  
      if (aHasNewArticle && !bHasNewArticle) return -1; // Catégorie avec nouvel article en premier
      if (!aHasNewArticle && bHasNewArticle) return 1;
  
      // Vérifier les interactions de l'utilisateur (like ou commentaire)
      const aHasInteraction = a.donnees.some(article =>
        article.like.some(user => user.id === userId) ||
        article.commentaire.some(comment => comment.user?.id === userId)
      );
      const bHasInteraction = b.donnees.some(article =>
        article.like.some(user => user.id === userId) ||
        article.commentaire.some(comment => comment.user?.id === userId)
      );
  
      if (aHasInteraction && !bHasInteraction) return -1; // Catégorie avec interaction en premier
      if (!aHasInteraction && bHasInteraction) return 1;
  
      return 0; // Sinon, conserver l'ordre initial
    });
  
    // Étape 2 : Trier les articles à l'intérieur de chaque catégorie
    return sortedCategories.map(categorie => {
      const sortedDonnees = categorie.donnees.sort((a, b) => {
        const aIsNew = isNewArticle(a.ajouteLe) ? 1 : 0;
        const bIsNew = isNewArticle(b.ajouteLe) ? 1 : 0;
  
        if (aIsNew !== bIsNew) return bIsNew - aIsNew; // Nouveaux articles en premier
  
        const aUserLiked = a.like.some(user => user.id === userId) ? 1 : 0;
        const bUserLiked = b.like.some(user => user.id === userId) ? 1 : 0;
        const aUserCommented = a.commentaire.some(comment => comment.user?.id === userId) ? 1 : 0;
        const bUserCommented = b.commentaire.some(comment => comment.user?.id === userId) ? 1 : 0;
  
        if ((aUserLiked || aUserCommented) !== (bUserLiked || bUserCommented)) {
          return (bUserLiked + bUserCommented) - (aUserLiked + aUserCommented);
        }
  
        const aPopularity = a.like.length + a.commentaire.length;
        const bPopularity = b.like.length + b.commentaire.length;
  
        return bPopularity - aPopularity; // Les articles les plus populaires en premier
      });
  
      return { ...categorie, donnees: sortedDonnees };
    });
  };


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
      {pub2 && <PubsComp {...pub2} />}
      {/* {blog2 && <Blog {...blog2} />} */}
      <Footbar />
    </div>
  );
}
