import { Open_Sans, Oswald, Ubuntu } from "next/font/google";
import "./globals.css";
import Providers from "@/context/providers";
import HydrationZustand from "@/components/ui/hydration";
import Script from "next/script";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footbar from "@/components/footbar";
import Maintenance from "./Maintenance";

const fontMono = Oswald({ subsets: ["latin"], variable: "--font-mono" });
/* const fontSans = Ubuntu({ subsets: ["latin"], weight: ["400", "500", "700", "300"], variable: "--font-sans" }); */
const fontSans = Open_Sans({ subsets: ["latin"], variable: "--font-sans" }); /**Ubuntu doesnt display well for some reason, so we better use this one :/ */

export const metadata: Metadata = {
  title: "Tyjuinfosport - L'actualité sportive",
  description: "Votre source d'infos sportives. Actualités, résultats, interviews et analyses sur le football, basket, athlétisme et bien d'autres sports.",
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const idC = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
  return (
    <html suppressHydrationWarning>
      <head>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${idC}`}></Script>
        <Script id="google-analitics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${idC}');`
          }
        </Script>
      </head>
      <body
        className={cn("min-h-screen font-sans antialiased", fontMono.variable, fontSans.variable)}
        suppressHydrationWarning={true}
      >
        <main>
          {/* <GA /> */}
          {/* <Providers>
            <HydrationZustand>
              <Navbar/>
              {children}
              <Footbar/>
            </HydrationZustand>
          </Providers> */}
          <Maintenance />
        </main>
      </body>
    </html>
  );
}