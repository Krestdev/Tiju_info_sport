
import { DM_Sans as FontSans } from "next/font/google";
import "../globals.css";
import Providers from "@/context/providers";
import HydrationZustand from "@/components/ui/hydration";
import Navbar from "@/components/navbar";
import Footbar from "@/components/footbar";
import { MenuComp } from "@/components/menu";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Providers>
      <HydrationZustand>
        <Navbar />
        <div className="pt-[50px] md:pt-0">
        <MenuComp />
        {children}
        </div>
        <Footbar categorie={undefined} />
      </HydrationZustand>
    </Providers>
  );
}
