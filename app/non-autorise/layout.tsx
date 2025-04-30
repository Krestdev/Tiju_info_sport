import { Metadata } from "next";
import "../globals.css";

export const metadata:Metadata = {
  title: "Accès refusé",
  description: "Oups ! vous n'avez pas les accès pour cette page. Contactez votre administrateur",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
        <div className="min-h-[calc(100vh-500px)]">
        {children}
        </div>
  );
}
