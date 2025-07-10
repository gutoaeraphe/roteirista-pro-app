
"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AppSidebar } from "./app-sidebar";
import Link from "next/link";
import Image from "next/image";

export function AppHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 fixed top-0 w-full z-30 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 bg-card">
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <SheetDescription className="sr-only">
              Navegue pelas diferentes seções do aplicativo Roteirista Pro.
            </SheetDescription>
            <AppSidebar isMobile={true}/>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <Link href="/painel-de-roteiros" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Roteirista Pro" width={150} height={38} />
        </Link>
      </div>
    </header>
  );
}
