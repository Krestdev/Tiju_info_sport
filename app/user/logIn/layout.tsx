import { defineTitle } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";

export const metadata:Metadata = {
  title: defineTitle("Connexion"),
  description: "Connectez-vous à votre compte pour accéder à toutes les fonctionnalités de Tyju Info Sport.",
}

export default function LogInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
