
"use client"

import { usePublishedArticles } from "@/hooks/usePublishedData"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"

export function MenuComp() {

    const { isSuccess, isError, isLoading, categories } = usePublishedArticles()

    const [selected, setSelected] = useState("");


    const pathname = usePathname();

    useEffect(() => {
        const segments = pathname.split("/");

        if (segments.length > 2 && segments[1] === "user") {
            const userCategory = segments[2];
            setSelected(userCategory);
        }
    }, [pathname]);

    function filterCategoriesWithChildren(categories: Category[]): Category[] {
        // Filtrer les catégories parent (qui ont parent === null)
        const parentCategories = categories.filter(category => category.parent === null);

        // Filtrer les catégories parent ayant au moins un enfant avec des articles
        return parentCategories.filter(parent =>
            categories.some(child =>
                child.parent === parent.id && Array.isArray(child.articles) && child.articles.length > 0
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
