import { Metadata } from "next";
import React from "react";

export const metadata:Metadata = {
  title: "Publications de la semaine",
  description: "Découvrez les dernières publications de la semaine et matière de sports. Du football au basketball, en passant par le tennis et bien plus encore, restez informé des dernières nouvelles et analyses.",
}

export default function LogInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
