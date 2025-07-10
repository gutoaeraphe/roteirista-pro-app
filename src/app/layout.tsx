import type { Metadata } from "next";
import { Belleza, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ScriptProvider } from "@/context/script-context";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";

const fontHeadline = Belleza({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-headline",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Roteirista Pro",
  description: "Desenvolva seus projetos audiovisuais com IA",
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
          fontHeadline.variable,
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
