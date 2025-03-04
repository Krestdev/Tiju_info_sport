
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

    return (
        <div className="flex items-start md:items-center justify-center border-y py-1 my-3">
            <div className="overflow-x-auto scrollbar-hide">
                <div className="md:max-w-[1280px] mx-20 w-full flex flex-row items-start md:items-center justify-center gap-3 font-medium text-[14px] uppercase">
                    {
                        cate?.map((x, i) => (
                            <Button variant={"ghost"} key={i}>
                                <Link href={`/user/${x.nom}`}>{x.nom}</Link>
                            </Button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
