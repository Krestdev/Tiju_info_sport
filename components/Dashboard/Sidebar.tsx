"use client";

import {
    Sidebar,
    SidebarContent,
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
    const { settings, isFull, setIsFull } = useStore();
    const currentPath = usePathname();

    return (
        <Sidebar variant="floating" collapsible="icon">
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
                                                    ? "bg-blue-500 text-white"
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
                                    className={`h-14 mt-4 ${isFull
                                            ? "w-full justify-start gap-4 rounded-md hover:bg-blue-50"
                                            : "justify-start pl-2 w-14"
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
            </SidebarInset>
        </Sidebar>
    );
}
