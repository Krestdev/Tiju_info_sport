
"use client"

import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import useStore from "@/context/store"
import { Categorie } from "@/data/temps"
import { getUserFavoriteCategories } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"

export function MenuComp() {

    const { dataArticles } = useStore()
    const [cate, setCate] = useState<Categorie[]>()

    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles
    })

    useEffect(() => {
        if (articleData.isSuccess) {
            setCate(articleData.data)
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
        return cate?.flatMap(x => x.nom).includes(selected);
    };

    console.log(checkUserCategory(), selected);



    return (
        <div className="flex items-start md:items-center justify-center border-y my-3">
            <div className="overflow-x-auto scrollbar-hide">
                <div className="md:max-w-[1280px] mx-20 w-full flex flex-row items-start md:items-center justify-center gap-3 font-medium text-[14px] uppercase">
                    {
                        cate?.map((x, i) => (
                            <Link className={`${selected === x.nom ? "bg-[#0128AE] text-white" : ""} font-oswald h-10 flex items-center px-3 py-2 gap-2`} key={i} href={`/user/${x.nom}`}>{x.nom}</Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
