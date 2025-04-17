
"use client"

import { usePublishedArticles } from "@/hooks/usePublishedData"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Skeleton } from "./ui/skeleton"

export function MenuComp() {

    const { isSuccess, isLoading, categories, mainCategories } = usePublishedArticles();
    const pathname = usePathname();
    const path = pathname.split("/");

    function isActive(slug:string, id:number):boolean{
        if(path[1]===slug){
            return true;
        }
        else {
            const activeCategory = categories.find(z=>z.slug === path[1]);
            if(!activeCategory){
                return false;
            } else {
                return id === activeCategory.parent;
            }
        }
    }

    function filterCategoriesWithChildren(data: Category[]): Category[] {
        // Filtrer les catégories parent ayant au moins un enfant avec des articles publiés
        return mainCategories.filter(parent =>
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
                            <Link className={cn("font-mono h-10 w-fit shrink-0 px-3 flex items-center", isActive(x.slug, x.id) && "bg-primary text-primary-foreground")} key={i} href={`/${x.slug}`}>
                                <span className="font-medium text-[14px] uppercase">{x.title}</span>
                            </Link>
                        )
                    })
                }
            </div>
        </section>
    )
}
