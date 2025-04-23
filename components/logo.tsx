"use client";
import axiosConfig from "@/api/api";
import useStore from "@/context/store";
import { cn, SetImageUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { Skeleton } from "./ui/skeleton";

interface LogoProps {
  showName?: boolean;
  className?:string;
  logoSize?: "size-[40px]"|"size-[50px]";
  textClass?:string;
}

function Logo({ showName = true, className, logoSize="size-[40px]", textClass }: LogoProps) {
  const axiosClient = axiosConfig();
  const {data, isSuccess, isLoading} = useQuery({
    queryKey: ["settings"],
    queryFn: ()=>{
      return axiosClient.get<ConfigProps[]>("param/show");
    }
  })
  if(isLoading){
    return <Skeleton className="w-96 h-10" />
  }
  if(isSuccess){
    return (
      <Link
        href={"/"}
        className={cn("flex flex-row items-center gap-4 text-primary-hover shrink-0", className)}
      >
        <img src={SetImageUrl(data.data[0].imageurl)} alt="Logo" className={cn(logoSize)} />
        {showName && (
          <span className={cn("uppercase font-semibold font-mono text-lg", textClass)}>
            {data.data[0].company}
          </span>
        )}
      </Link>
    );
  }
  return (
    <Link
      href={"/"}
      className={cn("flex flex-row items-center gap-4 text-primary-hover shrink-0", className)}
    >
      <img src={"/logo.png"} alt="Logo" className={cn(logoSize)} />
      {showName && (
        <span className={cn("uppercase font-semibold font-mono text-lg", textClass)}>
          {"Tyju Infosports"}
        </span>
      )}
    </Link>
  );
}

export default Logo;
