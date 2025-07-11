
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generatePitchingDocument } from "@/ai/flows/generate-pitching-document";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, Copy, FileText, Target, Milestone, Users, Palette, BarChart3, TrendingUp, Handshake, Rocket } from "lucide-react";
import type { GeneratePitchingDocumentOutput } from "@/ai/flows/generate-pitching-document";
import ReactMarkdown from 'react-markdown';
import { NoCreditsPlaceholder } from "@/components/layout/no-credits-placeholder";

const InfoCard = ({ title, content, icon: Icon, className }: { title: string; content: string; icon: React.ElementType; className?: string }) => (
    <Card className={className}>
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
  const { userProfile, updateUserProfile } = useAuth();
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
     if (!userProfile?.isAdmin && (userProfile?.credits ?? 0) <= 0) {
      toast({ title: "Créditos Insuficientes", description: "Você precisa de créditos para realizar esta análise.", variant: "destructive" });
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
      
      if (!userProfile?.isAdmin) {
        await updateUserProfile({ credits: (userProfile?.credits ?? 0) - 1 });
      }

      toast({ title: "Documento Gerado", description: "Seu documento de pitching está pronto. 1 crédito foi consumido." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Geração", description: "Não foi possível gerar o documento.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createPlainTextDocument = (doc: GeneratePitchingDocumentOutput): string => {
    const docData = doc.pitchingDocument;
    return `
# Documento de Pitching: ${activeScript?.name || 'Projeto'}

## Elevator Pitch
${docData.elevatorPitch}

## Logline
${docData.logline}

## Sinopse
${docData.synopsis}

## Tema
${docData.theme}

## Público-Alvo
${docData.targetAudience}

## Justificativa
${docData.justification}

## Personagens Principais
${docData.mainCharacters}

## Tom e Estilo
${docData.toneAndStyle}

## Arco da História
${docData.storyArc}

## Argumento Detalhado
${docData.detailedArgument}

## Potencial de Marketing
${docData.marketingPotential}
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

  if (!userProfile?.isAdmin && (userProfile?.credits ?? 0) <= 0) {
    return <NoCreditsPlaceholder title="Gerador de Pitching" />;
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
                {loading ? "Gerando..." : hasBeenGenerated ? "Gerar Novamente (-1 crédito)" : "Gerar Documento (-1 crédito)"}
                <Sparkles className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </header>
      
      {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full md:col-span-2" />
            {[...Array(10)].map((_, i) => <InfoCardSkeleton key={i} />)}
          </div>
      )}

      {currentDocument && !loading && (
        <div className="space-y-6">
            <InfoCard title="Elevator Pitch" content={currentDocument.pitchingDocument.elevatorPitch} icon={Rocket} className="bg-primary/5 border-primary/20" />
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
