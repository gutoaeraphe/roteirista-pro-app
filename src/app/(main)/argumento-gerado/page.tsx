
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, Milestone, Users, Copy, FileUp } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useScript } from "@/context/script-context";

type FinalArgument = {
    logline: string;
    synopsis: string;
    protagonistPresentation: string;
    antagonistPresentation: string;
    detailedArgument: string;
};

const InfoCard = ({ title, content, icon: Icon, className }: { title: string; content: string; icon: React.ElementType; className?: string }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Icon className="w-5 h-5 text-primary"/> {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-muted-foreground">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
);

const InfoCardSkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>
        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
    </Card>
);


export default function ArgumentoGeradoPage() {
    const [argument, setArgument] = useState<FinalArgument | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();
    const { addScript } = useScript();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedArgument = localStorage.getItem('generatedArgument');
            if (storedArgument) {
                setArgument(JSON.parse(storedArgument));
            } else {
                toast({ title: "Nenhum argumento encontrado", description: "Volte para o gerador e crie um novo argumento.", variant: "destructive" });
                router.push('/gerador-de-argumento');
            }
            setLoading(false);
        }
    }, [router, toast]);
    
    const createPlainTextDocument = (): string => {
        if (!argument) return "";
        return `
# Argumento Gerado

## Logline
${argument.logline}

## Sinopse
${argument.synopsis}

## Personagens

### Protagonista
${argument.protagonistPresentation}

### Antagonista
${argument.antagonistPresentation}

## Argumento Detalhado
${argument.detailedArgument}
        `.trim();
    }

    const handleCopy = () => {
        if (argument) {
            const plainText = createPlainTextDocument();
            navigator.clipboard.writeText(plainText);
            toast({ title: "Copiado!", description: "O argumento foi copiado para a área de transferência." });
        }
    }
    
    const handleSaveAsScript = () => {
        if (argument) {
            const scriptContent = createPlainTextDocument();
            addScript({
                name: `Argumento: ${argument.logline.substring(0, 30)}...`,
                format: "Argumento",
                genre: "Indefinido",
                content: scriptContent,
            });
            toast({ title: "Argumento Salvo!", description: "O argumento foi salvo como um novo roteiro no seu painel." });
            localStorage.removeItem('generatedArgument'); // Limpa para evitar re-salvar
            router.push('/painel-de-roteiros');
        }
    }

    if (loading) {
        return (
             <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <Skeleton className="h-8 w-72" />
                        <Skeleton className="h-4 w-96 mt-2" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </header>
                 <div className="space-y-6">
                    <InfoCardSkeleton />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCardSkeleton />
                        <InfoCardSkeleton />
                    </div>
                    <InfoCardSkeleton />
                </div>
            </div>
        )
    }

    if (!argument) {
        return null; // ou um placeholder/mensagem de erro
    }


    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Argumento Gerado</h1>
                    <p className="text-muted-foreground">Este é o resultado da sua sessão de criação. Você pode copiá-lo ou salvá-lo como um novo roteiro.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline">
                        <Copy className="mr-2 h-4 w-4" /> Copiar Texto
                    </Button>
                    <Button onClick={handleSaveAsScript}>
                        <FileUp className="mr-2 h-4 w-4" /> Salvar como Roteiro
                    </Button>
                </div>
            </header>
            
            <div className="space-y-6">
                <InfoCard title="Logline" content={argument.logline} icon={Milestone} className="bg-primary/5 border-primary/20"/>
                 <InfoCard title="Sinopse" content={argument.synopsis} icon={FileText} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard title="Protagonista" content={argument.protagonistPresentation} icon={Users} />
                    <InfoCard title="Antagonista" content={argument.antagonistPresentation} icon={Users} />
                </div>
                <InfoCard title="Argumento Detalhado" content={argument.detailedArgument} icon={FileText} />
            </div>
        </div>
    )
}
