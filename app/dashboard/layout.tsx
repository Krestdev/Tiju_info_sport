"use client";

import React, { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Dashboard/Sidebar";
import useStore from "@/context/store";
import { NavAdmin } from "@/components/Dashboard/navAdmin";
import SideBarMobile from "@/components/Dashboard/SIdeBarMobile";
import { useRouter } from "next/navigation";
import withRoleAuth from "@/lib/whithAdminAuth";

function Layout({ children }: { children: React.ReactNode }) {
  const { isFull, setIsFull, activeUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (activeUser && activeUser.role === "editor") {
      router.push("/dashboard/articles");
    }
  }, [activeUser, router]);

  // if (activeUser?.role === "editor") {
  //   return <h4>Chargement...</h4>; 
  // }

  return (
    <SidebarProvider defaultOpen={true} open={isFull} onOpenChange={setIsFull}>
      <AppSidebar />
      <SideBarMobile />
      <main className="flex-1 overflow-auto">
        <NavAdmin />
        <div className="relative gap-5 px-5 md:px-7 py-10">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default withRoleAuth(Layout, "editor");
