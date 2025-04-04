
import Footbar from "@/components/footbar";
import Navbar from "@/components/navbar";
import HydrationZustand from "@/components/ui/hydration";
import Providers from "@/context/providers";
import "../globals.css";


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
        {children}
        </div>
        <Footbar />
      </HydrationZustand>
    </Providers>
  );
}
