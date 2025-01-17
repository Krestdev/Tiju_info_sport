"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Dashboard/Sidebar";
import useStore from "@/context/store";
import withAdminAuth from "@/lib/whithAdminAuth";

function Layout({ children }: { children: React.ReactNode }) {
  const { isFull, setIsFull } = useStore();

  return (
    <SidebarProvider open={isFull} onOpenChange={setIsFull}>
      <AppSidebar />
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {children}
      </main>
    </SidebarProvider>
  );
}

export default withAdminAuth(Layout); // Application du HOC
