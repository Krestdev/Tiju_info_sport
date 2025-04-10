"use client";
import useStore from "@/context/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface LogoProps {
  showName?: boolean;
  className?:string;
  logoSize?: "size-[40px]"|"size-[50px]";
  textClass?:string;
}

function Logo({ showName = true, className, logoSize="size-[40px]", textClass }: LogoProps) {
  const { settings } = useStore();
  return (
    <Link
      href={"/"}
      className={cn("flex flex-row items-center gap-4 text-primary-hover shrink-0", className)}
    >
      <img src={settings.logo} alt="Logo" className={cn(logoSize)} />
      {showName && (
        <span className={cn("uppercase font-semibold font-mono text-lg", textClass)}>
          {settings.compagnyName}
        </span>
      )}
    </Link>
  );
}

export default Logo;
