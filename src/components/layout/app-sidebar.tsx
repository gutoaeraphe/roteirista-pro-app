"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Sparkles,
  Clapperboard,
} from "lucide-react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";

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
        title: "Análise de Roteiro",
        href: "/analise-de-roteiro",
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
  {
    title: "Aprenda Mais",
    items: [
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
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { activeScript, loading } = useScript();

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
        <div className="border-t border-border -mx-4 mb-4"></div>
        {loading ? (
          <div className="p-4">Carregando...</div>
        ) : activeScript ? (
          <div className="px-4 mb-4">
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
          <div className="px-4 mb-4">
            <p className="text-xs text-muted-foreground mb-1">Nenhum roteiro ativo</p>
            <Link href="/painel-de-roteiros" passHref>
              <Button variant="outline" size="sm" className="w-full">
                <FileUp className="w-4 h-4 mr-2" />
                Gerenciar Roteiros
              </Button>
            </Link>
          </div>
        )}
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
        </SidebarNav>
      </SidebarMain>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Roteiro Aprimorado
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
