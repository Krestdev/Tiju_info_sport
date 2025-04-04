import useStore from '@/context/store'
import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { Button } from '../ui/button'
import {
    LuChartColumnDecreasing,
    LuCirclePlus,
    LuCircleUser,
    LuFile,
    LuFiles,
    LuFolder,
    LuFolderOpen,
    LuLayoutGrid,
    LuMegaphone,
    LuMessageSquare,
    LuMessageSquareText,
    LuSettings,
    LuUserRound,
    LuUsersRound
} from "react-icons/lu";
import { Collapsible } from '@radix-ui/react-collapsible';
import { CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBarMobile = () => {

    const items = [
        {
            title: "Tableau de bord",
            url: "/dashboard",
            icon: LuLayoutGrid,
            param: false,
        },
        {
            title: "Articles",
            icon: LuFile,
            param: true,
            parametre: [
                {
                    nom: "Tous les articles",
                    lien: "/dashboard/articles",
                    icon: LuFiles
                },
                {
                    nom: "Ajouter un article",
                    lien: "/dashboard/articles/add-article",
                    icon: LuCirclePlus
                },
            ],
        },
        {
            title: "Commentaires",
            url: "/dashboard/comment",
            icon: LuMessageSquareText,
            param: false,
            parametre: [
                {
                    nom: "Signalés",
                    lien: "/dashboard/comment?tab=signale",
                    icon: LuFiles
                },
                {
                    nom: "Tous les commentaire",
                    lien: "/dashboard/comment",
                    icon: LuFiles
                },
            ],
        },
        {
            title: "Catégories",
            url: "/dashboard/categories",
            icon: LuFolder,
            param: false,
            parametre: [
                {
                    nom: "Toutes les catégories",
                    lien: "/dashboard/categories",
                    icon: LuFolder
                },
            ],
        },
        // {
        //     title: "Abonnements",
        //     url: "/dashboard/subscription",
        //     icon: LucideCircleDollarSign,
        //     param: false,
        //     parametre: [],
        // },
        {
            title: "Publicités",
            url: "/dashboard/pubs",
            icon: LuMegaphone,
            param: false,
            parametre: [],
        },
        {
            title: "Statistiques",
            url: "/dashboard/statistiques",
            icon: LuChartColumnDecreasing,
            param: false,
        },
        {
            title: "Utilisateurs",
            url: "/dashboard/users",
            icon: LuCircleUser,
            param: false,
            parametre: [],
        },
        {
            title: "Administration",
            url: "/dashboard/admin",
            icon: LuUsersRound,
            param: false,
            parametre: [],
        },
        {
            title: "Paramètre du site",
            url: "/dashboard/settings",
            icon: LuSettings,
            param: false,
        },
    ];

    const { isFull, setIsFull, settings } = useStore()
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const currentPath = usePathname();
    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    useEffect(() => {
        if (isFull) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-hidden'); // Nettoyage au démontage
        };
    }, [isFull]);



    return (
        <div className='flex md:hidden flex-col gap-5 py-2 w-full absolute inset-0 top-0 left-0 bg-white h-screen z-50'>
            <div className='w-full flex flex-row justify-between items-center'>
                <div className="flex flex-row items-center gap-3 px-5">
                        <img
                            className="object-cover w-14 h-14"
                            src={settings.logo}
                            alt={settings.compagnyName}
                        />
                     <p className='uppercase font-semibold font-oswald text-[18px] leading-[26.68px] text-[#182067]'>{settings.compagnyName}</p>
                </div>
                <Button variant={"ghost"} onClick={() => setIsFull(false)} className='rounded-full'><MdClose /></Button>
            </div>
            <div className='flex flex-col gap-5 px-5'>
                {
                    items.map((item, index) => {
                        const isOpen = openMenus[item.title] || false;
                        const isActive = currentPath === item.url;
                        return (
                            <div key={index} className='flex flex-col gap-2'>
                                {item.param === false &&
                                    <Link onClick={() => setIsFull(false)} href={`${item.url}`} className={`h-10 ${isActive ? "bg-[#0128AE] text-white" : "text-gray-700"} flex items-center gap-2 px-2 rounded-[6px]`}>
                                        <item.icon className='text-xl' />
                                        <span>{item.title}</span>
                                    </Link>}
                                {
                                    item.param && (
                                        <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleMenu(item.title)} className="group/collapsible">
                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                <CollapsibleTrigger asChild>
                                                    <div className="hover:!bg-blue-50 flex items-center gap-2 px-2 py-2 w-full">
                                                        <item.icon className="size-5" />
                                                        <span>{item.title}</span>
                                                        {isOpen ? <ChevronUp className="ml-auto w-4 h-4 transition-transform group-open/collapsible:rotate-180" /> :
                                                            <ChevronDown className="ml-auto w-4 h-4 transition-transform group-open/collapsible:rotate-180" />
                                                        }
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <div className="mx-0 pl-2">
                                                        {item.parametre?.map((a, i) => {
                                                            const isSubActive = currentPath === a.lien;
                                                            return (
                                                                <div key={i} className={`h-10 ${isSubActive ? "bg-[#0128AE] text-white" : "text-gray-700"} rounded-[6px] px-2`}>
                                                                    <div className={`h-10 ${isSubActive ? 'hover:bg-[#0010CE] hover:text-white' : "hover:bg-blue-50"}`}>
                                                                        <Link onClick={() => setIsFull(false)} className="flex items-center gap-2 py-2 w-full" href={a.lien}>
                                                                            <a.icon className="size-5" />
                                                                            <span>{a.nom}</span>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </CollapsibleContent>
                                            </div>
                                        </Collapsible>
                                    )
                                }
                            </div>
                        )
                    }
                    )
                }
            </div>
        </div>
    )
}

export default SideBarMobile
