"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeScriptNarrative } from "@/ai/flows/analyze-script-narrative";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, BarChart3, BookOpen, Users, DollarSign, Lightbulb, FileText, Drama, Wand2 } from "lucide-react";
import type { AnalyzeScriptNarrativeOutput } from "@/ai/flows/analyze-script-narrative";

export default function AnaliseDeRoteiroPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptNarrativeOutput | undefined>(
    activeScript?.analysis.narrative
  );
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!activeScript) {
      toast({
        title: "Erro",
        description: "Nenhum roteiro ativo selecionado.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeScriptNarrative({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, narrative: result } });
      toast({
        title: "Análise Concluída",
        description: "A análise do roteiro foi gerada com sucesso.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível analisar o roteiro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Análise de Roteiro" description="Para analisar um roteiro, primeiro selecione um roteiro ativo no Painel de Roteiros." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise de Roteiro</h1>
          <p className="text-muted-foreground">Obtenha um dashboard completo sobre a estrutura e potencial do seu roteiro.</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? "Analisando..." : hasBeenAnalyzed ? "Reanalisar Roteiro" : "Analisar Roteiro"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {loading && (
          <div className="space-y-6">
              <Card>
                  <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                  <CardContent><Skeleton className="h-20 w-full" /></CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                      <Card key={i}>
                          <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>
                          <CardContent><Skeleton className="h-16 w-full" /></CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      )}

      {analysisResult && !loading && (
        <div className="space-y-6">
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Resumo da Trama</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90">{analysisResult.summary.plotSummary}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><BarChart3 /> Estrutura Narrativa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{analysisResult.summary.narrativeStructure}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Users /> Personagens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{analysisResult.summary.characters}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><DollarSign /> Potencial Comercial</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{analysisResult.summary.commercialPotential}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb /> Originalidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{analysisResult.summary.originality}</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Drama /> Análise de Estrutura Narrativa Detalhada</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.narrativeStructureAnalysis}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wand2 /> Canvas de Dramaturgia</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.dramaturgyCanvasAnalysis}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
