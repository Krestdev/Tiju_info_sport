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
  description: "TyJu Infosports est un média en ligne dédié à l’actualité sportive, avec un focus particulier sur le sport africain, et plus précisément camerounais. Nous couvrons un large éventail de disciplines, avec pour mission de mettre en lumière les talents, les performances et les événements qui façonnent le paysage sportif du continent. Pensé et créé par deux jeunes passionnés de sport, TyJu Infosports se veut une plateforme dynamique, engagée et proche des réalités locales, pour donner la parole à celles et ceux qui font vibrer le sport au quotidien.",
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
          <Providers>
            <HydrationZustand>
              <Navbar/>
              {children}
              <Footbar/>
            </HydrationZustand>
          </Providers>
          {/* <Maintenance /> */}
        </main>
      </body>
    </html>
  );
}