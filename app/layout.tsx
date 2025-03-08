import { Oswald, Ubuntu } from "next/font/google";
import "./globals.css";
import Providers from "@/context/providers";
import HydrationZustand from "@/components/ui/hydration";
import { GoogleAnalytics } from "nextjs-google-analytics";

const oswald = Oswald({ subsets: ["latin"]});
const ubuntu = Ubuntu({ subsets: ["latin"], weight: "500" });




export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${ubuntu.className} ${oswald.className}`}
        suppressHydrationWarning={true}
      >
        <main>
        <GoogleAnalytics trackPageViews />
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
