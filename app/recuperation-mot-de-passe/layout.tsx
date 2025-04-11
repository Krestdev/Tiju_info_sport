import AuthRedirect from "@/components/auth-redirect";
import { defineTitle } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";

export const metadata:Metadata = {
  title: defineTitle("Récupérer son mot de passe"),
  description: "Vous avez perdu l'accès à votre compte sur Tyjuinfosport ? Récupérez vos paramètres pour accéder à l'actualité sportive exclusive, personnaliser votre fil d'infos et commenter les articles. Retrouvez vos sports favoris en un clic."
}

export default function LogInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRedirect>{children}</AuthRedirect>;
}
