"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Dashboard/Sidebar";
import useStore from "@/context/store";
import withAdminAuth from "@/lib/whithAdminAuth";
import { NavAdmin } from "@/components/Dashboard/navAdmin";
import SideBarMobile from "@/components/Dashboard/SIdeBarMobile";

function Layout({ children }: { children: React.ReactNode }) {
  const { isFull, setIsFull } = useStore();
  console.log(isFull);

  return (
    <SidebarProvider defaultOpen={true} open={isFull} onOpenChange={setIsFull}>
      <AppSidebar />
      {isFull && <SideBarMobile />}
      <main className="flex-1 overflow-auto">
        <NavAdmin />
        <div className="relative gap-5 px-5 md:px-7 py-10">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default withAdminAuth(Layout); 
