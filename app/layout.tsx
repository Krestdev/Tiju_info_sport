import type { Metadata } from "next";
import { DM_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/context/providers";
import HydrationZustand from "@/components/ui/hydration";
import Navbar from "@/components/navbar";
import Footbar from "@/components/footbar";
import { FormProvider } from "react-hook-form";


const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <header>
          <title>{"Tyju Info Sprot"}</title>
        </header>
        <main>
          <Providers>
            <HydrationZustand>
              <Navbar />
              {children}
              <Footbar />
            </HydrationZustand>
          </Providers>
        </main>
      </body>
    </html>
  );
}
