
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, AlertTriangle, Download, Award, Star, BookOpen, Anchor, Palette } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { analyzeScriptHighConcept } from "@/ai/flows/analyze-script-high-concept";
import type { AnalyzeScriptHighConceptOutput } from "@/ai/flows/analyze-script-high-concept";

const PillarCard = ({ title, analysis, score, icon: Icon }: { title: string, analysis: string, score: number, icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2"><Icon className="w-5 h-5 text-primary"/> {title}</div>
                 <span className={cn(
                    "font-bold text-lg",
                    score < 3 ? "text-amber-500" : "text-green-500"
                )}>
                    {score}/5
                </span>
            </CardTitle>
        </CardHeader>
        <CardContent>
             <p className="text-sm text-muted-foreground">{analysis}</p>
        </CardContent>
    </Card>
);

const AnalysisSkeleton = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Skeleton className="h-48" />
             <Skeleton className="h-48" />
             <Skeleton className="h-48" />
        </div>
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-16 w-full" /></CardContent>
        </Card>
    </div>
);


export default function AnaliseDePropostaDeValorPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptHighConceptOutput | undefined>(
    activeScript?.analysis.highConcept
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
      const result = await analyzeScriptHighConcept({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, highConcept: result } });
      
      toast({ title: "Análise Concluída", description: "A análise de proposta de valor foi gerada." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível gerar a análise.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createPlainTextDocument = () => {
    if (!analysisResult || !activeScript) return "";

    let content = `Análise de Proposta de Valor (High Concept) para: ${activeScript.name}\n`;
    content += "==================================================\n\n";

    content += `The Book (O Enredo Central) - Nota: ${analysisResult.theBook.score}/5\n`;
    content += `--------------------------------------------------\n`;
    content += `${analysisResult.theBook.analysis}\n\n`;

    content += `The Hook (O Gancho) - Nota: ${analysisResult.theHook.score}/5\n`;
    content += `--------------------------------------------------\n`;
    content += `${analysisResult.theHook.analysis}\n\n`;

    content += `The Look (A Estética) - Nota: ${analysisResult.theLook.score}/5\n`;
    content += `--------------------------------------------------\n`;
    content += `${analysisResult.theLook.analysis}\n\n`;
    
    content += "DIAGNÓSTICO GERAL E RECOMENDAÇÕES\n";
    content += `Pontuação Geral de High Concept: ${analysisResult.overallScore.toFixed(1)} / 5.0\n`;
    content += "==================================================\n\n";
    content += `${analysisResult.strategicRecommendations}\n`;

    return content.trim();
  };

  const handleDownload = () => {
    const content = createPlainTextDocument();
    if (!content || !activeScript) return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analise_high_concept_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Análise de Proposta de Valor" description="Para analisar o High Concept do seu roteiro, primeiro selecione um roteiro ativo." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise de Proposta de Valor (High Concept)</h1>
          <p className="text-muted-foreground">Avalie a força do seu conceito central com base nos três pilares do mercado.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" disabled={!hasBeenAnalyzed || loading}>
                <Download className="mr-2 h-4 w-4" /> Baixar TXT
            </Button>
            <Button onClick={handleAnalysis} disabled={loading}>
            {loading ? "Analisando..." : hasBeenAnalyzed ? "Analisar Novamente" : "Analisar Conceito"}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PillarCard title="The Book (O Enredo)" analysis={analysisResult.theBook.analysis} score={analysisResult.theBook.score} icon={BookOpen} />
                <PillarCard title="The Hook (O Gancho)" analysis={analysisResult.theHook.analysis} score={analysisResult.theHook.score} icon={Anchor} />
                <PillarCard title="The Look (A Estética)" analysis={analysisResult.theLook.analysis} score={analysisResult.theLook.score} icon={Palette} />
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2"><Award /> Diagnóstico Geral e Recomendações</div>
                        <div className="flex items-center gap-2 text-2xl font-bold">
                            <span className={cn(
                                "flex items-center gap-2",
                                analysisResult.overallScore >= 4 ? "text-green-500" : analysisResult.overallScore >= 2.5 ? "text-amber-500" : "text-red-500"
                            )}>
                               <Star className="w-6 h-6" />
                                <span>{analysisResult.overallScore.toFixed(1)} / 5.0</span>
                            </span>
                        </div>
                    </CardTitle>
                    <CardDescription>Pontuação Geral de High Concept</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.strategicRecommendations}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
