
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
        <section className="grid place-items-center border-y overflow-x-auto scrollbar-hide">
            <div className="inline-flex  gap-3">
                    {isSuccess && data.data.length > 0 &&
                            data.data.map((x, i) => {
                                    return (
                                        <Link className={`${decodeURIComponent(selected) === x.title && "bg-[#0128AE] text-white"} font-oswald h-10 w-fit shrink-0 px-3 flex items-center`} key={i} href={`/user/${x.title}`}>
                                            <span className="font-medium text-[14px] uppercase">{x.title}</span>
                                        </Link>
                                    )
                                })
                            }
            </div>
        </section>
    )
}
