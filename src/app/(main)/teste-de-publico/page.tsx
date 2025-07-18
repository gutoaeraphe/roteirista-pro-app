
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, User, BrainCircuit, Bot, FileText, AlertTriangle, Download, ChevronRight, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";

import type { GenerateAudiencePersonaOutput } from "@/ai/flows/generate-audience-persona";
import type { AnalyzeScriptFromPersonaOutput } from "@/ai/flows/analyze-script-from-persona";
import { generateAudiencePersona } from "@/ai/flows/generate-audience-persona";
import { analyzeScriptFromPersona } from "@/ai/flows/analyze-script-from-persona";

const audienceSchema = z.object({
  audienceDescription: z.string().min(20, "Forneça uma descrição de pelo menos 20 caracteres."),
});
type AudienceFormData = z.infer<typeof audienceSchema>;

type AudienceAnalysis = {
    persona: GenerateAudiencePersonaOutput;
    analysis: AnalyzeScriptFromPersonaOutput;
};

const AnalysisSection = ({ title, content }: { title: string, content: string }) => (
    <div>
        <h4 className="text-lg font-semibold text-primary mb-2">{title}</h4>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    </div>
);


export default function TesteDePublicoPage() {
    const { activeScript, updateScript } = useScript();
    const [loading, setLoading] = useState({ persona: false, analysis: false });
    const [analysisResult, setAnalysisResult] = useState<AudienceAnalysis | undefined>(
        activeScript?.analysis.audienceTest
    );
    const { toast } = useToast();

    const form = useForm<AudienceFormData>({
        resolver: zodResolver(audienceSchema),
        defaultValues: {
            audienceDescription: activeScript?.analysis.audienceTest?.persona.audienceDescription || "",
        },
    });
     
    const handleGeneratePersona = async (data: AudienceFormData) => {
        if (!activeScript) {
            toast({ title: "Erro", description: "Selecione um roteiro ativo.", variant: "destructive" });
            return;
        }
        setLoading({ persona: true, analysis: false });
        setAnalysisResult(undefined);

        try {
            const personaResult = await generateAudiencePersona({ audienceDescription: data.audienceDescription });
            setAnalysisResult({ persona: personaResult, analysis: {} as any }); // Placeholder for analysis
            updateScript({ ...activeScript, analysis: { ...activeScript.analysis, audienceTest: { persona: personaResult, analysis: {} as any } } });
            toast({ title: "Persona Gerada!", description: "Agora, vamos ver como ela reagiria ao seu roteiro." });
        } catch (error) {
            console.error(error);
            toast({ title: "Erro", description: "Não foi possível gerar a persona.", variant: "destructive" });
        } finally {
            setLoading({ persona: false, analysis: false });
        }
    };
    
    const handleAnalyzeFromPersona = async () => {
        if (!activeScript || !analysisResult?.persona) {
            toast({ title: "Erro", description: "Gere uma persona primeiro.", variant: "destructive" });
            return;
        }
        setLoading({ persona: false, analysis: true });

        try {
            const finalAnalysis = await analyzeScriptFromPersona({
                scriptContent: activeScript.content,
                persona: JSON.stringify(analysisResult.persona)
            });
            
            const finalResult = { ...analysisResult, analysis: finalAnalysis };
            setAnalysisResult(finalResult);
            updateScript({ ...activeScript, analysis: { ...activeScript.analysis, audienceTest: finalResult } });
            toast({ title: "Análise Concluída!", description: "A avaliação da persona foi gerada." });

        } catch (error) {
            console.error(error);
            toast({ title: "Erro", description: "Não foi possível gerar a análise da persona.", variant: "destructive" });
        } finally {
            setLoading({ persona: false, analysis: false });
        }
    }

    const formatAnalysisToText = () => {
        if (!analysisResult) return "";
        const { persona, analysis } = analysisResult;
        
        let content = `Teste de Público para: ${activeScript?.name}\n`;
        content += "==================================================\n\n";

        content += `# Persona: ${persona.name}\n\n`;
        content += `## Resumo da Persona\n${persona.summary}\n\n`;

        content += "==================================================\n";
        content += `# Análise da Persona sobre o Roteiro\n\n`;

        content += `## Trama e Estrutura Narrativa\n${analysis.plotAndStructure}\n\n`;
        content += `## Personagens\n${analysis.characters}\n\n`;
        content += `## Diálogos\n${analysis.dialogues}\n\n`;
        content += `## Temática e Mensagem\n${analysis.thematicAndMessage}\n\n`;
        content += `## Veredito Final da Persona\n${analysis.finalVerdict}\n\n`;

        return content;
    }

    const handleDownload = () => {
        const textContent = formatAnalysisToText();
        if (!textContent || !activeScript) return;

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `teste_de_publico_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    if (!activeScript) {
        return <PagePlaceholder title="Teste de Público" description="Para testar seu roteiro com uma persona, primeiro selecione um roteiro ativo." />;
    }

    const currentPersona = analysisResult?.persona;
    const currentAnalysis = analysisResult?.analysis;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Teste de Público</h1>
                    <p className="text-muted-foreground">Gere uma persona e descubra como ela reagiria ao seu roteiro.</p>
                </div>
                 <Button onClick={handleDownload} variant="outline" disabled={!currentAnalysis?.finalVerdict || loading.persona || loading.analysis}>
                    <Download className="mr-2 h-4 w-4" /> Baixar TXT
                </Button>
            </header>

            <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Aviso de IA</AlertTitle>
                <AlertDescription>
                    As respostas e interações desta página são geradas por Inteligência Artificial. Esta tecnologia pode cometer erros e produzir informações inconsistentes. Recomendamos a revisão humana de todo o conteúdo.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> 1. Descreva seu Público-Alvo</CardTitle>
                    <CardDescription>
                        Forneça detalhes sobre para quem você está escrevendo. Pense em idade, gostos, hábitos e o que eles procuram em um filme. Quanto mais detalhes, melhor será a persona.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleGeneratePersona)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="audienceDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Descrição do Público</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ex: Jovens adultos (20-30 anos) que gostam de ficção científica com dilemas filosóficos, assistem a filmes em serviços de streaming nos fins de semana e procuram histórias que os façam pensar..."
                                                rows={5}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2">
                                <Button type="submit" disabled={loading.persona || loading.analysis}>
                                    {loading.persona ? "Gerando..." : "Gerar Persona com IA"}
                                    <Sparkles className="ml-2 h-4 w-4" />
                                </Button>
                                <Button type="submit" variant="outline" disabled={loading.persona || loading.analysis} onClick={form.handleSubmit(handleGeneratePersona)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Refazer
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {loading.persona && (
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-5/6" />
                       <Skeleton className="h-4 w-full mt-4" />
                       <Skeleton className="h-4 w-4/5" />
                    </CardContent>
                </Card>
            )}

            {currentPersona?.name && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot /> 2. Conheça a Persona Gerada</CardTitle>
                        <CardDescription>
                            Esta é a persona criada com base na sua descrição. Ela será usada para analisar seu roteiro.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center bg-muted p-4 rounded-lg">
                            <h3 className="text-2xl font-bold text-primary">{currentPersona.name}</h3>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg"><FileText className="w-5 h-5 text-primary"/>Resumo da Persona</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentPersona.summary}</p>
                            </CardContent>
                        </Card>
                         <div className="flex justify-center pt-4">
                            <Button onClick={handleAnalyzeFromPersona} disabled={loading.analysis || loading.persona || !!currentAnalysis?.finalVerdict}>
                                {loading.analysis ? 'Analisando Roteiro...' : 'Analisar Roteiro com esta Persona'}
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
            
            {loading.analysis && (
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <Skeleton className="h-32" />
                       <Skeleton className="h-32" />
                       <Skeleton className="h-32" />
                       <Skeleton className="h-32" />
                       <Skeleton className="h-32" />
                    </CardContent>
                </Card>
            )}

            {currentAnalysis?.finalVerdict && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot /> 3. Análise da Persona sobre o Roteiro</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <AnalysisSection title="Trama e Estrutura Narrativa" content={currentAnalysis.plotAndStructure} />
                        <Separator />
                        <AnalysisSection title="Personagens" content={currentAnalysis.characters} />
                         <Separator />
                        <AnalysisSection title="Diálogos" content={currentAnalysis.dialogues} />
                         <Separator />
                        <AnalysisSection title="Temática e Mensagem" content={currentAnalysis.thematicAndMessage} />
                         <Separator />
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-lg text-primary">Veredito Final da Persona</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                                    <ReactMarkdown>{currentAnalysis.finalVerdict}</ReactMarkdown>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
