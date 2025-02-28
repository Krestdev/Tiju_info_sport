"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Dashboard/Sidebar";
import useStore from "@/context/store";
import withAdminAuth from "@/lib/whithAdminAuth";
import { NavAdmin } from "@/components/Dashboard/navAdmin";

function Layout({ children }: { children: React.ReactNode }) {
  const { isFull, setIsFull } = useStore();

  return (
    <SidebarProvider open={isFull} onOpenChange={setIsFull}>
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <NavAdmin />
        <div className="gap-5 px-7 py-10">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default withAdminAuth(Layout); 
