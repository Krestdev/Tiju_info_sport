import { defineTitle } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";

export const metadata:Metadata = {
  title: defineTitle("Profil"),
  description: "Consultez votre compte sur Tyjuinfosport pour accéder à l'actualité sportive exclusive, personnaliser votre fil d'infos et commenter les articles. Retrouvez vos sports favoris en un clic."
}

export default function LogInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
