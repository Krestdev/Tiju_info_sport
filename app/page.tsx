import Accueil from "@/components/Accueil/Accueil";
import Footbar from "@/components/footbar";
import Navbar from "@/components/navbar";


export default function HomePage() {

  return (
    <div>
      <Navbar />
      <div className="pt-0 md:pt-[65px]">
        <Accueil />
      </div>
      <Footbar />
    </div>
  );
}
