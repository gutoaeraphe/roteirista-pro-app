
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, AlertTriangle, Download, Award, CheckSquare, Star } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { analyzeScriptTchekhov } from "@/ai/flows/analyze-script-tchekhov";
import type { AnalyzeScriptTchekhovOutput, TchekhovCriterion } from "@/ai/flows/analyze-script-tchekhov";

const CriterionCard = ({ criterion, index }: { criterion: TchekhovCriterion; index: number }) => (
    <AccordionItem value={`item-${index}`} key={index}>
        <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4 text-left">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{index + 1}.</span>
                    <span>{criterion.criterionName}</span>
                </div>
                <div className="flex items-center gap-1 text-lg font-bold">
                    <span className={cn(
                        criterion.score < 3 ? "text-amber-500" : "text-green-500"
                    )}>
                        {criterion.score}
                    </span>
                    <span className="text-muted-foreground">/ 5</span>
                </div>
            </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
            <div>
                <h4 className="font-semibold text-sm mb-1">Análise</h4>
                <p className="text-sm text-muted-foreground">{criterion.analysis}</p>
            </div>
            <div>
                <h4 className="font-semibold text-sm mb-1">Exemplos do Roteiro</h4>
                <p className="text-sm text-muted-foreground border-l-2 pl-3 italic">"{criterion.examples}"</p>
            </div>
        </AccordionContent>
    </AccordionItem>
);

const AnalysisSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-6 w-full" /></CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent className="space-y-3">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </CardContent>
        </Card>
    </div>
);


export default function ChecklistDeTchekhovPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptTchekhovOutput | undefined>(
    activeScript?.analysis.tchekhov
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
      const result = await analyzeScriptTchekhov({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, tchekhov: result } });
      
      toast({ title: "Análise Concluída", description: "O Checklist de Tchekhov foi aplicado." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível gerar a análise.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createPlainTextDocument = () => {
    if (!analysisResult || !activeScript) return "";

    let content = `Análise "Checklist de Tchekhov" para: ${activeScript.name}\n`;
    content += "==================================================\n\n";

    content += `RESUMO GERAL\n`;
    content += `Pontuação Média: ${analysisResult.averageScore.toFixed(1)} / 5.0\n`;
    content += `--------------------------------------------------\n`;
    content += `${analysisResult.overallSummary}\n\n`;
    
    content += "ANÁLISE DETALHADA DOS CRITÉRIOS\n";
    content += "==================================================\n\n";

    analysisResult.criteria.forEach((item, index) => {
      content += `${index + 1}. ${item.criterionName} (Nota: ${item.score}/5)\n`;
      content += `   Análise: ${item.analysis}\n`;
      content += `   Exemplos: "${item.examples}"\n\n`;
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
    link.download = `checklist_tchekhov_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Checklist de Tchekhov" description="Para aplicar esta análise de economia narrativa, primeiro selecione um roteiro ativo." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Checklist de Tchekhov</h1>
          <p className="text-muted-foreground">Verifique se cada elemento da sua narrativa possui um propósito dramático claro.</p>
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
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2"><Award /> Resumo Geral</div>
                        <div className="flex items-center gap-2 text-2xl font-bold">
                            <Star className="w-6 h-6 text-amber-400" />
                             <span>{analysisResult.averageScore.toFixed(1)} / 5.0</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.overallSummary}</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CheckSquare /> Análise Detalhada dos Critérios</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {analysisResult.criteria.map((criterion, index) => (
                           <CriterionCard criterion={criterion} index={index} key={index} />
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
