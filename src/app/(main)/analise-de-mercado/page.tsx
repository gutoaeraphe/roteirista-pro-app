
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeScriptMarket } from "@/ai/flows/analyze-script-market";
import { analyzeScriptStructure } from "@/ai/flows/analyze-script-structure";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, Target, TrendingUp, Lightbulb, BookCopy, Tv, BarChartBig, Users, Briefcase, Gift, Globe, Shuffle, AlertTriangle } from "lucide-react";
import type { AnalyzeScriptMarketOutput } from "@/ai/flows/analyze-script-market";
import { NoCreditsPlaceholder } from "@/components/layout/no-credits-placeholder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const InfoCard = ({ title, content, icon: Icon }: { title: string; content: string; icon: React.ElementType }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Icon className="w-5 h-5 text-primary"/> {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
);

const InfoCardSkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>
        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
    </Card>
);

export default function AnaliseDeMercadoPage() {
    const { activeScript, updateScript } = useScript();
    const { userProfile, updateUserProfile } = useAuth();
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
      if (!userProfile?.isAdmin && (userProfile?.credits ?? 0) <= 0) {
        toast({ title: "Créditos Insuficientes", description: "Você precisa de créditos para realizar esta análise.", variant: "destructive" });
        return;
      }

      setLoading(true);
      setAnalysisResult(undefined);
      try {
        let summary = activeScript.analysis.structure?.plotSummary;
        let scriptToUpdate = { ...activeScript };

        if (!summary) {
            toast({ title: "Gerando Resumo", description: "É necessário um resumo da trama para a análise de mercado..." });
            const structureResult = await analyzeScriptStructure({ scriptContent: activeScript.content });
            summary = structureResult.plotSummary;
            scriptToUpdate.analysis.structure = structureResult; // Salva a análise de estrutura também
        }

        const result = await analyzeScriptMarket({ scriptSummary: summary, genre: activeScript.genre });
        setAnalysisResult(result);
        
        scriptToUpdate.analysis.market = result;
        updateScript(scriptToUpdate);
        
        if (!userProfile?.isAdmin) {
            await updateUserProfile({ credits: (userProfile?.credits ?? 0) - 1 });
        }

        toast({ title: "Análise Concluída", description: "A análise de mercado foi gerada e salva. 1 crédito foi consumido." });

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

    if (!userProfile?.isAdmin && (userProfile?.credits ?? 0) <= 0) {
        return <NoCreditsPlaceholder title="Análise de Mercado" />;
    }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise de Mercado</h1>
          <p className="text-muted-foreground">Obtenha insights comerciais e estratégicos sobre o seu roteiro.</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? "Analisando..." : hasBeenAnalyzed ? "Reanalisar Mercado (-1 crédito)" : "Analisar Mercado (-1 crédito)"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Aviso de IA</AlertTitle>
        <AlertDescription>
            As respostas e interações desta página são geradas por Inteligência Artificial. Esta tecnologia pode cometer erros e produzir informações inconsistentes. Recomendamos a revisão humana de todo o conteúdo.
        </AlertDescription>
      </Alert>

      {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                  <CardContent><Skeleton className="h-20 w-full" /></CardContent>
              </Card>
            {[...Array(8)].map((_, i) => <InfoCardSkeleton key={i} />)}
          </div>
      )}

      {analysisResult && !loading && (
        <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                           <BarChartBig /> Potencial Comercial
                        </div>
                        <span className={`text-2xl font-bold ${analysisResult.commercialPotential.score <= 7 ? 'text-amber-500' : 'text-green-500'}`}>
                            {analysisResult.commercialPotential.score}/10
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.commercialPotential.description}</p>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard title="Público-alvo" content={analysisResult.targetAudience} icon={Users} />
                <InfoCard title="Potencial de Mercado (Brasil)" content={analysisResult.marketPotential} icon={Globe} />
                <InfoCard title="Tendências de Conteúdo" content={analysisResult.contentTrends} icon={TrendingUp} />
                <InfoCard title="Originalidade e Diferenciação" content={analysisResult.originalityAndDifferentiation} icon={Lightbulb} />
                <InfoCard title="Potencial de Marketing e Venda" content={analysisResult.marketingAndSalesPotential} icon={Briefcase} />
                <InfoCard title="Produtos Complementares" content={analysisResult.complementaryProducts} icon={Gift} />
                <InfoCard title="Obras de Referência" content={analysisResult.referenceWorks} icon={BookCopy} />
                <InfoCard title="Canais de Distribuição" content={analysisResult.distributionChannels} icon={Tv} />
            </div>
        </div>
      )}
    </div>
  );
}
