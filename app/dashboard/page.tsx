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
import { Article, comment } from "@/data/temps";

const DashbordPage = () => {
  const { logoutAdmin, dataArticles } = useStore()
  const router = useRouter();
  const pathname = usePathname();
  const [art, setArt] = useState<Article[]>()
  const [comment, setComment] = useState<comment[]>()

  const articleData = useQuery({
    queryKey: ["articles"],
    queryFn: async () => dataArticles
  })

  useEffect(() => {
    if (articleData.isSuccess) {
      setArt(articleData.data.flatMap(x => x.donnees))
      // setComment(art?.flatMap(x => x.commentaire))

      const commentSignal = articleData.data.flatMap(x => x.donnees).flatMap(y => y.commentaire).filter(x => x.signals.length > 0)
      const respenseSignal = articleData.data.flatMap(x => x.donnees)
        .flatMap(x => x.commentaire && x.commentaire)
        .filter(x => x.reponse.length > 0)
        .flatMap(x => x.reponse)
        .filter(x => x.signals.length > 0)

      setComment([...commentSignal, ...respenseSignal])
      console.log(comment);
      
    }
  }, [articleData.data])

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

  // Fonction pour récupérer les N derniers mois
  const getPreviousMonths = (count: number) => {
    const months = [];
    const date = new Date();

    for (let i = 0; i < count; i++) {
      months.unshift({
        mois: new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date),
        monthNumber: date.getMonth() + 1,
        year: date.getFullYear(),
      });
      date.setMonth(date.getMonth() - 1);
    }

    return months;
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
      value: 45,
      category: "Total Abonnés",
      color: "red"
    },
    {
      icon: MdOutlineSportsVolleyball,
      value: 40,
      category: "Commentaires Signalés",
      color: "purple"
    },
    {
      icon: MdOutlineSportsVolleyball,
      value: 13,
      category: "Utilisateurs Reactifs",
      color: "green"
    },
  ]

  return (
    <div className="containerBloc pb-36 flex flex-col gap-5">
      <GridDash tableau={grid} />
      <div className="flex gap-2">
        <BarChartComp getPreviousMonths={getPreviousMonths} />
        <CircChart getPreviousMonths={getPreviousMonths} />
      </div>
    </div>
  );
};

export default withAdminAuth(DashbordPage);
