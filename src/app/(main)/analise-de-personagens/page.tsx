
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeScriptCharacters } from "@/ai/flows/analyze-script-characters";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, User, Bot, BrainCircuit, Orbit, Target, TrendingUp, TrendingDown, Lightbulb, UserCheck } from "lucide-react";
import type { AnalyzeScriptCharactersOutput } from "@/ai/flows/analyze-script-characters";

const CharacterAnalysisCard = ({ title, content, icon: Icon }: { title: string; content: string; icon: React.ElementType }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg font-semibold"><Icon className="w-5 h-5 text-primary"/> {title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
    </CardContent>
  </Card>
);

const CharacterAnalysisSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[...Array(8)].map((_, i) => (
            <Card key={i}>
                <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-24 w-full" /></CardContent>
            </Card>
        ))}
    </div>
);

export default function AnaliseDePersonagensPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptCharactersOutput | undefined>(
    activeScript?.analysis.characters
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
      const result = await analyzeScriptCharacters({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, characters: result } });
      toast({ title: "Análise Concluída", description: "A análise de personagens foi gerada." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível analisar os personagens.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Análise de Personagens" description="Para analisar os personagens, primeiro selecione um roteiro ativo." />;
  }

  const renderCharacterAnalysis = (analysis: AnalyzeScriptCharactersOutput['protagonistAnalysis'] | AnalyzeScriptCharactersOutput['antagonistAnalysis']) => (
    <div className="space-y-6">
        <CharacterAnalysisCard title="Análise Geral" content={analysis.generalAnalysis} icon={UserCheck} />
        <CharacterAnalysisCard title="Perfil Psicológico" content={analysis.psychologicalProfile} icon={BrainCircuit} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CharacterAnalysisCard title="Forças" content={analysis.strengths} icon={TrendingUp} />
            <CharacterAnalysisCard title="Fraquezas" content={analysis.weaknesses} icon={TrendingDown} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CharacterAnalysisCard title="Motivações Internas" content={analysis.internalMotivations} icon={Target}/>
            <CharacterAnalysisCard title="Motivações Externas" content={analysis.externalMotivations} icon={User}/>
        </div>
        <CharacterAnalysisCard title="Arco do Personagem" content={analysis.arc} icon={Orbit}/>
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary"><Lightbulb className="w-5 h-5"/> Sugestões para Melhorar</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{analysis.improvementSuggestions}</p>
            </CardContent>
        </Card>
    </div>
  )

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Análise de Personagens</h1>
          <p className="text-muted-foreground">Avalie o perfil psicológico, motivações e arco do protagonista e antagonista.</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? "Analisando..." : hasBeenAnalyzed ? "Reanalisar Personagens" : "Analisar Personagens"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>
        
        <Tabs defaultValue="protagonist" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="protagonist"><User className="mr-2 h-4 w-4"/> Protagonista</TabsTrigger>
            <TabsTrigger value="antagonist"><Bot className="mr-2 h-4 w-4"/> Antagonista</TabsTrigger>
          </TabsList>

          {loading && (
              <TabsContent value="protagonist"><CharacterAnalysisSkeleton /></TabsContent>
          )}

          {analysisResult && !loading && (
            <>
                <TabsContent value="protagonist" className="mt-6">
                    {renderCharacterAnalysis(analysisResult.protagonistAnalysis)}
                </TabsContent>
                <TabsContent value="antagonist" className="mt-6">
                    {renderCharacterAnalysis(analysisResult.antagonistAnalysis)}
                </TabsContent>
            </>
          )}
        </Tabs>
    </div>
  );
}
