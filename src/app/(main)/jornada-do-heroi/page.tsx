
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
import { Sparkles, GitCommitHorizontal, AlertTriangle, BookCheck, Download } from "lucide-react";
import type { AnalyzeScriptHeroJourneyOutput, HeroJourneyStep } from "@/ai/flows/analyze-script-hero-journey";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const StepCard = ({ step, index }: { step: HeroJourneyStep; index: number }) => (
    <AccordionItem value={`item-${index}`} key={index}>
        <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center text-left">
                    <span className={cn(
                        "font-bold mr-2",
                        step.score === 0 ? "text-destructive" : "text-primary"
                    )}>
                        {index + 1}.
                    </span> {step.stepName}
                </div>
                 <span className={cn(
                    "font-bold text-lg",
                    step.score === 0 ? "text-destructive" : (step.score <= 7 ? "text-amber-500" : "text-green-500")
                )}>
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
      toast({ title: "Erro", description: "Nenhum roteiro ativo selecionado.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setAnalysisResult(undefined);
    try {
      const result = await analyzeScriptHeroJourney({ script: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, heroJourney: result } });
      
      toast({ title: "Análise Concluída", description: "A jornada do herói foi mapeada com sucesso." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível analisar a jornada do herói. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!analysisResult || !activeScript) return;

    let content = `Análise da Jornada do Herói para: ${activeScript.name}\n`;
    content += "==================================================\n\n";

    content += `Análise Dramatúrgica Geral (Nota: ${analysisResult.overallAnalysis.score}/10)\n`;
    content += `--------------------------------------------------\n`;
    content += `${analysisResult.overallAnalysis.summary}\n`;
    if (analysisResult.overallAnalysis.suggestions) {
      content += `\nSugestão Geral: ${analysisResult.overallAnalysis.suggestions}\n`;
    }
    content += "\n";

    content += "Análise de 3 Atos\n";
    content += `--------------------------------------------------\n`;
    content += `Primeiro Ato (Apresentação):\n${analysisResult.threeActAnalysis.actOne}\n\n`;
    content += `Segundo Ato (Confronto):\n${analysisResult.threeActAnalysis.actTwo}\n\n`;
    content += `Terceiro Ato (Resolução):\n${analysisResult.threeActAnalysis.actThree}\n\n`;

    content += "Passos da Jornada Identificados\n";
    content += `--------------------------------------------------\n\n`;
    analysisResult.identifiedSteps.forEach((step, index) => {
      content += `${index + 1}. ${step.stepName} (Nota: ${step.score}/10, Intensidade: ${step.intensity}/100)\n`;
      content += `Análise: ${step.analysis}\n`;
      if (step.suggestions) {
        content += `Sugestão: ${step.suggestions}\n`;
      }
      content += "\n";
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analise_jornada_heroi_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const hasBeenAnalyzed = !!analysisResult;
  
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
        <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" disabled={!hasBeenAnalyzed || loading}>
                <Download className="mr-2 h-4 w-4" /> Baixar TXT
            </Button>
            <Button onClick={handleAnalysis} disabled={loading}>
                {loading ? "Analisando..." : hasBeenAnalyzed ? "Analisar Novamente" : "Analisar"}
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
      
      {loading && (
        <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-96 w-full" />
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
        </div>
      )}
    </div>
  );
}
