"use client";

import withAdminAuth from "@/lib/whithAdminAuth";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useStore from "@/context/store";
import GridDash from "@/components/Dashboard/Dash/GridDash";
import { MdOutlineSportsVolleyball } from "react-icons/md";
import { BarChartComp } from "@/components/Dashboard/Dash/BarChartComp";
import { CircChart } from "@/components/Dashboard/Dash/CircChart";
import { useQuery } from "@tanstack/react-query";
import { Article, Categorie, comment, Users } from "@/data/temps";

const DashbordPage = () => {
  const { logoutAdmin, dataArticles, dataUsers } = useStore()
  const pathname = usePathname();
  const [art, setArt] = useState<Article[]>()
  const [comment, setComment] = useState<comment[]>()
  const [abonne, setAbonne] = useState<Record<string, number>>()
  const [user, setUser] = useState<Users[]>()

  const articleData = useQuery({
    queryKey: ["articles"],
    queryFn: async () => dataArticles
  })

  const userData = useQuery({
    queryKey: ["users"],
    queryFn: async () => dataUsers
  })

  useEffect(() => {
    if (articleData.isSuccess) {
      setArt(articleData.data.flatMap(x => x.donnees))
      setComment(art?.flatMap(x => x.commentaire))
      const commentSignal = articleData.data.flatMap(x => x.donnees).flatMap(y => y.commentaire).filter(x => x.signals.length > 0)
      const respenseSignal = articleData.data.flatMap(x => x.donnees)
        .flatMap(x => x.commentaire && x.commentaire)
        .filter(x => x.reponse.length > 0)
        .flatMap(x => x.reponse)
        .filter(x => x.signals.length > 0)
      setComment([...commentSignal, ...respenseSignal])
    }
  }, [articleData.data])

  useEffect(() => {
    if (userData.isSuccess) {
      setUser(userData.data)
    }
  }, [userData.data])

  const groupUsersBySubscriptionType = (users: Users[]) => {
    return users.reduce((acc, user) => {
      if (user.abonnement) {
        const type = user.abonnement.nom;
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const groupUsersForChart = (users: Users[]) => {
    const colors: Record<string, string> = {
      "Bouquet Or": "var(--color-chrome)",
      "Bouquet Diamant": "var(--color-safari)",
      "Bouquet Argent": "var(--color-firefox)",
      "Bouquet Bronze": "var(--color-edge)",
      "Bouquet Normal": "var(--color-other)"
    };

    const grouped = users.reduce((acc, user) => {
      if (user.abonnement) {
        const type = user.abonnement.nom;
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([bouquet, visitors]) => ({
      bouquet,
      visitors,
      fill: colors[bouquet] || "var(--color-default)"
    }));
  };


  const getTotalSubscribers = (users: Users[]) => {
    const abonnementsParType = groupUsersBySubscriptionType(users);
    return Object.values(abonnementsParType).reduce((total, count) => total + count, 0);
  };

  useEffect(() => {
    if (userData.isSuccess) {
      setAbonne(groupUsersBySubscriptionType(userData.data))
    }
  }, [userData.data])
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

  // Fonction pour récupérer les X derniers mois
  const getPreviousMonths = (count: number) => {
    const months = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        mois: d.toLocaleString("fr-FR", { month: "long" }),
        monthNumber: d.getMonth() + 1,
        year: d.getFullYear(),
      });
    }

    return months.reverse();
  };

  const getActiveUsers = (categories: Categorie[]): Users[] => {
    const userSet = new Set<number>();

    categories.forEach(category =>
      category.donnees.forEach(article => {
        [article.user, ...article.like, ...article.commentaire.flatMap(c => [
          c.user, ...c.like, ...c.reponse.map(r => r.user)
        ])]
          .filter(user => user)
          .forEach(user => userSet.add(user!.id));
      })
    );

    return Array.from(userSet).map(id =>
      categories.flatMap(c => c.donnees)
        .flatMap(a => [a.user, ...a.like, ...a.commentaire.flatMap(c => [c.user, ...c.like, ...c.reponse.map(r => r.user)])])
        .find(user => user && user.id === id)!
    );
  };

  const grid = [
    {
      icon: MdOutlineSportsVolleyball,
      value: art ? art?.length : 0,
      category: "Total De Publications",
      color: "blue"
    },
    {
      icon: MdOutlineSportsVolleyball,
      value: getTotalSubscribers(userData.data ? userData.data : []),
      category: "Total Abonnés",
      color: "red"
    },
    {
      icon: MdOutlineSportsVolleyball,
      value: comment?.length,
      category: "Commentaires Signalés",
      color: "purple"
    },
    {
      icon: MdOutlineSportsVolleyball,
      value: getActiveUsers(articleData.data ? articleData.data : []).length,
      category: "Utilisateurs Reactifs",
      color: "green"
    },
  ]

  return (
    <div className="containerBloc pb-36 flex flex-col gap-5">
      <GridDash tableau={grid}  />
      <div className="flex flex-col md:flex-row gap-2">
        <BarChartComp getPreviousMonths={getPreviousMonths} />
        <CircChart 
        totalAbonne={getTotalSubscribers(userData.data ? userData.data : [])} 
        getPreviousMonths={getPreviousMonths} 
        chartData={groupUsersForChart(user ? user : [])} 
         />
      </div>
    </div>
  );
};

export default withAdminAuth(DashbordPage);
