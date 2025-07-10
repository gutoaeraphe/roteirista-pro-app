import type { Metadata } from "next";
import { Belleza, Alegreya } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ScriptProvider } from "@/context/script-context";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";

const fontBelleza = Belleza({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-belleza",
});

const fontBody = Alegreya({
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
          fontBelleza.variable,
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
