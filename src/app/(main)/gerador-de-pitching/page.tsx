"use client";

import { useState, useMemo } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generatePitchingDocument } from "@/ai/flows/generate-pitching-document";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, Presentation, Check, AlertTriangle, Copy } from "lucide-react";
import type { GeneratePitchingDocumentOutput } from "@/ai/flows/generate-pitching-document";

export default function GeradorDePitchingPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<GeneratePitchingDocumentOutput | undefined>(
    activeScript?.analysis.pitchingDocument
  );
  const { toast } = useToast();

  const requiredAnalyses = useMemo(() => {
    if (!activeScript) return [];
    return [
      { name: "Análise Narrativa", done: !!activeScript.analysis.narrative },
      { name: "Análise de Mercado", done: !!activeScript.analysis.market },
      { name: "Análise de Personagens", done: !!activeScript.analysis.characters },
      { name: "Jornada do Herói", done: !!activeScript.analysis.heroJourney },
      { name: "Teste de Representatividade", done: !!activeScript.analysis.representation },
    ];
  }, [activeScript]);

  const allAnalysesDone = useMemo(() => requiredAnalyses.every(a => a.done), [requiredAnalyses]);

  const handleGeneration = async () => {
    if (!activeScript || !allAnalysesDone) {
      toast({ title: "Análises Incompletas", description: "Por favor, execute todas as análises necessárias antes de gerar o documento.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const input = {
        script: activeScript.content,
        analysisSummary: JSON.stringify(activeScript.analysis.narrative?.summary),
        marketAnalysis: JSON.stringify(activeScript.analysis.market),
        characterAnalysis: JSON.stringify(activeScript.analysis.characters),
        heroJourneyAnalysis: JSON.stringify(activeScript.analysis.heroJourney),
        representativityAnalysis: JSON.stringify(activeScript.analysis.representation),
      };
      const result = await generatePitchingDocument(input);
      setDocument(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, pitchingDocument: result } });
      toast({ title: "Documento Gerado", description: "Seu Film Design Document está pronto." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Geração", description: "Não foi possível gerar o documento.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (document?.filmDesignDocument) {
        navigator.clipboard.writeText(document.filmDesignDocument);
        toast({ title: "Copiado!", description: "O documento foi copiado para a área de transferência." });
    }
  }

  if (!activeScript) {
    return <PagePlaceholder title="Gerador de Pitching" description="Para criar um documento de pitching, primeiro selecione um roteiro ativo." />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Gerador de Pitching</h1>
        <p className="text-muted-foreground">Compile todas as análises em um Film Design Document profissional e editável.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Checklist de Análises</CardTitle>
              <CardDescription>É necessário ter todas as análises concluídas para gerar o documento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {requiredAnalyses.map(analysis => (
                <div key={analysis.name} className="flex items-center justify-between text-sm">
                  <p>{analysis.name}</p>
                  {analysis.done ? <Check className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Presentation /> Film Design Document</CardTitle>
              <CardDescription>O documento gerado aparecerá abaixo. Você pode editar o texto antes de copiar.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-full h-96" />
              ) : (
                <Textarea
                  className="w-full h-96 font-mono text-xs"
                  placeholder="Seu documento de pitching aparecerá aqui após a geração."
                  value={document?.filmDesignDocument || ""}
                  onChange={(e) => setDocument({ filmDesignDocument: e.target.value })}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button onClick={handleCopy} variant="outline" disabled={!document}>
                    <Copy className="mr-2 h-4 w-4" /> Copiar
                </Button>
                <Button onClick={handleGeneration} disabled={loading || !allAnalysesDone}>
                    {loading ? "Gerando..." : document ? "Gerar Novamente" : "Gerar Documento"}
                    <Sparkles className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
