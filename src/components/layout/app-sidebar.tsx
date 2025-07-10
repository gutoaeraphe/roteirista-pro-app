// src/components/layout/app-sidebar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMain,
  SidebarNav,
  SidebarNavHeader,
  SidebarNavHeaderTitle,
  SidebarNavLink,
  SidebarFooter,
} from "@/components/layout/sidebar-layout";
import {
  FileUp,
  BarChart3,
  GitCommitHorizontal,
  Users,
  Scale,
  Lightbulb,
  Stethoscope,
  Presentation,
  PenSquare,
  Youtube,
  HelpCircle,
  Film,
  Clapperboard,
  LogOut,
  UserCircle,
  FileText
} from "lucide-react";
import { useScript } from "@/context/script-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const navItems = [
  {
    title: "Painel",
    href: "/painel-de-roteiros",
    icon: FileUp,
  },
  {
    title: "Análises",
    items: [
      {
        title: "Estrutura de Roteiro",
        href: "/estrutura-de-roteiro",
        icon: BarChart3,
      },
      {
        title: "Jornada do Herói",
        href: "/jornada-do-heroi",
        icon: GitCommitHorizontal,
      },
      {
        title: "Análise de Personagens",
        href: "/analise-de-personagens",
        icon: Users,
      },
      {
        title: "Teste de Representatividade",
        href: "/teste-de-representatividade",
        icon: Scale,
      },
      {
        title: "Análise de Mercado",
        href: "/analise-de-mercado",
        icon: Lightbulb,
      },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      {
        title: "Script Doctor",
        href: "/script-doctor",
        icon: Stethoscope,
      },
      {
        title: "Gerador de Pitching",
        href: "/gerador-de-pitching",
        icon: Presentation,
      },
      {
        title: "Gerador de Argumento",
        href: "/gerador-de-argumento",
        icon: PenSquare,
      },
    ],
  },
];

const learnMoreItems = [
    {
      title: "Masterclass",
      href: "/masterclass",
      icon: Youtube,
    },
    {
      title: "Ajuda",
      href: "/ajuda",
      icon: HelpCircle,
    },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeScript, loading: scriptLoading } = useScript();
  const { user, loading: authLoading } = useAuth();
  const [hasGeneratedArgument, setHasGeneratedArgument] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedArgument = localStorage.getItem('generatedArgument');
        setHasGeneratedArgument(!!storedArgument);
    }
  }, [pathname]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };
  
  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "?";
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Clapperboard className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold text-primary">
            Roteiro Pro
            </h1>
        </div>
      </SidebarHeader>
      <SidebarMain className="flex flex-col flex-grow">
        <SidebarNav>
          {navItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.items ? (
                <>
                  <SidebarNavHeader>
                    <SidebarNavHeaderTitle>{section.title}</SidebarNavHeaderTitle>
                  </SidebarNavHeader>
                  {section.items.map((item) => (
                    <SidebarNavLink
                      key={item.href}
                      href={item.href}
                      active={pathname === item.href}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </SidebarNavLink>
                  ))}
                  {hasGeneratedArgument && section.title === "Ferramentas" && (
                     <SidebarNavLink
                        href="/argumento-gerado"
                        active={pathname === "/argumento-gerado"}
                      >
                        <FileText className="w-4 h-4" />
                        Argumento Gerado
                      </SidebarNavLink>
                  )}
                </>
              ) : (
                <SidebarNavLink
                  href={section.href}
                  active={pathname === section.href}
                >
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </SidebarNavLink>
              )}
            </div>
          ))}
          <div>
            <SidebarNavHeader>
                <SidebarNavHeaderTitle>Aprenda Mais</SidebarNavHeaderTitle>
            </SidebarNavHeader>
            {learnMoreItems.map((item) => (
                 <SidebarNavLink
                    key={item.href}
                    href={item.href}
                    active={pathname === item.href}
                    >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                </SidebarNavLink>
            ))}
          </div>
        </SidebarNav>
      </SidebarMain>
      <SidebarFooter>
        <div className="border-t border-border -mx-4 mb-2"></div>
         {scriptLoading || authLoading ? (
          <div className="p-4">Carregando...</div>
        ) : activeScript ? (
          <div className="px-4 mb-2">
            <p className="text-xs text-muted-foreground mb-1">Roteiro Ativo</p>
            <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
              <Film className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold truncate text-sm">{activeScript.name}</p>
                <p className="text-xs text-muted-foreground">{activeScript.format} • {activeScript.genre}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 mb-2">
            <Link href="/painel-de-roteiros" passHref>
              <Button variant="outline" size="sm" className="w-full">
                <FileUp className="w-4 h-4 mr-2" />
                Gerenciar Roteiros
              </Button>
            </Link>
          </div>
        )}
        <div className="border-t border-border -mx-4 my-2"></div>
        {user && (
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start items-center gap-2 px-2 h-auto">
                    <Avatar className="h-8 w-8">
                       {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || user.email || ''} />}
                       <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>
                    </div>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Gerenciar Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
