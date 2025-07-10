
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generatePitchingDocument } from "@/ai/flows/generate-pitching-document";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, Copy, FileText, Target, Milestone, Users, Palette, BarChart3, TrendingUp, Handshake } from "lucide-react";
import type { GeneratePitchingDocumentOutput } from "@/ai/flows/generate-pitching-document";
import ReactMarkdown from 'react-markdown';

const InfoCard = ({ title, content, icon: Icon }: { title: string; content: string; icon: React.ElementType }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Icon className="w-5 h-5 text-primary"/> {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-muted-foreground">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
);

const InfoCardSkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>
        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
    </Card>
);

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

  const createPlainTextDocument = (doc: GeneratePitchingDocumentOutput): string => {
    return `
# Documento de Pitching: ${activeScript?.name || 'Projeto'}

## Logline
${doc.pitchingDocument.logline}

## Sinopse
${doc.pitchingDocument.synopsis}

## Tema
${doc.pitchingDocument.theme}

## Público-Alvo
${doc.pitchingDocument.targetAudience}

## Justificativa
${doc.pitchingDocument.justification}

## Personagens Principais
${doc.pitchingDocument.mainCharacters}

## Tom e Estilo
${doc.pitchingDocument.toneAndStyle}

## Arco da História
${doc.pitchingDocument.storyArc}

## Argumento Detalhado
${doc.pitchingDocument.detailedArgument}

## Potencial de Marketing
${doc.pitchingDocument.marketingPotential}
    `.trim();
  }

  const handleCopy = () => {
    const docToCopy = document || activeScript?.analysis.pitchingDocument;
    if (docToCopy) {
        const plainText = createPlainTextDocument(docToCopy);
        navigator.clipboard.writeText(plainText);
        toast({ title: "Copiado!", description: "O documento foi copiado para a área de transferência." });
    }
  }

  const hasBeenGenerated = !!document || !!activeScript?.analysis.pitchingDocument;

  if (!activeScript) {
    return <PagePlaceholder title="Gerador de Pitching" description="Para criar um documento de pitching, primeiro selecione um roteiro ativo." />;
  }

  const currentDocument = document || activeScript?.analysis.pitchingDocument;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold">Gerador de Pitching</h1>
            <p className="text-muted-foreground">Compile as informações em um documento de venda profissional.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" disabled={!hasBeenGenerated || loading}>
                <Copy className="mr-2 h-4 w-4" /> Copiar Texto
            </Button>
            <Button onClick={handleGeneration} disabled={loading}>
                {loading ? "Gerando..." : hasBeenGenerated ? "Gerar Novamente" : "Gerar Documento"}
                <Sparkles className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </header>
      
      {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(10)].map((_, i) => <InfoCardSkeleton key={i} />)}
          </div>
      )}

      {currentDocument && !loading && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard title="Logline" content={currentDocument.pitchingDocument.logline} icon={Milestone} />
                <InfoCard title="Sinopse" content={currentDocument.pitchingDocument.synopsis} icon={FileText} />
                <InfoCard title="Tema" content={currentDocument.pitchingDocument.theme} icon={Handshake} />
                <InfoCard title="Público-Alvo" content={currentDocument.pitchingDocument.targetAudience} icon={Target} />
                <InfoCard title="Justificativa" content={currentDocument.pitchingDocument.justification} icon={TrendingUp} />
                <InfoCard title="Personagens Principais" content={currentDocument.pitchingDocument.mainCharacters} icon={Users} />
                <InfoCard title="Tom e Estilo" content={currentDocument.pitchingDocument.toneAndStyle} icon={Palette} />
                <InfoCard title="Arco da História" content={currentDocument.pitchingDocument.storyArc} icon={BarChart3} />
            </div>
            <InfoCard title="Argumento Detalhado" content={currentDocument.pitchingDocument.detailedArgument} icon={FileText} />
            <InfoCard title="Potencial de Marketing" content={currentDocument.pitchingDocument.marketingPotential} icon={TrendingUp} />
        </div>
      )}
    </div>
  );
}
