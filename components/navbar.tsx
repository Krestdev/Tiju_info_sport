"use client";

import useStore from "@/context/store";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, CircleUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import { MenuComp } from "./menu";
import MenuBar from "./menuBar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useState } from "react";

const Navbar = () => {
  const { logout, activeUser, setActiveUser } = useStore();
  const pathname = usePathname();
  const path = pathname.split("/");
  const isDashboard = path.includes("dashboard");
  const [open, setOpen] = useState(false);

  const closeDropdown = () =>{
    setOpen(false);
  }

  const disconnect = ()=>{
    signOut();
    closeDropdown();
  }

  const signOut = () => {
    logout();
    setActiveUser();
    toast({
      title: "Vous êtes déconnecté !",
      description: "Vous naviguez actuellement en tant qu'invité."
    })
  }

  if (isDashboard) {
    return null
  }

  return (
    <div className="sticky top-0 z-20 bg-white">
      <div className="containerBloc h-[60px] grid grid-cols-2 sm:grid-cols-3 gap-2">
        {/* Menu bar goes here */}
        <span className="inline-flex items-center justify-start gap-2">
          <MenuBar />
          <Logo showName={false} className="flex sm:hidden" />
        </span>
        {/* Logo and Name */}
        <span className="hidden sm:flex flex-row items-center justify-center gap-5">
          <Logo />
        </span>
        {/* Right side content */}
        <div className="flex flex-row items-center justify-end gap-5">
          <div className="flex items-center gap-3">
            {activeUser ? (
              <div className="flex flex-row items-center gap-3">
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger className="inline-flex gap-2 items-center">
                  <img src={activeUser?.image?.id ? `${process.env.NEXT_PUBLIC_API}image/${activeUser.image.id}` : "/images/default-photo.webp"} className='size-10 rounded-full object-cover' />
                  <span className="inline-flex size-6 items-center justify-center"><ChevronDown size={16}/></span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>{"Mon Compte"}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem><Link href={"/profil"} className="w-full" onClick={closeDropdown}>{"Profil"}</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={disconnect}>{"Déconnexion"}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="hidden lg:inline-flex" onClick={signOut}>{"déconnexion"}</Button>
              </div>
            ) : (
              <span className="w-full inline-flex gap-2 items-center">
                <Link href={"/connexion"}>
                  <Button variant={"ghost"}>
                    <CircleUser />
                    {"se connecter"}
                  </Button>
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Categories are displayed here */}
      <MenuComp />
    </div>
  );
};

export default Navbar;
