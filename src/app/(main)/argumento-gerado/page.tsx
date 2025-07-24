
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Milestone, Users, Copy, FileUp, Save } from "lucide-react";
import { useScript } from "@/context/script-context";

type FinalArgument = {
    logline: string;
    synopsis: string;
    protagonistPresentation: string;
    antagonistPresentation: string;
    detailedArgument: string;
};

// Helper function to parse the structured text
const parseArgumentText = (text: string): FinalArgument => {
    const sections = {
        logline: '## Logline',
        synopsis: '## Sinopse',
        protagonist: '### Protagonista',
        antagonist: '### Antagonista',
        detailed: '## Argumento Detalhado'
    };

    const extractContent = (startTag: string, endTag: string) => {
        const startIndex = text.indexOf(startTag) + startTag.length;
        const endIndex = text.indexOf(endTag, startIndex);
        return text.substring(startIndex, endIndex !== -1 ? endIndex : undefined).trim();
    };

    return {
        logline: extractContent(sections.logline, sections.synopsis),
        synopsis: extractContent(sections.synopsis, '## Personagens'),
        protagonistPresentation: extractContent(sections.protagonist, sections.antagonist),
        antagonistPresentation: extractContent(sections.antagonist, sections.detailed),
        detailedArgument: extractContent(sections.detailed, 'EOF'), // Use a dummy end tag
    };
};


const EditableSection = ({ title, value, onChange, icon: Icon, isTextarea = false, rows = 3 }: { title: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; icon: React.ElementType; isTextarea?: boolean; rows?: number }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Icon className="w-5 h-5 text-primary"/> {title}</CardTitle>
        </CardHeader>
        <CardContent>
            <Label htmlFor={title.toLowerCase().replace(' ', '-')} className="sr-only">{title}</Label>
            {isTextarea ? (
                 <Textarea
                    id={title.toLowerCase().replace(' ', '-')}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    className="w-full bg-muted/50 p-2 rounded"
                />
            ) : (
                <Input
                    id={title.toLowerCase().replace(' ', '-')}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-muted/50 p-2 rounded"
                />
            )}
        </CardContent>
    </Card>
);

const InfoCardSkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>
        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
    </Card>
);

function ArgumentEditorCore() {
    const [argument, setArgument] = useState<FinalArgument | null>(null);
    const [isEditingExisting, setIsEditingExisting] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addScript, updateScript, getScriptById } = useScript();

    useEffect(() => {
        const scriptId = searchParams.get('id');
        if (scriptId) {
            // Editing an existing argument
            setIsEditingExisting(true);
            const script = getScriptById(scriptId);
            if (script && script.format === 'Argumento') {
                const parsedArgument = parseArgumentText(script.content);
                setArgument(parsedArgument);
            } else {
                 toast({ title: "Argumento não encontrado", description: "Não foi possível carregar o argumento para edição.", variant: "destructive" });
                 router.push('/painel-de-roteiros');
            }
            setLoading(false);
        } else {
            // Creating a new argument from localStorage
            setIsEditingExisting(false);
            const storedArgument = localStorage.getItem('generatedArgument');
            if (storedArgument) {
                setArgument(JSON.parse(storedArgument));
            } else {
                toast({ title: "Nenhum argumento encontrado", description: "Volte para o gerador e crie um novo argumento.", variant: "destructive" });
                router.push('/gerador-de-argumento');
            }
            setLoading(false);
        }
    }, [searchParams, getScriptById, router, toast]);
    
    const handleInputChange = (field: keyof FinalArgument) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (argument) {
            setArgument({ ...argument, [field]: e.target.value });
        }
    };

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
    
    const handleSaveOrUpdate = () => {
        if (!argument) return;
        const scriptContent = createPlainTextDocument();
        const scriptId = searchParams.get('id');

        if (isEditingExisting && scriptId) {
            // Update existing script
            const existingScript = getScriptById(scriptId);
            if (existingScript) {
                updateScript({
                    ...existingScript,
                    content: scriptContent,
                });
                toast({ title: "Argumento Atualizado!", description: "Suas alterações foram salvas no painel." });
            }
        } else {
            // Save as new script
            addScript({
                name: `Argumento: ${argument.logline.substring(0, 30)}...`,
                format: "Argumento",
                genre: "Indefinido",
                content: scriptContent,
            });
            toast({ title: "Argumento Salvo!", description: "O argumento foi salvo como um novo roteiro no seu painel." });
            localStorage.removeItem('generatedArgument'); // Clean up after saving
        }
        router.push('/painel-de-roteiros');
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
        return null;
    }


    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Editor de Argumento</h1>
                    <p className="text-muted-foreground">Refine o argumento abaixo. Suas alterações podem ser salvas.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline">
                        <Copy className="mr-2 h-4 w-4" /> Copiar Texto
                    </Button>
                    <Button onClick={handleSaveOrUpdate}>
                        {isEditingExisting ? <Save className="mr-2 h-4 w-4" /> : <FileUp className="mr-2 h-4 w-4" />}
                        {isEditingExisting ? 'Atualizar Roteiro' : 'Salvar como Roteiro'}
                    </Button>
                </div>
            </header>
            
            <div className="space-y-6">
                <EditableSection title="Logline" value={argument.logline} onChange={handleInputChange('logline')} icon={Milestone} />
                <EditableSection title="Sinopse" value={argument.synopsis} onChange={handleInputChange('synopsis')} icon={FileText} isTextarea rows={5} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditableSection title="Protagonista" value={argument.protagonistPresentation} onChange={handleInputChange('protagonistPresentation')} icon={Users} isTextarea rows={8}/>
                    <EditableSection title="Antagonista" value={argument.antagonistPresentation} onChange={handleInputChange('antagonistPresentation')} icon={Users} isTextarea rows={8} />
                </div>
                <EditableSection title="Argumento Detalhado" value={argument.detailedArgument} onChange={handleInputChange('detailedArgument')} icon={FileText} isTextarea rows={15} />
            </div>
        </div>
    )
}

export default function ArgumentoGeradoPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ArgumentEditorCore />
        </Suspense>
    )
}
