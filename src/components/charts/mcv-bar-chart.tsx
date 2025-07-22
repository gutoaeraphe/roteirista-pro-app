"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, AlertTriangle, Download, Award, Star, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { analyzeScriptMCV } from "@/ai/flows/analyze-script-mcv";
import type { AnalyzeScriptMCVOutput, ViabilityFactor } from "@/ai/flows/analyze-script-mcv";

const FactorItem = ({ factor }: { factor: ViabilityFactor }) => (
    <div className="border-t pt-4">
        <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-sm">{factor.factorName}</h4>
            <div className="flex items-center gap-1 text-base font-bold">
                <span className={cn(
                    factor.score >= 4 ? "text-red-500" : factor.score === 3 ? "text-amber-500" : "text-green-500"
                )}>
                    {factor.score}
                </span>
                <span className="text-muted-foreground">/ 5</span>
            </div>
        </div>
        <p className="text-sm text-muted-foreground">{factor.justification}</p>
    </div>
);

const AnalysisSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-6 w-full" /></CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            </CardContent>
        </Card>
    </div>
);


export default function AnaliseDeViabilidadePage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptMCVOutput | undefined>(
    activeScript?.analysis.mcv
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
      const result = await analyzeScriptMCV({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, mcv: result } });
      
      toast({ title: "Análise Concluída", description: "A análise de viabilidade foi gerada." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível gerar a análise.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createPlainTextDocument = () => {
    if (!analysisResult || !activeScript) return "";

    let content = `Análise de Viabilidade (MCV) para: ${activeScript.name}\n`;
    content += "==================================================\n\n";

    content += `DIAGNÓSTICO FINAL\n`;
    content += `Média de Custo/Complexidade: ${analysisResult.averageScore.toFixed(1)} / 5.0\n`;
    content += `--------------------------------------------------\n`;
    content += `${analysisResult.strategicRecommendations}\n\n`;
    
    content += "ANÁLISE DETALHADA DOS FATORES\n";
    content += "==================================================\n\n";

    analysisResult.factors.forEach((item) => {
      content += `${item.factorName} (Nota: ${item.score}/5)\n`;
      content += `   Justificativa: ${item.justification}\n\n`;
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
    link.download = `analise_viabilidade_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Análise de Viabilidade" description="Para analisar a viabilidade do seu roteiro, primeiro selecione um roteiro ativo." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise de Viabilidade (MCV)</h1>
          <p className="text-muted-foreground">Avalie o roteiro em busca de flags de custo e complexidade de produção.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" disabled={!hasBeenAnalyzed || loading}>
                <Download className="mr-2 h-4 w-4" /> Baixar TXT
            </Button>
            <Button onClick={handleAnalysis} disabled={loading}>
            {loading ? "Analisando..." : hasBeenAnalyzed ? "Analisar Novamente" : "Analisar Viabilidade"}
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
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2"><Award /> Diagnóstico Final</div>
                        <div className="flex items-center gap-2 text-2xl font-bold">
                            <span className={cn(
                                "flex items-center gap-2",
                                analysisResult.averageScore >= 4 ? "text-red-500" : analysisResult.averageScore >= 2.5 ? "text-amber-500" : "text-green-500"
                            )}>
                               <Star className="w-6 h-6" />
                                <span>{analysisResult.averageScore.toFixed(1)} / 5.0</span>
                            </span>
                        </div>
                    </CardTitle>
                    <CardDescription>Média de Custo/Complexidade</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.strategicRecommendations}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings /> Análise dos Fatores</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {analysisResult.factors.map((factor, index) => (
                        <FactorItem factor={factor} key={index} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}