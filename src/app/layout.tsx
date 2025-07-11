import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ScriptProvider } from "@/context/script-context";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";
import CookieConsent from "@/components/cookie-consent";

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
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
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
            <CookieConsent />
          </ScriptProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
