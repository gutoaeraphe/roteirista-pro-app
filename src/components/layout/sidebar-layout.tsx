"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function Sidebar({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <aside
      className={cn(
        "bg-card border-r fixed top-0 left-0 h-screen w-64 flex flex-col z-40",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("p-4 border-b border-border", className)}>
      {children}
    </div>
  );
}

export function SidebarMain({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <main className={cn("flex-1", className)}>
      {children}
    </main>
  );
}

export function SidebarNav({ className, children }: { className?: string; children: ReactNode }) {
  return <nav className={cn("p-4 space-y-4", className)}>{children}</nav>;
}

export function SidebarNavHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <header className={cn("", className)}>{children}</header>;
}

export function SidebarNavHeaderTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "text-xs uppercase text-muted-foreground ml-3 font-semibold",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarNavLink({
  href,
  active,
  className,
  children,
}: {
  href: string;
  active?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = active || pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function SidebarFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <footer className={cn("p-4 border-t border-border mt-auto", className)}>
      {children}
    </footer>
  );
}
