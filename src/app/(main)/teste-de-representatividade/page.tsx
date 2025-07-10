"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeScriptRepresentation } from "@/ai/flows/analyze-script-representation";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, CheckCircle2, XCircle, Users, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AnalyzeScriptRepresentationOutput } from "@/ai/flows/analyze-script-representation";

const TestResultCard = ({ title, description, passed, reason }: { title: string; description: string; passed: boolean; reason: string }) => (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Badge variant={passed ? "default" : "destructive"} className="bg-opacity-80">
                    {passed ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                    {passed ? "Aprovado" : "Reprovado"}
                </Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="border-l-2 border-primary pl-4">
                <p className="text-sm text-muted-foreground italic">"{reason}"</p>
            </div>
        </CardContent>
    </Card>
);

const TestResultSkeleton = () => (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-12 w-full" />
        </CardContent>
    </Card>
);


export default function TesteDeRepresentatividadePage() {
    const { activeScript, updateScript } = useScript();
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptRepresentationOutput | undefined>(
      activeScript?.analysis.representation
    );
    const { toast } = useToast();
  
    const handleAnalysis = async () => {
      if (!activeScript) {
        toast({ title: "Erro", description: "Nenhum roteiro ativo selecionado.", variant: "destructive" });
        return;
      }
      setLoading(true);
      try {
        const result = await analyzeScriptRepresentation({ scriptContent: activeScript.content });
        setAnalysisResult(result);
        updateScript({ ...activeScript, analysis: { ...activeScript.analysis, representation: result } });
        toast({ title: "Análise Concluída", description: "O teste de representatividade foi concluído." });
      } catch (error) {
        console.error(error);
        toast({ title: "Erro na Análise", description: "Não foi possível realizar o teste.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    const hasBeenAnalyzed = !!analysisResult;
  
    if (!activeScript) {
      return <PagePlaceholder title="Teste de Representatividade" description="Para avaliar a diversidade do seu roteiro, primeiro selecione um roteiro ativo." />;
    }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Teste de Representatividade</h1>
          <p className="text-muted-foreground">Avalie a diversidade do roteiro com os testes de Bechdel, Vito Russo e DuVernay.</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? "Analisando..." : hasBeenAnalyzed ? "Reanalisar" : "Analisar"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {loading && (
        <div className="space-y-6">
            <TestResultSkeleton />
            <TestResultSkeleton />
            <TestResultSkeleton />
        </div>
      )}

      {analysisResult && !loading && (
        <div className="space-y-6">
            <TestResultCard
                title="Teste de Bechdel"
                description="Avalia a representatividade feminina."
                passed={analysisResult.bechdelTest.passed}
                reason={analysisResult.bechdelTest.reason}
            />
            <TestResultCard
                title="Teste de Vito Russo"
                description="Avalia a representatividade LGBTQIA+."
                passed={analysisResult.vitoRussoTest.passed}
                reason={analysisResult.vitoRussoTest.reason}
            />
            <TestResultCard
                title="Teste de DuVernay"
                description="Avalia a representatividade racial e subversão de estereótipos."
                passed={analysisResult.duVernayTest.passed}
                reason={analysisResult.duVernayTest.reason}
            />
        </div>
      )}
    </div>
  );
}
