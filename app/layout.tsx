import type { Metadata } from "next";
import { Oswald, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/context/providers";
import HydrationZustand from "@/components/ui/hydration";

const oswald = Oswald({ subsets: ["latin"]});
const roboto = Roboto({ subsets: ["latin"], weight: "500" });




export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${roboto.className} ${oswald.className}`}
        suppressHydrationWarning={true}
      >
        <main>
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
