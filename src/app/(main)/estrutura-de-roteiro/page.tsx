
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeScriptStructure } from "@/ai/flows/analyze-script-structure";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, FileText, CheckCircle2, AlertTriangle, BookOpen, BrainCircuit, Target, Clapperboard, Award, TrendingUp, Lightbulb } from "lucide-react";
import type { AnalyzeScriptStructureOutput, Metric, DramaticElement } from "@/ai/flows/analyze-script-structure";
import { StructureRadarChart } from "@/components/charts/structure-radar-chart";

const MetricCard = ({ title, metric, icon: Icon }: { title: string; metric: Metric; icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary"/> {title}
                </div>
                <span className={`text-2xl font-bold ${metric.score <= 7 ? 'text-amber-500' : 'text-green-500'}`}>
                    {metric.score}/10
                </span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">{metric.analysis}</p>
            {metric.score <= 7 && metric.suggestions && (
                <div className="mt-3 text-xs border-l-2 border-amber-500 pl-3 text-amber-500/90">
                    <p className="font-semibold">Sugestão:</p>
                    <p>{metric.suggestions}</p>
                </div>
            )}
        </CardContent>
    </Card>
);

const DramaticElementCard = ({ element }: { element: DramaticElement }) => (
    <Card className="bg-muted/30">
        <CardHeader>
            <CardTitle className="text-base font-semibold">{element.name}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground italic border-l-2 pl-3 mb-3">"{element.identifiedExcerpt}"</p>
            <p className="text-sm text-foreground/90">{element.effectivenessAnalysis}</p>
        </CardContent>
    </Card>
)

export default function EstruturaDeRoteiroPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptStructureOutput | undefined>(
    activeScript?.analysis.structure
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
      const result = await analyzeScriptStructure({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, structure: result } });
      toast({
        title: "Análise Concluída",
        description: "A análise da estrutura do roteiro foi gerada.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível analisar a estrutura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const hasBeenAnalyzed = !!analysisResult;
  const chartData = analysisResult
  ? [
      { criteria: "Equilíbrio", score: analysisResult.structureCriteria.balance.score },
      { criteria: "Tensão", score: analysisResult.structureCriteria.tension.score },
      { criteria: "Unidade", score: analysisResult.structureCriteria.unity.score },
      { criteria: "Contraste", score: analysisResult.structureCriteria.contrast.score },
      { criteria: "Direcionalidade", score: analysisResult.structureCriteria.directionality.score },
    ]
  : [];

  const criteriaKeyMap: { [key: string]: keyof typeof analysisResult.structureCriteria } = {
    "Equilíbrio": "balance",
    "Tensão": "tension",
    "Unidade": "unity",
    "Contraste": "contrast",
    "Direcionalidade": "directionality",
  };


  if (!activeScript) {
    return <PagePlaceholder title="Estrutura de Roteiro" description="Para analisar a estrutura do seu roteiro, primeiro selecione um roteiro ativo." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Estrutura de Roteiro</h1>
          <p className="text-muted-foreground">Obtenha um dashboard completo sobre a estrutura e potencial do seu roteiro.</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? "Analisando..." : hasBeenAnalyzed ? "Reanalisar Estrutura" : "Analisar Estrutura"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {loading && (
        <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
      )}

      {analysisResult && !loading && (
        <div className="space-y-8">
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Resumo da Trama</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90">{analysisResult.plotSummary}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Estrutura Narrativa" metric={analysisResult.mainMetrics.narrativeStructure} icon={Clapperboard} />
                <MetricCard title="Desenvolvimento de Personagens" metric={analysisResult.mainMetrics.characterDevelopment} icon={BrainCircuit} />
                <MetricCard title="Potencial Comercial" metric={analysisResult.mainMetrics.commercialPotential} icon={TrendingUp} />
                <MetricCard title="Originalidade" metric={analysisResult.mainMetrics.originality} icon={Lightbulb} />
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen /> Elementos Dramáticos Centrais</CardTitle>
                    <CardDescription>Análise crítica da eficácia de cada elemento chave na narrativa.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResult.dramaticElements.map(element => <DramaticElementCard key={element.name} element={element}/>)}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                    <StructureRadarChart data={chartData} />
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Award /> Análise da Estrutura</CardTitle>
                            <CardDescription>Avaliação quantitativa e qualitativa dos critérios estruturais do roteiro. A IA gera sugestões apenas para notas iguais ou inferiores a 7.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="single" collapsible className="w-full">
                                {chartData.map((item) => {
                                    const key = criteriaKeyMap[item.criteria];
                                    const metricData = key ? analysisResult.structureCriteria[key] : undefined;
                                    
                                    if (!metricData) return null;

                                    return (
                                        <AccordionItem value={item.criteria} key={item.criteria}>
                                            <AccordionTrigger>
                                                <div className="flex items-center justify-between w-full pr-4">
                                                    <span>{item.criteria}</span>
                                                    <span className={`font-bold text-lg ${metricData.score <= 7 ? 'text-amber-500' : 'text-green-500'}`}>
                                                        {metricData.score}/10
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <p className="text-sm text-muted-foreground">{metricData.analysis}</p>
                                                {metricData.score <= 7 && metricData.suggestions && (
                                                    <div className="mt-3 text-xs border-l-2 border-amber-500 pl-3 text-amber-500/90">
                                                        <p className="font-semibold">Sugestão:</p>
                                                        <p>{metricData.suggestions}</p>
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
