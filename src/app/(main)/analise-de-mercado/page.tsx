"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeScriptMarket } from "@/ai/flows/analyze-script-market";
import { analyzeScriptStructure } from "@/ai/flows/analyze-script-structure";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, Target, TrendingUp, Lightbulb, BookCopy, Tv, BarChartBig } from "lucide-react";
import type { AnalyzeScriptMarketOutput } from "@/ai/flows/analyze-script-market";

const InfoCard = ({ title, content, icon: Icon }: { title: string; content: string; icon: React.ElementType }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Icon className="w-5 h-5 text-primary"/> {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
);

const InfoCardSkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>
        <CardContent><Skeleton className="h-16 w-full" /></CardContent>
    </Card>
);

export default function AnaliseDeMercadoPage() {
    const { activeScript, updateScript } = useScript();
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptMarketOutput | undefined>(
      activeScript?.analysis.market
    );
    const { toast } = useToast();
  
    const handleAnalysis = async () => {
      if (!activeScript) {
        toast({ title: "Erro", description: "Nenhum roteiro ativo selecionado.", variant: "destructive" });
        return;
      }
      setLoading(true);
      try {
        // We need a summary for this analysis. Let's generate it if it doesn't exist.
        let summary = activeScript.analysis.structure?.plotSummary;
        let scriptToUpdate = { ...activeScript };

        if (!summary) {
            const structureResult = await analyzeScriptStructure({ scriptContent: activeScript.content });
            summary = structureResult.plotSummary;
            scriptToUpdate.analysis.structure = structureResult;
        }

        const result = await analyzeScriptMarket({ scriptSummary: summary, genre: activeScript.genre });
        setAnalysisResult(result);
        
        scriptToUpdate.analysis.market = result;
        updateScript(scriptToUpdate);
        toast({ title: "Análise Concluída", description: "A análise de mercado foi gerada e salva." });

      } catch (error) {
        console.error(error);
        toast({ title: "Erro na Análise", description: "Não foi possível analisar o mercado.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
  
    const hasBeenAnalyzed = !!analysisResult;
  
    if (!activeScript) {
      return <PagePlaceholder title="Análise de Mercado" description="Para analisar o potencial de mercado do seu roteiro, primeiro selecione um roteiro ativo." />;
    }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise de Mercado</h1>
          <p className="text-muted-foreground">Obtenha insights comerciais sobre seu roteiro.</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? "Analisando..." : hasBeenAnalyzed ? "Reanalisar Mercado" : "Analisar Mercado"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <InfoCardSkeleton key={i} />)}
          </div>
      )}

      {analysisResult && !loading && (
        <div className="space-y-6">
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChartBig /> Viabilidade Comercial</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90">{analysisResult.commercialViability}</p>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard title="Público-alvo" content={analysisResult.targetAudience} icon={Target} />
                <InfoCard title="Tendências de Mercado" content={analysisResult.marketTrends} icon={TrendingUp} />
                <InfoCard title="Originalidade" content={analysisResult.originality} icon={Lightbulb} />
                <InfoCard title="Obras de Referência" content={analysisResult.referenceWorks} icon={BookCopy} />
                <InfoCard title="Canais de Distribuição" content={analysisResult.distributionChannels} icon={Tv} />
            </div>
        </div>
      )}
    </div>
  );
}
