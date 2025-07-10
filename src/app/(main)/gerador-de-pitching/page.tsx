
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generatePitchingDocument } from "@/ai/flows/generate-pitching-document";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, Presentation, Copy } from "lucide-react";
import type { GeneratePitchingDocumentOutput } from "@/ai/flows/generate-pitching-document";

export default function GeradorDePitchingPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<GeneratePitchingDocumentOutput | undefined>(
    activeScript?.analysis.pitchingDocument
  );
  const { toast } = useToast();

  const handleGeneration = async () => {
    if (!activeScript) {
      toast({ title: "Erro", description: "Por favor, selecione um roteiro ativo antes de gerar o documento.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setDocument(undefined);
    try {
      const input = {
        scriptContent: activeScript.content,
        genre: activeScript.genre,
      };
      const result = await generatePitchingDocument(input);
      setDocument(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, pitchingDocument: result } });
      toast({ title: "Documento Gerado", description: "Seu documento de pitching está pronto." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Geração", description: "Não foi possível gerar o documento.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (document?.pitchingDocument) {
        navigator.clipboard.writeText(document.pitchingDocument);
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Presentation /> Documento de Venda (Pitch)</CardTitle>
          <CardDescription>A IA irá gerar um documento completo baseado no roteiro ativo. Você pode editá-lo antes de copiar.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="w-full h-96" />
          ) : (
            <Textarea
              className="w-full h-96 font-mono text-xs"
              placeholder="Seu documento de pitching aparecerá aqui após a geração."
              value={document?.pitchingDocument || activeScript?.analysis.pitchingDocument?.pitchingDocument || ""}
              onChange={(e) => setDocument({ pitchingDocument: e.target.value })}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button onClick={handleCopy} variant="outline" disabled={!document && !activeScript?.analysis.pitchingDocument}>
                <Copy className="mr-2 h-4 w-4" /> Copiar
            </Button>
            <Button onClick={handleGeneration} disabled={loading}>
                {loading ? "Gerando..." : document ? "Gerar Novamente" : "Gerar Documento"}
                <Sparkles className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
