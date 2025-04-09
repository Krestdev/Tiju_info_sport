
"use client"

import { usePublishedArticles } from "@/hooks/usePublishedData"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"
import { cn } from "@/lib/utils"

export function MenuComp() {

    const { isSuccess, isLoading, categories } = usePublishedArticles();
    const pathname = usePathname();
    const path = pathname.split("/");

    function filterCategoriesWithChildren(data: Category[]): Category[] {
        // Filtrer les catégories parent (qui ont parent === null)
        const parentCategories = data.filter(category => category.parent === null);

        // Filtrer les catégories parent ayant au moins un enfant avec des articles publiés
        return parentCategories.filter(parent =>
            data.some(child =>
                child.parent === parent.id && Array.isArray(child.articles) && child.articles.some(x => x.status === "published")
            )
        );
    }


    return (
        <section className="grid place-items-center border-y overflow-x-auto scrollbar-hide">
            <div className="inline-flex gap-3">
                { isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-20 h-10 rounded-none"/>) }
                {isSuccess &&
                    filterCategoriesWithChildren(categories).map((x, i) => {
                        return (
                            <Link className={cn("font-mono h-10 w-fit shrink-0 px-3 flex items-center", path[1]===x.slug && "bg-primary text-primary-foreground")} key={i} href={`/${x.slug}`}>
                                <span className="font-medium text-[14px] uppercase">{x.title}</span>
                            </Link>
                        )
                    })
                }
            </div>
        </section>
    )
}
