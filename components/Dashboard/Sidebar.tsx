"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useStore from "@/context/store";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight, ChevronUp, LucideCircleDollarSign } from "lucide-react";
import { AiOutlineLogout } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useEffect, useState } from "react";

// Menu items.
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

export function AppSidebar() {
    const { settings, isFull, setIsFull, logoutAdmin } = useStore();
    const currentPath = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const handleLogout = () => {
        logoutAdmin()
        toast.success("Déconnecté avec succès");
    }

    return (
        <Sidebar variant="sidebar" collapsible="icon"  >
            <SidebarInset className="max-w-[320px] w-full">
                <div className="flex flex-row items-center gap-3">
                    <SidebarHeader className="h-[60px] w-[60px]">
                        <img
                            sizes="20px"
                            className="w-full object-cover"
                            src={settings.logo}
                            alt={settings.compagnyName}
                        />
                    </SidebarHeader>
                    {isFull && <p className='uppercase font-semibold font-oswald text-[18px] leading-[26.68px] text-[#182067]'>{settings.compagnyName}</p>}
                </div>
                <SidebarContent className="max-w-[320px] w-full">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => {
                                    const isActive = currentPath === item.url;
                                    const isOpen = openMenus[item.title] || false;
                                    return (
                                        item.param ? (
                                            <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleMenu(item.title)} className="group/collapsible">
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton className="hover:!bg-blue-50 flex items-center gap-2 py-2 w-full">
                                                            <item.icon className="size-5" />
                                                            <span>{item.title}</span>
                                                            {isOpen ? <ChevronUp className="ml-auto w-4 h-4 transition-transform group-open/collapsible:rotate-180" /> :
                                                                <ChevronDown className="ml-auto w-4 h-4 transition-transform group-open/collapsible:rotate-180" />
                                                            }
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub className="mx-0 pl-2">
                                                            {item.parametre?.map(a => {
                                                                const isSubActive = currentPath === a.lien;
                                                                return (
                                                                    <SidebarMenuSubItem key={a.nom} className={`h-10 ${isSubActive ? "bg-[#0128AE] text-white" : "text-gray-700"} rounded-[6px]`}>
                                                                        <SidebarMenuButton className={`h-10 ${isSubActive ? 'hover:bg-[#0010CE] hover:text-white' : "hover:bg-blue-50"}`} asChild>
                                                                            <Link className="flex items-center gap-2 py-2 w-full" href={a.lien}>
                                                                                <a.icon className="size-5" />
                                                                                <span>{a.nom}</span>
                                                                            </Link>
                                                                        </SidebarMenuButton>
                                                                    </SidebarMenuSubItem>
                                                                );
                                                            })}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuItem>
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuItem key={item.title} className={`h-10 ${isActive ? "bg-[#0128AE] text-white" : "text-gray-700"} rounded-[6px]`}>
                                                <SidebarMenuButton className={`h-10 ${isActive ? 'hover:bg-[#0010CE] hover:text-white' : "hover:bg-blue-50"}`} asChild>
                                                    <Link href={`${item.url}`}>
                                                        <item.icon className="size-5" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    );
                                })}
                                {/* <Button onClick={setIsFull} variant="ghost" size={!isFull ? "icon" : "default"} className={`h-10 mt-4 hover:!bg-blue-50 ${isFull ? "w-full justify-start gap-4 rounded-md" : "justify-start size-[30px] pl-2"}`}>
                                    <ChevronRight size={20} className={`transition-all duration-300 ease-linear ${isFull ? " scale-x-[-1]" : "scale-x-[1]"}`} />
                                    {isFull && <span>{"Réduire"}</span>}
                                </Button> */}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="pb-20">
                    <Button onClick={handleLogout} className="bg-red-500 font-bold">{isFull ? "Déconnexion" : <AiOutlineLogout />}</Button>
                </SidebarFooter>
            </SidebarInset>
        </Sidebar>
    );
}
