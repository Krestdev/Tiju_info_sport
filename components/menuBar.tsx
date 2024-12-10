import { useEffect, useState } from "react";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose
} from "./ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { Article, Users } from "@/data/temps";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/context/store";

export interface Categorie {
    nom: string;
    donnees: Article[];
}

interface Donnee {
    article: Categorie[] | undefined,
    currentUser: Users | null,
}



function MenuBar({ article, currentUser }: Donnee) {

    const { logout } = useStore()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const handleLogin = () => {
        router.push("/logIn")
    }
    const handleLogout = () => {
        setIsOpen(false)
        logout();
        router.push("/logIn");
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="flex flex-row gap-2">
                    <Menu className="h-6 w-6" />
                    <p>{"Menu"}</p>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-8">
                <SheetHeader>
                    <SheetTitle className="flex flex-row gap-1 items-center">
                        <Link onClick={() => setIsOpen(false)} href={''} className="rounded-full bg-gray-100 border border-black w-fit p-1">
                            <User />
                        </Link>
                        {`${currentUser && currentUser.nom}`}
                    </SheetTitle>
                </SheetHeader>
                <Accordion type="single" collapsible className="w-full flex flex-col gap-3">
                    {
                        article?.map(x => {
                            return (
                                <AccordionItem value={`${x.nom}`} key={x.nom}>
                                    <AccordionTrigger className="uppercase">
                                        {x.nom}
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 bg-[#F5F5F5] py-4">
                                        {
                                            x.donnees.map(it => {
                                                return (
                                                    <Link onClick={() => setIsOpen(false)} key={it.id} href={''} className="hover:underline uppercase text border-b border-white pl-2">
                                                        {it.type}
                                                    </Link>
                                                )
                                            })
                                        }
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })
                    }
                    <SheetClose>
                        <Link onClick={() => setIsOpen(false)} className="uppercase hover:underline flex !justify-start border-b pt-4 pb-3" href={'/category'}>{"Toutes Les Categories"}</Link>
                        <Link onClick={() => setIsOpen(false)} className="uppercase hover:underline flex !justify-start border-b pt-4 pb-3" href={'/contact'}>{"Nous contacter"}</Link>
                        <Link onClick={() => setIsOpen(false)} className="uppercase hover:underline flex !justify-start border-b pt-4 pb-3" href={'/about'}>{"À Propos de nous"}</Link>
                        {
                            currentUser ?
                                <Button variant={'link'} onClick={handleLogout} className="uppercase !p-0 flex !justify-start"> {"Se déconnecter"}</Button> :
                                <>
                                    <Link onClick={() => setIsOpen(false)} href={'/logIn'} className="uppercase hover:underline py-2 border-b flex !justify-start">{"Se connecter"}</Link>
                                    <Link onClick={() => setIsOpen(false)} href={'/signUp'} className="uppercase hover:underline py-2 border-b flex !justify-start">{"S'inscrire"}</Link>
                                </>
                        }
                    </SheetClose>
                </Accordion>
            </SheetContent>
        </Sheet>
    );
}

export default MenuBar;
