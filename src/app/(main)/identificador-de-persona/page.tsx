
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, AlertTriangle, Download, User, Target, Users, MessageSquare, Heart, Tv, Bot } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { generateAudiencePersonas } from "@/ai/flows/generate-audience-personas";
import type { GenerateAudiencePersonasOutput, PersonaProfile } from "@/ai/flows/generate-audience-personas";

const Section = ({ title, content, icon: Icon }: { title: string, content: string, icon: React.ElementType }) => (
    <div>
        <h4 className="font-semibold text-sm flex items-center gap-2 mb-1"><Icon className="w-4 h-4 text-primary"/>{title}</h4>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
    </div>
);

const PersonaCard = ({ persona, title }: { persona: PersonaProfile, title: string }) => (
    <Card className="flex flex-col">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{persona.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
            <Section title="Dados Demográficos" content={persona.demographics} icon={User} />
            <Separator />
            <Section title="Perfil Psicográfico (Desejos e Dores)" content={persona.psychographics} icon={Heart} />
             <Separator />
            <Section title="Redes de Interação e Interesses" content={persona.interactionNetworks} icon={Users} />
             <Separator />
            <Section title="Comportamento de Audiência" content={persona.audienceBehavior} icon={Tv} />
             <Separator />
            <Section title="Relação como Fã" content={persona.fanRelationship} icon={Target} />
             <Separator />
            <Section title="Engajamento em Comunidades" content={persona.communityEngagement} icon={MessageSquare} />
        </CardContent>
    </Card>
);


const AnalysisSkeleton = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(6)].map((_, j) => <Skeleton key={j} className="h-16 w-full" />)}
                    </CardContent>
                </Card>
            ))}
        </div>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent><Skeleton className="h-20 w-full" /></CardContent>
        </Card>
    </div>
);


export default function IdentificadorDePersonaPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GenerateAudiencePersonasOutput | undefined>(
    activeScript?.analysis.audiencePersonas
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
      const result = await generateAudiencePersonas({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, audiencePersonas: result } });
      
      toast({ title: "Análise Concluída", description: "As personas de público-alvo foram geradas." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível gerar as personas.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createPlainTextDocument = () => {
    if (!analysisResult || !activeScript) return "";

    const formatPersona = (persona: PersonaProfile, title: string) => {
        return `
## ${title}: ${persona.name}
---------------------------------
### Dados Demográficos
${persona.demographics}
### Perfil Psicográfico (Desejos e Dores)
${persona.psychographics}
### Redes de Interação e Interesses
${persona.interactionNetworks}
### Comportamento de Audiência
${persona.audienceBehavior}
### Relação como Fã
${persona.fanRelationship}
### Engajamento em Comunidades
${persona.communityEngagement}
`;
    };

    let content = `Identificador de Persona para: ${activeScript.name}\n`;
    content += "==================================================\n\n";

    content += formatPersona(analysisResult.primaryPersona, "Persona Primária");
    content += "\n==================================================\n\n";
    content += formatPersona(analysisResult.secondaryPersona, "Persona Secundária");
     content += "\n==================================================\n\n";
    content += "## Resumo Estratégico\n";
    content += analysisResult.strategicSummary;

    return content.trim();
  };

  const handleDownload = () => {
    const content = createPlainTextDocument();
    if (!content || !activeScript) return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `identificador_persona_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Identificador de Persona" description="Para gerar as personas do seu roteiro, primeiro selecione um roteiro ativo." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Identificador de Persona</h1>
          <p className="text-muted-foreground">Gere os perfis de público-alvo primário e secundário para o seu projeto.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" disabled={!hasBeenAnalyzed || loading}>
                <Download className="mr-2 h-4 w-4" /> Baixar TXT
            </Button>
            <Button onClick={handleAnalysis} disabled={loading}>
            {loading ? "Analisando..." : hasBeenAnalyzed ? "Analisar Novamente" : "Identificar Personas"}
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
               <PersonaCard persona={analysisResult.primaryPersona} title="Persona Primária" />
               <PersonaCard persona={analysisResult.secondaryPersona} title="Persona Secundária" />
            </div>
             <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Bot /> Resumo Estratégico</CardTitle>
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
