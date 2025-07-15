
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeScriptRepresentation } from "@/ai/flows/analyze-script-representation";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, CheckCircle2, XCircle, Users, AlertCircle, Award, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AnalyzeScriptRepresentationOutput } from "@/ai/flows/analyze-script-representation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NoCreditsPlaceholder } from "@/components/layout/no-credits-placeholder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type TestResult = AnalyzeScriptRepresentationOutput['bechdelTest'];

const getTestStatus = (result: TestResult) => {
    const passedCount = result.criteria.filter(c => c.passed).length;
    const totalCount = result.criteria.length;
    const percentage = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

    if (percentage === 100) {
        return { label: "Aprovado", variant: "default", icon: CheckCircle2 } as const;
    }
    if (percentage >= 50) {
        return { label: "Aprovado com Ressalvas", variant: "secondary", icon: AlertCircle } as const;
    }
    return { label: "Reprovado", variant: "destructive", icon: XCircle } as const;
}

const TestResultCard = ({ result, description }: { result: TestResult, description: string }) => {
    const status = getTestStatus(result);
    const StatusIcon = status.icon;
    
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{result.testName}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <Badge variant={status.variant} className="bg-opacity-80">
                        <StatusIcon className="mr-1 h-4 w-4" />
                        {status.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm text-muted-foreground italic">"{result.summary}"</p>
                </div>
                <div className="space-y-3">
                    {result.criteria.map((criterion, index) => (
                        <div key={index} className="flex items-start gap-3">
                            {criterion.passed ? <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />}
                            <div>
                                <p className="font-semibold text-sm">{criterion.criterion}</p>
                                <p className="text-xs text-muted-foreground">{criterion.reasoning}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
};

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
            <div className="space-y-4 mt-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
        </CardContent>
    </Card>
);


export default function TesteDeRepresentatividadePage() {
    const { activeScript, updateScript } = useScript();
    const { userProfile, updateUserProfile } = useAuth();
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
      if (!userProfile?.isAdmin && (userProfile?.credits ?? 0) <= 0) {
        toast({ title: "Créditos Insuficientes", description: "Você precisa de créditos para realizar esta análise.", variant: "destructive" });
        return;
      }
      setLoading(true);
      try {
        const result = await analyzeScriptRepresentation({ scriptContent: activeScript.content });
        setAnalysisResult(result);
        updateScript({ ...activeScript, analysis: { ...activeScript.analysis, representation: result } });
        
        if (!userProfile?.isAdmin) {
          await updateUserProfile({ credits: (userProfile?.credits ?? 0) - 1 });
        }

        toast({ title: "Análise Concluída", description: "O teste de representatividade foi concluído. 1 crédito foi consumido." });
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

    if (!userProfile?.isAdmin && (userProfile?.credits ?? 0) <= 0) {
      return <NoCreditsPlaceholder title="Teste de Representatividade" />;
    }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Teste de Representatividade</h1>
          <p className="text-muted-foreground">Avalie a diversidade do roteiro com os testes de Bechdel, Vito Russo e DuVernay.</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? "Analisando..." : hasBeenAnalyzed ? "Reanalisar (-1 crédito)" : "Analisar (-1 crédito)"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>
      
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Aviso de IA</AlertTitle>
        <AlertDescription>
            As respostas e interações desta página são geradas por Inteligência Artificial. Esta tecnologia pode cometer erros e produzir informações inconsistentes. Recomendamos a revisão humana de todo o conteúdo.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-2"><Award />AVISO: Como Usar os Testes de Representatividade Corretamente</AccordionTrigger>
            <AccordionContent className="space-y-4 text-muted-foreground">
                <p>É crucial entender que os testes de Bechdel, Vito Russo e DuVernay não são uma lista de verificação (checklist) nem um selo de qualidade progressista. A principal armadilha é usá-los de forma superficial. Para um bom uso, lembre-se sempre que:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-semibold text-foreground/90">Passar não garante qualidade:</span> Uma obra pode cumprir todas as regras de um teste e ainda assim apresentar uma representação rasa, estereotipada ou problemática. Os testes medem um padrão mínimo, não a profundidade da representação.</li>
                    <li><span className="font-semibold text-foreground/90">O contexto da história é soberano:</span> Um filme pode falhar em um teste por razões narrativas justificadas (como um drama histórico com um cenário específico). A questão não é o fracasso em si, mas se a ausência de certas vozes é uma escolha consciente ou um ponto cego do roteirista.</li>
                    <li><span className="font-semibold text-foreground/90">São ferramentas de diagnóstico, não de punição:</span> O objetivo não é "cancelar" ou descartar obras. O maior valor dos testes é provocar a autoanálise e ajudar o criador a identificar oportunidades de aprofundar seus personagens e sua história.</li>
                </ul>
                <p>A verdadeira utilidade destes testes está em mudar a pergunta. Em vez de focar em "Como faço para meu roteiro passar?", o roteirista deve se perguntar:</p>
                <blockquote className="border-l-2 pl-4 italic">
                    “O que a dificuldade da minha história em passar neste teste revela sobre meus personagens e o universo que estou criando?”
                </blockquote>
                <p>Ao adotar essa perspectiva, os testes se transformam de meros medidores em aliados poderosos para a construção de roteiros mais autênticos, inclusivos e impactantes.</p>
            </AccordionContent>
        </AccordionItem>
      </Accordion>


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
                result={analysisResult.bechdelTest}
                description="Avalia a representatividade feminina."
            />
            <TestResultCard
                result={analysisResult.vitoRussoTest}
                description="Avalia a representatividade LGBTQIA+."
            />
            <TestResultCard
                result={analysisResult.duVernayTest}
                description="Avalia a representatividade racial e subversão de estereótipos."
            />
        </div>
      )}
    </div>
  );
}
