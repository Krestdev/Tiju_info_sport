import Accueil from "@/components/Accueil/Accueil";
import Footbar from "@/components/footbar";
import Navbar from "@/components/navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Accueil />
      <Footbar />
    </div>
  );
}
