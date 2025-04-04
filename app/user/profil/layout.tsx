import { defineTitle } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";

export const metadata:Metadata = {
  title: defineTitle("Profil"),
  description: "Consulter votre profil sur Tyju Infosport. Modifier vos informations personnelles, gérer vos abonnements et consulter votre historique d'activités.",
}

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
