import { Oswald, Ubuntu } from "next/font/google";
import "./globals.css";
import Providers from "@/context/providers";
import HydrationZustand from "@/components/ui/hydration";
import Script from "next/script";
import { Metadata } from "next";

const oswald = Oswald({ subsets: ["latin"] });
const ubuntu = Ubuntu({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
  title: "Tyju Info Sport",
  description: "",
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
        className={`${ubuntu.className} ${oswald.className}`}
        suppressHydrationWarning={true}
      >
        <main>
          {/* <GA /> */}
          <Providers>
            <HydrationZustand>
              {children}
            </HydrationZustand>
          </Providers>
        </main>
      </body>
    </html>
  );
}