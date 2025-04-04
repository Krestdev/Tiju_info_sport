import Accueil from "@/components/Accueil/Accueil";
import Footbar from "@/components/footbar";
import Navbar from "@/components/navbar";


export default function HomePage() {

  return (
    <div>
      <Navbar />
      <div className="pt-[65px] md:pt-0">
        <Accueil />
      </div>
      <Footbar />
    </div>
  );
}
