"use client";

import withAdminAuth from "@/lib/whithAdminAuth";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useStore from "@/context/store";
import GridDash from "@/components/Dashboard/Dash/GridDash";
import { useQuery } from "@tanstack/react-query";
import { Article, Categorie, comment, Users } from "@/data/temps";
import Compo from "@/components/Dashboard/Dash/Compo";
import SemiCirc from "@/components/Dashboard/Dash/SemiCirc";
import LinearChat from "@/components/Dashboard/Dash/LinearChar";
import { CircChar } from "@/components/Dashboard/Dash/CircChar";
import { DateRange } from "react-day-picker";


const DashbordPage = () => {
  const { logoutAdmin, dataArticles, dataUsers } = useStore()
  const pathname = usePathname();
  const [art, setArt] = useState<Article[]>()
  const [comment, setComment] = useState<comment[]>()
  const [abonne, setAbonne] = useState<Record<string, number>>()
  const [user, setUser] = useState<Users[]>()
  const [likes, setLikes] = useState<number>(0)
  const [dateRanges, setDateRanges] = useState<{ [key: string]: DateRange | undefined }>({
    publication: undefined,
    vuesSite: undefined,
    vuesPeriode: undefined,
    vuesCategorie: undefined,
  });
  const [values, setValues] = useState<{ [key: string]: string }>({
    publication: "semaine",
    vuesSite: "semaine",
    vuesPeriode: "semaine",
    vuesCategorie: "semaine",
  });

  const handleChange = (key: string, newValue: string) => {
    setValues((prev) => ({ ...prev, [key]: newValue }));
  };

  const articleData = useQuery({
    queryKey: ["articles"],
    queryFn: async () => dataArticles
  })

  const userData = useQuery({
    queryKey: ["users"],
    queryFn: async () => dataUsers
  })

  const countTotalLikes = (categories: Categorie[]): number => {
    return categories.reduce((totalLikes, category) => {
      return totalLikes + category.donnees.reduce((sum, article) => sum + article.like.length, 0);
    }, 0);
  };

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
      setLikes(countTotalLikes(articleData.data))
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

  const grid = [
    {
      value: art ? art?.length : 0,
      category: "Articles publiés",
      bgColor: "bg-[#0128AE]/10",
      color: "text-[#182067]"
    },
    {
      value: likes,
      category: "Likes",
      bgColor: "bg-[#FF0068]/10",
      color: "text-[#FF0068]"
    },
    {
      value: comment?.length,
      category: "Commentaires Signalés",
      bgColor: "bg-[#01AE35]/10",
      color: "text-[#01AE35]"
    },
  ]

  return (
    <div className="flex flex-col gap-5 px-7 py-10">
      <h1 className="uppercase text-[40px]">{"Tableau de bord"}</h1>
      <div className="flex flex-row gap-5">
        <Compo
          texte={"Publication"}
          page={"Tous les articles"}
          width={"w-full"}
          value={values.publication}
          setValue={(val) => handleChange("publication", val)}
          link={""}
          isLink
          dateRanges={dateRanges.publication}
          setDateRanges={setDateRanges}
          rangeKey="publication">
          <GridDash tableau={grid} value={values.publication} dateRanges={dateRanges} rangeKey={"publication"} />
        </Compo>
        <Compo
          texte={"Vues sur le site"}
          page={"Statistiques"}
          width={"max-w-[340px] w-full"}
          value={values.vuesSite}
          setValue={(val) => handleChange("vuesSite", val)}
          link={""}
          isLink
          dateRanges={dateRanges.vuesSite}
          setDateRanges={setDateRanges}
          rangeKey="vuesSite">
          <SemiCirc rangeKey={"vuesSite"} value={values.vuesSite} dateRanges={dateRanges} />
        </Compo>
      </div>
      <div className="flex flex-row gap-5">
        <Compo
          texte={"Vues par période"}
          page={"Tous les articles"}
          width={"max-w-[400px] w-full"}
          value={values.vuesPeriode}
          setValue={(val) => handleChange("vuesPeriode", val)}
          link={""}
          isLink
          dateRanges={dateRanges.vuesPeriode}
          setDateRanges={setDateRanges}
          rangeKey="vuesPeriode">
          <LinearChat rangeKey={"vuesPeriode"} value={values.vuesPeriode} dateRanges={dateRanges} />
        </Compo>
        <Compo
          texte={"Vues par catégorie"}
          page={"Catégories"}
          width={"w-full"}
          value={values.vuesCategorie}
          setValue={(val) => handleChange("vuesCategorie", val)}
          link={""}
          isLink
          dateRanges={dateRanges.vuesCategorie}
          setDateRanges={setDateRanges}
          rangeKey="vuesCategorie">
          <CircChar value={values.vuesCategorie} dateRanges={dateRanges} rangeKey={"vuesCategorie"} />
        </Compo>
      </div>
    </div>
  );
};

export default withAdminAuth(DashbordPage);
