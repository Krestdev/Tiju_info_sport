"use client"

import React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Dashboard/Sidebar"
import useStore from "@/context/store"


export default function Layout({ children }: { children: React.ReactNode }) {

  const {isFull, setIsFull} = useStore()
  return (
    <SidebarProvider open={isFull} onOpenChange={setIsFull}>
      <AppSidebar />
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {children}
      </main>
    </SidebarProvider>
  )
}

