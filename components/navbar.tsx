"use client";

import useStore from "@/context/store";
import { usePublishedArticles } from "@/hooks/usePublishedData";
import { CircleUser, User } from "lucide-react";
import Link from "next/link";
import { MenuComp } from "./menu";
import MenuBar from "./menuBar";
import { Button } from "./ui/button";
import Logo from "./logo";

const Navbar = () => {
  const { currentUser } = useStore();

  const { categories } = usePublishedArticles();

  return (
    <div className="sticky top-0 z-20 bg-white">
      <div className="containerBloc h-[60px] grid grid-cols-2 sm:grid-cols-3 gap-2">
        {/* Menu bar goes here */}
        <span className="inline-flex items-center justify-start gap-2">
          <MenuBar />
          <Logo showName={false} className="flex sm:hidden"/>
        </span>
        {/* Logo and Name */}
        <span className="hidden sm:flex flex-row items-center justify-center gap-5">
          <Logo/>
        </span>
        {/* Right side content */}
        <div className="flex flex-row items-center justify-end gap-5">
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex flex-row items-center gap-4">
                <Link href={"/user/profil"}>
                  <Button variant={"outline"}>
                    <CircleUser />
                    {"Profil"}
                  </Button>
                </Link>
              </div>
            ) : (
              <span className="w-full inline-flex gap-2 items-center">
                <Link href={"/user/logIn"}>
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
