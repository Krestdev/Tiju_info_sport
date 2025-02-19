
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import useStore from "@/context/store"
import { Categorie } from "@/data/temps"
import { getUserFavoriteCategories } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useEffect, useState } from "react"

export function MenuComp() {

    const { dataArticles, currentUser } = useStore()
    const [cate, setCate] = useState<Categorie[]>()
    const [favorite, setFavorite] = useState<Categorie[]>()
    const [message, setMessage] = useState("")

    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles
    })

    useEffect(() => {
        if (articleData.isSuccess) {
            setCate(articleData.data)
        }
        if (currentUser && articleData.data) {
            setFavorite(getUserFavoriteCategories(articleData.data.slice(), currentUser.id))
        }else {
            setMessage("connectez vous pour voir vos favoris")
        }
    }, [articleData.data])

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger className="font-oswald font-medium text-[14px] uppercase cursor-pointer">{"Tous les Sport"}</MenubarTrigger>
                <MenubarContent>
                    {
                        cate?.map((x, i) => (
                            <MenubarItem key={i}>
                                <Link href={`/user/category/${x.nom}`}>{x.nom}</Link>
                            </MenubarItem>
                        ))
                    }
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <Link href={"/user/all-articles"}>
                <MenubarTrigger className="font-oswald font-medium text-[14px] uppercase cursor-pointer">{"Dernières Actualités"}</MenubarTrigger>
                </Link>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className="font-oswald font-medium text-[14px] uppercase cursor-pointer">{"Mes Favoris"}</MenubarTrigger>
                <MenubarContent>
                    {
                        favorite ?
                        favorite?.slice(0, 2).map((x, i) => (
                            <MenubarItem key={i}>
                                <Link href={`/user/category/${x.nom}`}>{x.nom}</Link>
                            </MenubarItem>
                        )):
                        <p>{"connectez vous pour voir vos favoris"}</p>
                    }
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
