import { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "./ui/sheet";
import { Button } from "@/components/ui/button";
import { BarChart, Menu, Minus, Plus, User } from "lucide-react";
import { Users } from "@/data/temps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/context/store";
import { IoMdArrowDropright } from "react-icons/io";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { ResponsiveContainer, Bar } from "recharts";
import { data } from "tailwindcss/defaultTheme";
import { LuX } from "react-icons/lu";

export interface Categorie {
  nom: string;
  donnees: Article[];
}

interface Donnee {
  article: Category[] | undefined;
}

function MenuBar({ article }: Donnee) {
  const { logout, settings, favorite, currentUser } = useStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [photo, setPhoto] = useState(currentUser?.photo || settings.noPhoto);

  const handleLogin = () => {
    setIsOpen(false);
    router.push("/user/logIn");
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push("/user/logIn");
  };

  useEffect(() => {
    if (currentUser?.photo) {
      setPhoto(currentUser.photo);
    }
  }, [currentUser]);

  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost">
          <Menu className="h-6 w-6" />
          <span className="hidden md:flex">{"Menu"}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-screen md:w-[360px] rounded-none px-5 pb-10 gap-5 overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-between p-0">
            <Link
              href={"/"}
              className="flex flex-row items-center gap-4 text-[#182067]"
            >
              <img src="/logo.png" alt="Logo" className="size-[50px]" />
              <p className="font-semibold font-oswald text-[18px] leading-[26.68px] flex">
                {"TYJU INFO SPORTS"}
              </p>
            </Link>
            <DrawerClose asChild>
              <LuX className="size-5 cursor-pointer hover:bg-gray-50" />
            </DrawerClose>
          </DrawerTitle>
        </DrawerHeader>
        {/* <Button className="font-oswald font-medium text-[20px] uppercase w-full rounded-none px-2 py-4 gap-2">{"S'abonner"}</Button> */}
        {currentUser ? (
          <Link href={"/user/profil"}>
            <Button variant={"outline"}>{"profil"}</Button>
          </Link>
        ) : (
          <Link
            href={"/user/login"}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Button
              onClick={handleLogin}
              variant={"outline"}
              className="font-oswald font-medium text-[20px] uppercase w-full rounded-none px-2 py-4 gap-2"
            >
                <User />
              {"se connecter"}
            </Button>
          </Link>
        )}
        <div className="flex flex-col">
          <div className="flex px-2 py-4 gap-2 bg-[#EEEEEE] justify-center">
            <p className="font-oswald font-medium text-[20px] uppercase text-[#545454]">
              {"À la une"}
            </p>
          </div>
          {article?.map((x, i) => (
            <Link
              onClick={() => setIsOpen(false)}
              href={`/user/${x.title}`}
              key={i}
              className="flex px-2 py-4 gap-2 border-b border-[#A1A1A1] justify-center"
            >
              <p className="font-oswald font-medium text-[20px] uppercase text-[#000000]">
                {x.title}
              </p>
            </Link>
          ))}
        </div>
        {/* <div className="flex flex-col">
          <div className="flex px-2 py-4 gap-2 bg-[#FF0068] justify-center">
            <p className="font-oswald font-medium text-[20px] uppercase text-[#FFFFFF]">
              {"Favoris"}
            </p>
          </div>
          {article?.map((x, i) => (
            <Link
              onClick={() => setIsOpen(false)}
              href={`/user/${x.title}`}
              key={i}
              className="flex px-2 py-4 gap-2 border-b border-[#A1A1A1] justify-center"
            >
              <p className="font-oswald font-medium text-[20px] uppercase text-[#FFFFFFZ]">
                {x.title}
              </p>
            </Link>
          ))}
        </div> */}
        <div className="flex flex-col">
          <div className="flex px-2 py-4 gap-2 bg-[#182067] justify-center">
            <p className="font-oswald font-medium text-[20px] uppercase text-[#FFFFFF]">
              {"Sport"}
            </p>
          </div>
          {article?.slice(0, 4).map((x, i) => (
            <Link
              onClick={() => setIsOpen(false)}
              href={`/user/${x.title}`}
              key={i}
              className="flex px-2 py-4 gap-2 border-b border-[#A1A1A1] justify-center"
            >
              <p className="font-oswald font-medium text-[20px] uppercase text-[#000000]">
                {x.title}
              </p>
            </Link>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MenuBar;
