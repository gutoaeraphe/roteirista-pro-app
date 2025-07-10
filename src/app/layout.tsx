import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ScriptProvider } from "@/context/script-context";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Roteirista Pro",
  description: "Desenvolva seus projetos audiovisuais com IA",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontBody.variable
        )}
      >
        <AuthProvider>
          <ScriptProvider>
            {children}
            <Toaster />
          </ScriptProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
