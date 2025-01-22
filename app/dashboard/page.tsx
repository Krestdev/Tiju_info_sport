"use client";

import withAdminAuth from "@/lib/whithAdminAuth";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useStore from "@/context/store";

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

  return (
    <div className="containerBloc">
      <h1>Tableau de bord</h1>
    </div>
  );
};

export default withAdminAuth(DashbordPage);
