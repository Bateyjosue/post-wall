"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function SidebarSheet() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden fixed top-4 left-4 z-50">
        <Menu className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
