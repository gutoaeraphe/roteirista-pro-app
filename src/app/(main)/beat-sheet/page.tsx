
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, AlertTriangle, Download, Award, ClipboardList } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeScriptBeatSheet } from "@/ai/flows/analyze-script-beat-sheet";
import type { AnalyzeScriptBeatSheetOutput } from "@/ai/flows/analyze-script-beat-sheet";
import { cn } from "@/lib/utils";

const AnalysisSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-16 w-full" /></CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(15)].map((_, i) => (
                <Card key={i}>
                    <CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader>
                    <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                </Card>
            ))}
        </div>
    </div>
);

export default function BeatSheetPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptBeatSheetOutput | undefined>(
    activeScript?.analysis.beatSheet
  );
  const { toast } = useToast();
  
  const handleAnalysis = async () => {
    if (!activeScript) {
      toast({ title: "Erro", description: "Nenhum roteiro ativo selecionado.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setAnalysisResult(undefined);
    try {
      const result = await analyzeScriptBeatSheet({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, beatSheet: result } });
      
      toast({ title: "Análise Concluída", description: "O Beat Sheet foi gerado com sucesso." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível gerar a análise.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createPlainTextDocument = () => {
    if (!analysisResult || !activeScript) return "";

    let content = `Análise de Beat Sheet para: ${activeScript.name}\n`;
    content += "==================================================\n\n";

    content += `Resumo Geral da Estrutura\n`;
    content += `--------------------------------------------------\n`;
    content += `${analysisResult.summary}\n\n`;
    
    content += "Análise Detalhada dos Beats\n";
    content += "==================================================\n\n";

    analysisResult.beats.forEach((item, index) => {
      content += `${index + 1}. ${item.beatName} (Pág. ${item.pageNumber})\n`;
      content += `   Análise: ${item.analysis}\n\n`;
    });

    return content.trim();
  };

  const handleDownload = () => {
    const content = createPlainTextDocument();
    if (!content || !activeScript) return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beat_sheet_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Análise de Beat Sheet" description="Para mapear a estrutura de beats, primeiro selecione um roteiro ativo." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise de Beat Sheet</h1>
          <p className="text-muted-foreground">Mapeie os 15 pontos essenciais da estrutura do seu roteiro.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" disabled={!hasBeenAnalyzed || loading}>
                <Download className="mr-2 h-4 w-4" /> Baixar TXT
            </Button>
            <Button onClick={handleAnalysis} disabled={loading}>
            {loading ? "Analisando..." : hasBeenAnalyzed ? "Analisar Novamente" : "Analisar Roteiro"}
            <Sparkles className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </header>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Aviso de IA</AlertTitle>
        <AlertDescription>
            As respostas e interações desta página são geradas por Inteligência Artificial. Esta tecnologia pode cometer erros e produzir informações inconsistentes. Recomendamos a revisão humana de todo o conteúdo.
        </AlertDescription>
      </Alert>

      {loading && <AnalysisSkeleton />}

      {analysisResult && !loading && (
        <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Award /> Resumo da Estrutura</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.summary}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ClipboardList /> Os 15 Beats Narrativos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analysisResult.beats.map((beat, index) => (
                           <Card key={index} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                       <span className="font-bold text-primary">{index + 1}.</span> {beat.beatName}
                                    </CardTitle>
                                    <CardDescription>Página(s): {beat.pageNumber}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">{beat.analysis}</p>
                                </CardContent>
                           </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
