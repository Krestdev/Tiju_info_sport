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
import GA from "@/components/GoogleAnalytics";
import { fetchSettings } from "@/lib/api";

const fontMono = Oswald({ subsets: ["latin"], variable: "--font-mono" });
const fontSans = Open_Sans({ subsets: ["latin"], variable: "--font-sans" }); /**Ubuntu doesnt display well for some reason, so we better use this one :/ */

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  return {
    title:{
      template: `%s - ${settings[0].company || "Tyju Infosports"}`,
      default: `${settings[0].company || "Tyju Infosports"} - L'actualité sportive`
    },
    description: settings[0].description || "TyJu Infosports est un média en ligne dédié à l’actualité sportive, avec un focus particulier sur le sport africain, et plus précisément camerounais. Nous couvrons un large éventail de disciplines, avec pour mission de mettre en lumière les talents, les performances et les événements qui façonnent le paysage sportif du continent. Pensé et créé par deux jeunes passionnés de sport, TyJu Infosports se veut une plateforme dynamique, engagée et proche des réalités locales, pour donner la parole à celles et ceux qui font vibrer le sport au quotidien.",
    keywords: [`${settings[0].company || "Tyju Infosports"}`, "sport", "football", "cameroun", "MTN Elite one", "handball", "basketball", "tyju", "infosport", "sports", "lions indomptables", "lionnes indomptables", "CHAN", "CAN"],
    authors: [{name: `${settings[0].company || "Tyju Infosports"}`},],
    publisher: `${settings[0].company || "Tyju Infosports"}`,
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png"
    },
    openGraph: {
      title:{
        template: `%s - ${settings[0].company || "Tyju Infosports"}`,
        default: `${settings[0].company || "Tyju Infosports"} - L'actualité sportive`
      },
      description: settings[0].description || "TyJu Infosports est un média en ligne dédié à l’actualité sportive, avec un focus particulier sur le sport africain, et plus précisément camerounais. Nous couvrons un large éventail de disciplines, avec pour mission de mettre en lumière les talents, les performances et les événements qui façonnent le paysage sportif du continent. Pensé et créé par deux jeunes passionnés de sport, TyJu Infosports se veut une plateforme dynamique, engagée et proche des réalités locales, pour donner la parole à celles et ceux qui font vibrer le sport au quotidien.",
      url: process.env.NEXT_PUBLIC_URL || "https://tyjuinfosports.com",
      siteName: `${settings[0].company || "Tyju Infosports"}`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${settings[0].company || "Tyju Infosports"}`,
        },
      ],
    }
  };
}
/* export const metadata: Metadata = {
  title: "Tyju infosports - L'actualité sportive",
  description: "TyJu Infosports est un média en ligne dédié à l’actualité sportive, avec un focus particulier sur le sport africain, et plus précisément camerounais. Nous couvrons un large éventail de disciplines, avec pour mission de mettre en lumière les talents, les performances et les événements qui façonnent le paysage sportif du continent. Pensé et créé par deux jeunes passionnés de sport, TyJu Infosports se veut une plateforme dynamique, engagée et proche des réalités locales, pour donner la parole à celles et ceux qui font vibrer le sport au quotidien.",
}
 */

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