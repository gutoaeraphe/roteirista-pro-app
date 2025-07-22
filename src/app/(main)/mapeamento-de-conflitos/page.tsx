
"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Sparkles, AlertTriangle, Download, Award, Crosshair, HelpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { analyzeScriptConflicts } from "@/ai/flows/analyze-script-conflicts";
import type { AnalyzeScriptConflictsOutput } from "@/ai/flows/analyze-script-conflicts";


const AnalysisSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full mt-2" />
                <Skeleton className="h-12 w-full mt-2" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent><Skeleton className="h-16 w-full" /></CardContent>
        </Card>
    </div>
);


export default function MapeamentoDeConflitosPage() {
  const { activeScript, updateScript } = useScript();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptConflictsOutput | undefined>(
    activeScript?.analysis.conflicts
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
      const result = await analyzeScriptConflicts({ scriptContent: activeScript.content });
      setAnalysisResult(result);
      updateScript({ ...activeScript, analysis: { ...activeScript.analysis, conflicts: result } });
      
      toast({ title: "Análise Concluída", description: "O mapeamento de conflitos foi gerado." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Análise", description: "Não foi possível gerar o mapeamento.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createPlainTextDocument = () => {
    if (!analysisResult || !activeScript) return "";

    let content = `Mapeamento de Conflitos para: ${activeScript.name}\n`;
    content += "==================================================\n\n";

    content += "Lista de Conflitos Mapeados\n";
    content += "--------------------------------------------------\n";
    analysisResult.mappedConflicts.forEach(item => {
        content += `Cena/Evento: ${item.sceneOrEvent}\n`;
        content += `Tipo: ${item.conflictType} (${item.subCategory})\n`;
        content += `Descrição e Função: ${item.descriptionAndFunction}\n\n`;
    });

    content += "Resumo Analítico\n";
    content += "--------------------------------------------------\n";
    content += analysisResult.analyticalSummary;
    
    return content.trim();
  };

  const handleDownload = () => {
    const content = createPlainTextDocument();
    if (!content || !activeScript) return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mapeamento_conflitos_${activeScript.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const hasBeenAnalyzed = !!analysisResult;

  if (!activeScript) {
    return <PagePlaceholder title="Mapeamento de Conflitos" description="Para mapear os conflitos do seu roteiro, primeiro selecione um roteiro ativo." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Mapeamento de Conflitos</h1>
          <p className="text-muted-foreground">Visualize o motor da dramaturgia e o arco de transformação do protagonista.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" disabled={!hasBeenAnalyzed || loading}>
                <Download className="mr-2 h-4 w-4" /> Baixar TXT
            </Button>
            <Button onClick={handleAnalysis} disabled={loading}>
            {loading ? "Mapeando..." : hasBeenAnalyzed ? "Mapear Novamente" : "Mapear Conflitos"}
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Crosshair /> Lista de Conflitos Mapeados</CardTitle>
                    <CardDescription>Principais desafios e obstáculos enfrentados pelo protagonista.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[30%]">Cena/Evento</TableHead>
                                    <TableHead className="w-[25%]">Tipo de Conflito</TableHead>
                                    <TableHead>Descrição e Função</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analysisResult.mappedConflicts.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.sceneOrEvent}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                               <Badge variant={item.conflictType === 'Interno' ? 'secondary' : 'outline'}>{item.conflictType}</Badge>
                                               <span className="text-xs text-muted-foreground">{item.subCategory}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{item.descriptionAndFunction}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

             <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Award /> Resumo Analítico</CardTitle>
                    <CardDescription>Uma análise sobre o equilíbrio e a progressão dos conflitos na história.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.analyticalSummary}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
