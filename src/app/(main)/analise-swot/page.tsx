
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, AlertTriangle, Download, ThumbsUp, ThumbsDown, PackageOpen, Bomb, ShieldCheck, FileText } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeScriptSwot } from "@/ai/flows/analyze-script-swot";
import type { AnalyzeScriptSwotOutput } from "@/ai/flows/analyze-script-swot";

const SwotSectionCard = ({ title, content, icon: Icon, className }: { title: string; content: string; icon: React.ElementType, className?: string }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Icon className="w-5 h-5 text-primary"/> {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-muted-foreground">
            <ReactMarkdown components={{
                h3: ({node, ...props}) => <h3 className="text-foreground/90 font-semibold" {...props} />,
                strong: ({node, ...props}) => <strong className="text-foreground/90" {...props} />,
            }}>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
);

const SwotSectionSkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
        <CardContent><Skeleton className="h-40 w-full" /></CardContent>
    </Card>
);


export default function AnaliseSwotPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptSwotOutput | undefined>(
    activeScript?.analysis.swot
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
      const result = await analyzeScriptSwot({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, swot: result } });
      
      toast({ title: "Análise Concluída", description: "Sua análise SWOT está pronta." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível gerar a análise SWOT.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createPlainTextDocument = () => {
    if (!analysisResult || !activeScript) return "";

    return `
Análise SWOT para: ${activeScript.name}
==================================================

FORÇAS (Análise Interna - Mentor Criativo)
--------------------------------------------------
${analysisResult.strengths}

FRAQUEZAS (Análise Interna - Mentor Criativo)
--------------------------------------------------
${analysisResult.weaknesses}

OPORTUNIDADES (Análise Externa - Estrategista de Mercado)
--------------------------------------------------
${analysisResult.opportunities}

AMEAÇAS (Análise Externa - Estrategista de Mercado)
--------------------------------------------------
${analysisResult.threats}

RESUMO E PRÓXIMOS PASSOS
--------------------------------------------------
${analysisResult.summary}
    `.trim().replace(/###\s/g, '').replace(/-\s/g, '  - '); // Simple markdown to text conversion
  };

  const handleDownload = () => {
    const content = createPlainTextDocument();
    if (!content || !activeScript) return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analise_swot_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Análise SWOT" description="Para gerar uma análise SWOT do seu roteiro, primeiro selecione um roteiro ativo." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise SWOT</h1>
          <p className="text-muted-foreground">Diagnóstico completo unindo análise criativa e estratégica de mercado.</p>
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

      {loading && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SwotSectionSkeleton />
                <SwotSectionSkeleton />
                <SwotSectionSkeleton />
                <SwotSectionSkeleton />
            </div>
            <SwotSectionSkeleton />
        </div>
      )}

      {analysisResult && !loading && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <SwotSectionCard title="Forças" content={analysisResult.strengths} icon={ThumbsUp} className="bg-green-500/5 border-green-500/20"/>
                <SwotSectionCard title="Fraquezas" content={analysisResult.weaknesses} icon={ThumbsDown} className="bg-amber-500/5 border-amber-500/20"/>
                <SwotSectionCard title="Oportunidades" content={analysisResult.opportunities} icon={PackageOpen} className="bg-blue-500/5 border-blue-500/20"/>
                <SwotSectionCard title="Ameaças" content={analysisResult.threats} icon={Bomb} className="bg-red-500/5 border-red-500/20"/>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck /> Resumo e Próximos Passos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{analysisResult.summary}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
