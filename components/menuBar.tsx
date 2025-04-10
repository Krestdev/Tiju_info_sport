import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "./ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { CircleUser, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/context/store";
import Logo from "./logo";
import { usePublishedArticles } from "@/hooks/usePublishedData";
import { cn } from "@/lib/utils";


function MenuBar() {
  const { logout, favorite, currentUser } = useStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {mainCategories} = usePublishedArticles();

  const handleLogin = () => {
    setIsOpen(false);
    router.push("/user/logIn");
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push("/user/logIn");
  };


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu />
          <span className="hidden sm:flex">{"Menu"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="flex flex-col gap-4 overflow-y-auto">
        <SheetHeader >
          <SheetTitle>
            <Logo/>
          </SheetTitle>
        </SheetHeader>
        {/* <Button className="font-oswald font-medium text-[20px] uppercase w-full rounded-none px-2 py-4 gap-2">{"S'abonner"}</Button> */}
        {currentUser ? (
          <Link href={"/user/profil"}>
            <Button variant={"outline"} className="w-full">{"profil"}</Button>
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
              className="w-full"
            >
                <CircleUser />
              {"se connecter"}
            </Button>
          </Link>
        )}
        {mainCategories && 
        <div className="flex flex-col divide-y">
          {mainCategories.map(x=>
            <Link key={x.id} href={`/${x.slug}`} className={cn(buttonVariants({variant:"ghost"}))}>
              {x.title}
            </Link>
          )}
        </div>
        }
      </SheetContent>
    </Sheet>
  );
}

export default MenuBar;
