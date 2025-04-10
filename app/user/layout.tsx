
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
        <div className="min-h-[calc(100vh-500px)]">
        {children}
        </div>
  );
}
