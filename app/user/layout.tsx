
import { DM_Sans as FontSans } from "next/font/google";
import "../globals.css";
import Providers from "@/context/providers";
import HydrationZustand from "@/components/ui/hydration";
import Navbar from "@/components/navbar";
import Footbar from "@/components/footbar";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Providers>
      <HydrationZustand>
        <Navbar />
        {children}
        <Footbar />
      </HydrationZustand>
    </Providers>
  );
}
