
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
import { Sparkles, GitCommitHorizontal, AlertTriangle, BookCheck } from "lucide-react";
import type { AnalyzeScriptHeroJourneyOutput, HeroJourneyStep } from "@/ai/flows/analyze-script-hero-journey";
import { IntensityChart } from "@/components/charts/intensity-chart";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const StepCard = ({ step, index }: { step: HeroJourneyStep; index: number }) => (
    <AccordionItem value={`item-${index}`} key={index}>
        <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center text-left">
                    <span className="text-primary font-bold mr-2">{index + 1}.</span> {step.stepName}
                </div>
                 <span className={`font-bold text-lg ${step.score <= 7 ? 'text-amber-500' : 'text-green-500'}`}>
                    {step.score}/10
                </span>
            </div>
        </AccordionTrigger>
        <AccordionContent>
            <p className="text-sm text-muted-foreground mb-3">{step.analysis}</p>
            {step.score <= 7 && step.suggestions && (
                <div className="mt-3 text-xs border-l-2 border-amber-500 pl-3 text-amber-500/90">
                    <p className="font-semibold">Sugestão:</p>
                    <p>{step.suggestions}</p>
                </div>
            )}
        </AccordionContent>
    </AccordionItem>
)

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
    setAnalysisResult(undefined);
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
    ? analysisResult.identifiedSteps.map((step) => ({
        step: step.stepName,
        intensity: step.intensity,
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
          <p className="text-muted-foreground">Identifique os passos da jornada do herói e visualize a intensidade dramática.</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? "Analisando..." : hasBeenAnalyzed ? "Reanalisar" : "Analisar"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>
      
      {loading && (
        <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                </CardContent>
              </Card>
              <div className="space-y-8">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
                </Card>
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent><Skeleton className="h-40 w-full" /></CardContent>
                </Card>
              </div>
            </div>
        </div>
      )}

      {analysisResult && !loading && (
        <div className="space-y-8">
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                           Análise Dramatúrgica Geral
                        </div>
                        <span className={`text-2xl font-bold ${analysisResult.overallAnalysis.score <= 7 ? 'text-amber-500' : 'text-green-500'}`}>
                            {analysisResult.overallAnalysis.score}/10
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{analysisResult.overallAnalysis.summary}</p>
                    {analysisResult.overallAnalysis.score <= 7 && analysisResult.overallAnalysis.suggestions && (
                        <div className="mt-3 text-xs border-l-2 border-amber-500 pl-3 text-amber-500/90">
                            <p className="font-semibold">Sugestão:</p>
                            <p>{analysisResult.overallAnalysis.suggestions}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Nota sobre as Sugestões</AlertTitle>
                <AlertDescription>
                    Para manter o foco nos pontos mais críticos, a IA gera sugestões de melhoria apenas para os critérios com pontuação igual ou inferior a 7.
                </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><GitCommitHorizontal /> Passos da Jornada Identificados</CardTitle>
                  <CardDescription>Apenas os passos encontrados no roteiro são listados abaixo, na ordem em que aparecem.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {analysisResult.identifiedSteps.map((step, index) => (
                      <StepCard step={step} index={index} key={index} />
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
              
              <div className="space-y-8">
                <IntensityChart data={chartData} />
                <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2"><BookCheck /> Análise de 3 Atos</CardTitle>
                         <CardDescription>Comentários sobre a estrutura de atos do roteiro.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Primeiro Ato (Apresentação)</h4>
                            <p className="text-sm text-muted-foreground">{analysisResult.threeActAnalysis.actOne}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Segundo Ato (Confronto)</h4>
                            <p className="text-sm text-muted-foreground">{analysisResult.threeActAnalysis.actTwo}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Terceiro Ato (Resolução)</h4>
                            <p className="text-sm text-muted-foreground">{analysisResult.threeActAnalysis.actThree}</p>
                        </div>
                    </CardContent>
                </Card>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}
