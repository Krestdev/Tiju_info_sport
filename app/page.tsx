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

  const getUserFavoriteCategories = (
    categories: Categorie[],
    userId: number
): Categorie[] => {
    // Étape 1 : Filtrer et trier les catégories selon les interactions de l'utilisateur
    const userFavoriteCategories = categories.sort((a, b) => {
        const aHasInteraction = a.donnees.some(article =>
            article.like.some(user => user.id === userId) ||
            article.commentaire.some(comment => comment.user?.id === userId)
        );
        const bHasInteraction = b.donnees.some(article =>
            article.like.some(user => user.id === userId) ||
            article.commentaire.some(comment => comment.user?.id === userId)
        );

        // Prioriser les catégories où l'utilisateur a interagi (like ou commentaire)
        if (aHasInteraction && !bHasInteraction) return -1;
        if (!aHasInteraction && bHasInteraction) return 1;

        // Conserver l'ordre initial si elles sont identiques
        return 0;
    });

    // Étape 2 : Trier les articles à l'intérieur de chaque catégorie
    const sortedCategories = userFavoriteCategories.map(categorie => {
        const sortedDonnees = categorie.donnees.sort((a, b) => {
            const aUserLiked = a.like.some(user => user.id === userId) ? 1 : 0;
            const bUserLiked = b.like.some(user => user.id === userId) ? 1 : 0;

            const aUserCommented = a.commentaire.some(comment => comment.user?.id === userId) ? 1 : 0;
            const bUserCommented = b.commentaire.some(comment => comment.user?.id === userId) ? 1 : 0;

            // Articles où l'utilisateur a liké ou commenté en premier
            if ((aUserLiked || aUserCommented) !== (bUserLiked || bUserCommented)) {
                return (bUserLiked + bUserCommented) - (aUserLiked + aUserCommented);
            }

            // Si égalité, trier par popularité (total des likes + commentaires)
            const aPopularity = a.like.length + a.commentaire.length;
            const bPopularity = b.like.length + b.commentaire.length;

            return bPopularity - aPopularity; // Les articles les plus populaires en premier
        });

        return { ...categorie, donnees: sortedDonnees };
    });

    return sortedCategories;
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
