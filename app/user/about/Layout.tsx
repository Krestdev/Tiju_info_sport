import { defineTitle } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";

export const metadata:Metadata = {
  title: defineTitle("À propos"),
  description: "Tyju Infosport est un véritable hub pour tous les passionnés de sport désireux de rester constamment informés des dernières nouvelles, analyses approfondies et événements majeurs du monde sportif",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
