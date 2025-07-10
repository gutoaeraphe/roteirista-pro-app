import type { Metadata } from "next";
import { Alegreya, Belleza } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ScriptProvider } from "@/context/script-context";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontBelleza = Belleza({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-belleza",
});

const fontAlegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-alegreya",
});

export const metadata: Metadata = {
  title: "Roteiro Aprimorado",
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
          fontAlegreya.variable
        )}
      >
        <ScriptProvider>
          {children}
          <Toaster />
        </ScriptProvider>
      </body>
    </html>
  );
}
