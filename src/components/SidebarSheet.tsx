"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function SidebarSheet() {
  return (
    <>
      {/* Hamburger menu for mobile */}
      <Sheet>
        <SheetTrigger className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-zinc-900 rounded-full p-2 shadow">
          <Menu className="w-6 h-6" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 h-full max-w-xs">
          <Sidebar />
        </SheetContent>
      </Sheet>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-80 fixed left-0 top-0 z-40 bg-white dark:bg-zinc-900">
        <Sidebar />
      </aside>
    </>
  );
}
