"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeScriptHeroJourney } from "@/ai/flows/analyze-script-hero-journey";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, GitCommitHorizontal } from "lucide-react";
import type { AnalyzeScriptHeroJourneyOutput } from "@/ai/flows/analyze-script-hero-journey";
import { IntensityChart } from "@/components/charts/intensity-chart";

export default function JornadaDoHeroiPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptHeroJourneyOutput | undefined>(
    activeScript?.analysis.heroJourney
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
      const result = await analyzeScriptHeroJourney({ script: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, heroJourney: result } });
      toast({
        title: "Análise Concluída",
        description: "A jornada do herói foi mapeada com sucesso.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível analisar a jornada do herói. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasBeenAnalyzed = !!analysisResult;
  const chartData = analysisResult
    ? analysisResult.heroJourneySteps.map((step, index) => ({
        step: step.split(':')[0], // Use just the name of the step for the chart label
        intensity: analysisResult.dramaticIntensity[index],
      }))
    : [];

  if (!activeScript) {
    return <PagePlaceholder title="Análise da Jornada do Herói" description="Para mapear a jornada do herói, primeiro selecione um roteiro ativo no Painel de Roteiros." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise da Jornada do Herói</h1>
          <p className="text-muted-foreground">Identifique os 12 passos da jornada do herói e visualize a intensidade dramática.</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? "Analisando..." : hasBeenAnalyzed ? "Reanalisar" : "Analisar"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent className="space-y-4">
              {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
          </Card>
        </div>
      )}

      {analysisResult && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><GitCommitHorizontal /> Os 12 Passos da Jornada</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {analysisResult.heroJourneySteps.map((step, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      <span className="text-primary font-bold mr-2">{index + 1}.</span> {step.split(':')[0]}
                    </AccordionTrigger>
                    <AccordionContent>
                      {step.split(':').slice(1).join(':').trim()}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <IntensityChart data={chartData} />
        </div>
      )}
    </div>
  );
}
