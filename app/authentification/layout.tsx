import { Metadata } from "next";
import React from "react";

export const metadata:Metadata = {
    title: "Vérification de l'email",
    description: "Vérifiez votre adresse email pour activer votre compte.",
}

export default function LogInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
