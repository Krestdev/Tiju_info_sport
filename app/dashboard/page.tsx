"use client";

import withAdminAuth from "@/lib/whithAdminAuth";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useStore from "@/context/store";
import GridDash from "@/components/Dashboard/Dash/GridDash";
import { MdOutlineSportsVolleyball } from "react-icons/md";
import { BarChartComp } from "@/components/Dashboard/Dash/BarChartComp";
import { CircChart } from "@/components/Dashboard/Dash/CircChart";

const DashbordPage = () => {
  const { logoutAdmin } = useStore()
  const router = useRouter();
  const pathname = usePathname(); // Récupère l'URL actuelle

  useEffect(() => {
    const handleRouteChange = () => {
      if (!window.location.pathname.startsWith("/dashboard")) {
        // Déconnecter l'utilisateur
        logoutUser();
      }
    };

    // Ajouter un écouteur sur les changements de l'historique
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [pathname]);

  const logoutUser = () => {
    console.log("hello");
    logoutAdmin();
  };

  const grid = [
    {
      icon: MdOutlineSportsVolleyball,
      value: 231,
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
      value: 21,
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
        <BarChartComp />
        <CircChart />
      </div>
    </div>
  );
};

export default withAdminAuth(DashbordPage);
