

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  UserCircle,
  FileText,
  CreditCard,
  Crown
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
import Image from "next/image";
import { cn } from "@/lib/utils";


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
      title: "Comprar Créditos",
      href: "/comprar-creditos",
      icon: CreditCard,
    },
    {
      title: "Ajuda",
      href: "/ajuda",
      icon: HelpCircle,
    },
];

const NavLink = ({ href, active, children, disabled }: { href: string; active: boolean; children: React.ReactNode, disabled?: boolean }) => (
  <Link
    href={disabled ? "#" : href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
      active && "bg-muted text-primary",
      disabled && "cursor-not-allowed opacity-50"
    )}
    onClick={(e) => disabled && e.preventDefault()}
  >
    {children}
  </Link>
);


export function AppSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeScript, loading: scriptLoading } = useScript();
  const { user, userProfile, loading: authLoading } = useAuth();
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
      router.push('/');
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

  const hasCredits = userProfile?.isAdmin || (userProfile?.credits ?? 0) > 0;

  const navContent = (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-20 items-center justify-center border-b px-4 lg:h-[80px] lg:px-6">
        <Link href="/painel-de-roteiros" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="Roteirista Pro" width={84} height={36} className="h-auto" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-2">
              {section.items ? (
                <>
                  <h3 className="mb-1 px-3 text-xs font-semibold text-muted-foreground uppercase">{section.title}</h3>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      active={pathname === item.href}
                      disabled={!hasCredits && item.href !== '/gerador-de-argumento'}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </NavLink>
                  ))}
                  {hasGeneratedArgument && section.title === "Ferramentas" && (
                     <NavLink
                        href="/argumento-gerado"
                        active={pathname === "/argumento-gerado"}
                      >
                        <FileText className="h-4 w-4" />
                        Argumento Gerado
                      </NavLink>
                  )}
                </>
              ) : (
                <NavLink
                  href={section.href}
                  active={pathname === section.href}
                >
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </NavLink>
              )}
            </div>
          ))}
          <div>
             <h3 className="mb-1 px-3 text-xs font-semibold text-muted-foreground uppercase">Aprenda Mais</h3>
            {learnMoreItems.map((item) => (
                 <NavLink
                    key={item.href}
                    href={item.href}
                    active={pathname === item.href}
                    >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                </NavLink>
            ))}
          </div>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t">
         {scriptLoading || authLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Carregando...</div>
        ) : activeScript ? (
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Roteiro Ativo</p>
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold truncate text-sm">{activeScript.name}</p>
                <p className="text-xs text-muted-foreground">{activeScript.format} • {activeScript.genre}</p>
              </div>
            </div>
          </div>
        ) : (
            <Link href="/painel-de-roteiros" passHref>
              <Button variant="outline" size="sm" className="w-full">
                <FileUp className="w-4 h-4 mr-2" />
                Gerenciar Roteiros
              </Button>
            </Link>
        )}
        {user && userProfile && (
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start items-center gap-2 px-2 h-auto mt-4">
                    <Avatar className="h-8 w-8">
                       {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || user.email || ''} />}
                       <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {userProfile.isAdmin ? (
                          <>
                           <Crown className="w-3 h-3 text-amber-400" /> 
                           <span>Admin</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3 h-3" />
                            <span>{userProfile.credits} créditos</span>
                          </>
                        )}
                      </div>
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
                <DropdownMenuItem asChild>
                  <Link href="/comprar-creditos">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Comprar Créditos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )}
      </div>
    </div>
  );

  if (isMobile) {
      return navContent;
  }

  return (
    <div className="hidden border-r bg-card md:block fixed top-0 left-0 h-full w-64">
        {navContent}
    </div>
  );
}
