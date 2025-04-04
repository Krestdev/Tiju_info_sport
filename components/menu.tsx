
"use client"

import useStore from "@/context/store"
import { Categorie } from "@/data/temps"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import axiosConfig from "@/api/api"
import { AxiosResponse } from "axios"

export function MenuComp() {

    const axiosClient = axiosConfig();

    const {isSuccess, data, isError, isLoading} = useQuery({
        queryKey: ["categoryv"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Category[]>>(
                `/category`
            );
        },
    });

    const [selected, setSelected] = useState("");

    
    const pathname = usePathname();
    
    useEffect(() => {
        const segments = pathname.split("/");
        
        if (segments.length > 2 && segments[1] === "user") {
            const userCategory = segments[2];
            setSelected(userCategory);
        }
    }, [pathname]);
    
    const checkUserCategory = () => {
        return isSuccess ? data.data.flatMap(x => x.title).includes(selected) : false;
    };    

    return (
        <div className="flex items-start md:items-center justify-center border-y my-3">
            <div className="overflow-x-auto scrollbar-hide">
                {isSuccess && data.data.length > 0 &&
                    <div className="md:max-w-[1280px] mx-20 w-full flex flex-row items-start md:items-center justify-center gap-3 font-medium text-[14px] uppercase">
                        {
                           data.data.filter(x => x.parent === null).map((x, i) => {
                                return (
                                    <Link className={`${decodeURIComponent(selected) === x.title && "bg-[#0128AE] text-white"} font-oswald h-10 w-fit shrink-0 px-3 flex items-center`} key={i} href={`/user/${x.title}`}>
                                        <span>{x.title}</span>
                                    </Link>
                                )
                            })
                        }
                    </div>}
            </div>
        </div>
    )
}
