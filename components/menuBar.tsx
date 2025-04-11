'use client'
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
import { usePathname, useRouter } from "next/navigation";
import useStore from "@/context/store";
import Logo from "./logo";
import { usePublishedArticles } from "@/hooks/usePublishedData";
import { cn } from "@/lib/utils";


function MenuBar() {
  const { logout, favorite, activeUser, setActiveUser } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const path = pathname.split("/");
  const [isOpen, setIsOpen] = useState(false);
  const {mainCategories,childCategories} = usePublishedArticles();


  const handleLogout = () => {
    setIsOpen(false);
    logout();
    setActiveUser();
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
          {activeUser ? (
            <div className="grid gap-2">
            <Link href={"/profil"}>
              <Button variant={"outline"} className="w-full">{"profil"}</Button>
            </Link>
              <Button onClick={handleLogout}>{"se déconnecter"}</Button>
            </div>
          ) : (
            <Link
              href={"/connexion"}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Button
                variant={"outline"}
                className="w-full"
              >
                  <CircleUser />
                {"se connecter"}
              </Button>
            </Link>
          )}
          {mainCategories.length > 0 && 
          <div className="flex flex-col divide-y">
            <span className="px-5 py-2 text-sm font-mono font-medium text-paragraph uppercase inline-flex items-center justify-start">{"sports"}</span>
            {mainCategories.map(x=>
              <Link key={x.id} href={`/${x.slug}`} className={cn(buttonVariants({variant:"ghost"}), "justify-start", path.find(z=>decodeURIComponent(z)===x.slug.trim()) && "!bg-primary hover:bg-primary-hover text-primary-foreground hover:text-primary-foreground")}>
                <span className="size-1 bg-secondary rounded-full"/>
                {x.title}
              </Link>
            )}
          </div>
          }
          {childCategories.length > 0 && 
            <div className="flex flex-col divide-y">
              <span className="px-5 py-2 text-sm font-mono font-medium text-paragraph uppercase inline-flex items-center justify-start">{"plus de catégories"}</span>
              {childCategories.map(x=>
                <Link key={x.id} href={`/${x.slug}`} className={cn(buttonVariants({variant:"ghost"}), "justify-start", path.find(z=>decodeURIComponent(z)===x.slug.trim()) && "!bg-primary hover:bg-primary-hover text-primary-foreground hover:text-primary-foreground")}>
                <span className="size-1 bg-secondary rounded-full"/>
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
