
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

    const [cate, setCate] = useState<Category[]>()

    const queryClient = useQueryClient();
    const axiosClient = axiosConfig();

    const articleData = useQuery({
        queryKey: ["categoryv"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Category[]>>(
                `/category`
            );
        },
    });

    useEffect(() => {
        if (articleData.isSuccess) {
            setCate(articleData.data.data.filter(x => x.articles.length > 0))
        }
    }, [articleData.data])


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
        return cate?.flatMap(x => x.title).includes(selected);
    };    

    return (
        <div className="flex items-start md:items-center justify-center border-y my-3">
            <div className="overflow-x-auto scrollbar-hide">
                {cate ?
                    <div className="md:max-w-[1280px] mx-20 w-full flex flex-row items-start md:items-center justify-center gap-3 font-medium text-[14px] uppercase">
                        {
                            cate?.map((x, i) => {
                                return (
                                    <Link className={`${decodeURIComponent(selected) === x.title ? "bg-[#0128AE] text-white" : ""} font-oswald h-10 w-fit flex items-center py-2 gap-2`} key={i} href={`/user/${x.title}`}>
                                        <p className="">{x.title}</p>
                                    </Link>
                                )
                            })
                        }
                    </div> : ""}
            </div>
        </div>
    )
}
