
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, AlertTriangle, Download, Award, Target, MessageSquare, Lightbulb, UserCheck, Search, Drama, Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { analyzeReceptionAndEngagement } from "@/ai/flows/analyze-reception-engagement";
import type { AnalyzeReceptionAndEngagementOutput, AnalysisCriterion } from "@/ai/flows/analyze-reception-engagement";

const CriterionItem = ({ criterion }: { criterion: AnalysisCriterion }) => (
    <div className="border-t pt-4">
        <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-sm">{criterion.parameterName}</h4>
            <div className="flex items-center gap-1 text-base font-bold">
                <span className={cn(
                    criterion.score <= 7 ? "text-amber-500" : "text-green-500"
                )}>
                    {criterion.score}
                </span>
                <span className="text-muted-foreground">/ 10</span>
            </div>
        </div>
        <p className="text-sm text-muted-foreground">{criterion.analysis}</p>
        {criterion.score <= 7 && criterion.suggestions && (
            <div className="mt-3 text-sm border-l-2 border-amber-500 pl-3">
                <p className="font-semibold text-amber-600 dark:text-amber-500 flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Sugestão para Melhorar:</p>
                <p className="text-amber-600/90 dark:text-amber-500/90">{criterion.suggestions}</p>
            </div>
        )}
    </div>
);

const AnalysisSkeleton = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent><Skeleton className="h-16 w-full" /></CardContent>
        </Card>
    </div>
);


export default function AnaliseDeRecepcaoPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeReceptionAndEngagementOutput | undefined>(
    activeScript?.analysis.receptionAndEngagement
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
      const result = await analyzeReceptionAndEngagement({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, receptionAndEngagement: result } });
      
      toast({ title: "Análise Concluída", description: "A análise de recepção foi aplicada." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível gerar a análise.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createPlainTextDocument = () => {
    if (!analysisResult || !activeScript) return "";

    let content = `Análise de Recepção e Engajamento para: ${activeScript.name}\n`;
    content += "==================================================\n\n";

    const formatModule = (module: AnalyzeReceptionAndEngagementOutput['receptionAnalysis']) => {
        let text = `# ${module.moduleName}\n\n`;
        module.criteria.forEach(item => {
            text += `## ${item.parameterName} (Nota: ${item.score}/10)\n`;
            text += `${item.analysis}\n`;
            if (item.suggestions) {
                text += `Sugestão: ${item.suggestions}\n`;
            }
            text += `\n`;
        });
        return text;
    };

    content += formatModule(analysisResult.receptionAnalysis);
    content += formatModule(analysisResult.spectatorshipAnalysis);
    
    content += "# Resumo Estratégico\n";
    content += `${analysisResult.strategicSummary}\n`;
    
    return content.trim();
  };

  const handleDownload = () => {
    const content = createPlainTextDocument();
    if (!content || !activeScript) return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analise_recepcao_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Análise de Recepção" description="Para realizar esta análise, primeiro selecione um roteiro ativo." />;
  }
  
  const receptionIcons = [Lightbulb, Target, MessageSquare, UserCheck];
  const spectatorshipIcons = [Drama, Search, Drama, Eye];


  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise de Recepção e Engajamento</h1>
          <p className="text-muted-foreground">Diagnóstico preditivo de como a audiência interpretará e sentirá sua história.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb /> {analysisResult.receptionAnalysis.moduleName}</CardTitle>
                        <CardDescription>Como a história será interpretada?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {analysisResult.receptionAnalysis.criteria.map((criterion, index) => (
                           <CriterionItem criterion={criterion} key={index} />
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Drama /> {analysisResult.spectatorshipAnalysis.moduleName}</CardTitle>
                        <CardDescription>Como a história será sentida?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {analysisResult.spectatorshipAnalysis.criteria.map((criterion, index) => (
                           <CriterionItem criterion={criterion} key={index} />
                        ))}
                    </CardContent>
                </Card>
            </div>
             <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Award /> Resumo Estratégico</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.strategicSummary}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
