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
import { IoMdArrowDropright } from "react-icons/io";

export interface Categorie {
    nom: string;
    donnees: Article[];
}

interface Donnee {
    article: Categorie[] | undefined,
    currentUser: Users | null,
}



function MenuBar({ article, currentUser }: Donnee) {

    const { logout, settings } = useStore()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);
    const [photo, setPhoto] = useState(currentUser?.photo || settings.noPhoto)

    const closeSheet = () => setIsOpen(false);

    const handleLogin = () => {
        router.push("/user/logIn")
    }

    const handleLogout = () => {
        setIsOpen(false)
        logout();
        router.push("/user/logIn");
    };

    useEffect(() => {
        if (currentUser?.photo) {
            setPhoto(currentUser.photo)
        }
    }, [currentUser])

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="flex" asChild>
                <Button variant="ghost" className="flex !pl-0 flex-row gap-2">
                    <Menu className="h-6 w-6" />
                    <p className="hidden md:flex">{"Menu"}</p>
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className="flex flex-col gap-8">
                <SheetHeader>
                    {
                        currentUser ?
                            <SheetTitle className="flex flex-row gap-1 items-center">
                                <Link onClick={() => setIsOpen(false)} href={'/user/profil'} className="flex flex-row gap-2 items-center" >
                                    <img
                                        className="w-10 h-10 rounded-full object-cover"
                                        src={photo}
                                        alt="Aperçu de la photo"
                                    />
                                    {`${currentUser && currentUser.nom}`}
                                </Link>
                            </SheetTitle> :
                            <SheetTitle className="flex flex-row gap-1 items-center">
                                <Link onClick={() => setIsOpen(false)} href={'/user/logIn'} className="flex flex-row gap-2 items-center" >
                                    <img
                                        className="w-10 h-10 rounded-full object-cover"
                                        src={photo}
                                        alt="Aperçu de la photo"
                                    />
                                    Se Connecter
                                </Link>
                            </SheetTitle>
                    }
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
                                                    <Link onClick={() => setIsOpen(false)} key={it.id} href={''} className="flex gap-1 items-center hover:underline uppercase text border-b border-white pl-2">
                                                        <IoMdArrowDropright /> {it.type}
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
                        <Link onClick={() => setIsOpen(false)} className="uppercase hover:underline flex !justify-start border-b pt-4 pb-3" href={'/user/category'}>{"Toutes Les Categories"}</Link>
                        <Link onClick={() => setIsOpen(false)} className="uppercase hover:underline flex !justify-start border-b pt-4 pb-3" href={'/user/contact'}>{"Nous contacter"}</Link>
                        <Link onClick={() => setIsOpen(false)} className="uppercase hover:underline flex !justify-start border-b pt-4 pb-3" href={'/user/about'}>{"À Propos de nous"}</Link>
                        {
                            currentUser ?
                                <div onClick={handleLogout} className="uppercase !p-0 flex !justify-start mt-2 cursor-pointer"> {"Se déconnecter"}</div> :
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
