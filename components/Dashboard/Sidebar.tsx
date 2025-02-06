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
} from "@/components/ui/sidebar";
import { MdDashboard } from "react-icons/md";
import { MdOutlineSportsVolleyball } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { FaAdversal } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { MdAccountBalanceWallet } from "react-icons/md";
import useStore from "@/context/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { FaChevronLeft } from "react-icons/fa";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AiOutlineLogout } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Menu items.
const items = [
    {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: MdDashboard,
    },
    {
        title: "Articles",
        url: "/dashboard/articles",
        icon: MdOutlineSportsVolleyball,
    },
    {
        title: "Utilisateurs",
        url: "/dashboard/users",
        icon: FaUserFriends,
    },
    {
        title: "Commentaires",
        url: "/dashboard/comment",
        icon: FaCommentAlt,
    },
    {
        title: "Publicités",
        url: "/dashboard/pubs",
        icon: FaAdversal,
    },
    {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: IoIosNotifications,
    },
    {
        title: "Abonnements",
        url: "/dashboard/subscription",
        icon: MdAccountBalanceWallet,
    },
];

export function AppSidebar() {
    const { settings, isFull, setIsFull, logoutAdmin } = useStore();
    const currentPath = usePathname();

    const handleLogout = () => {
        logoutAdmin()
        toast.success("Deconnecté avec succès");
    }

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarInset>
                <div className="flex items-center justify-center">
                    <SidebarHeader className="h-[150px] w-[150px]">
                        <img
                            sizes="20px"
                            className="w-full object-cover"
                            src={settings.logo}
                            alt=""
                        />
                    </SidebarHeader>
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => {
                                    const isActive = currentPath === `${item.url}`;
                                    return (
                                        <SidebarMenuItem
                                            key={item.title}
                                            className={`${isActive
                                                ? "bg-[#012BAE] text-white"
                                                : "text-gray-700"
                                                } rounded-md`}
                                        >
                                            <SidebarMenuButton className={`${isActive ? 'hover:bg-blue-400 hover:text-white' : "hover:bg-blue-50"} h-14`} asChild>
                                                <Link href={`${item.url}`}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                                <Button
                                    onClick={setIsFull}
                                    variant={"ghost"}
                                    size={!isFull ? "icon" : "default"}
                                    className={`h-14 mt-4 hover:!bg-blue-50 ${isFull
                                        ? "w-full justify-start gap-4 rounded-md"
                                        : "justify-start  size-[30px] pl-2"
                                        }`}
                                >
                                    <ChevronRight
                                        size={20}
                                        className={`transition-all duration-300 ease-linear ${isFull ? " scale-x-[-1]" : "scale-x-[1]"}`}
                                    />
                                    {isFull && <span>Réduire</span>}{" "}
                                </Button>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="pb-20">
                    <Button onClick={() => handleLogout()} className="bg-red-500 font-bold">{isFull ? "Déconnexion" : <AiOutlineLogout />}</Button>
                </SidebarFooter>
            </SidebarInset>
         </Sidebar>

    );
}
