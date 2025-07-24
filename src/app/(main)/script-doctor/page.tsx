
"use client";

import { useEffect, useState, useRef } from "react";
import { useScript } from "@/context/script-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { scriptDoctorConsultant } from "@/ai/flows/script-doctor-consultant";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Stethoscope, Send, User, Bot, Sparkles, AlertTriangle, Brain, MessageSquare } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ConsultationMode = "roteiro" | "brainstorm";

export default function ScriptDoctorPage() {
  const { activeScript, updateScript } = useScript();
  const { userProfile } = useAuth();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ConsultationMode>("roteiro");

  // Históricos separados
  const [roteiroChatHistory, setRoteiroChatHistory] = useState<ChatMessage[]>([]);
  const [brainstormChatHistory, setBrainstormChatHistory] = useState<ChatMessage[]>([]);

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (activeScript) {
        setRoteiroChatHistory(activeScript.analysis.scriptDoctor || []);
    } else {
        setRoteiroChatHistory([]);
        setMode("brainstorm"); // Muda para brainstorm se não tiver roteiro ativo
    }
  }, [activeScript]);

  const currentChatHistory = mode === 'roteiro' ? roteiroChatHistory : brainstormChatHistory;
  const setCurrentChatHistory = mode === 'roteiro' ? setRoteiroChatHistory : setBrainstormChatHistory;

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [currentChatHistory, loading]);

  const handleQuery = async () => {
    if (mode === 'roteiro' && !activeScript) {
      toast({ title: "Erro", description: "Selecione um roteiro para consultar no modo de consultoria.", variant: "destructive" });
      return;
    }
    if (!query.trim()) {
      toast({ title: "Erro", description: "Sua pergunta não pode estar vazia.", variant: "destructive" });
      return;
    }
    if (!userProfile) return;

    const userMessage: ChatMessage = { role: 'user', content: query };
    const newHistory = [...currentChatHistory, userMessage];
    setCurrentChatHistory(newHistory);
    setQuery("");
    setLoading(true);

    try {
      const scriptContent = (mode === 'roteiro' && activeScript) ? activeScript.content : "MODO BRAINSTORM: O usuário não forneceu um roteiro. Aja como um consultor de roteiro geral e parceiro criativo para discutir ideias, personagens, temas, etc.";
      const result = await scriptDoctorConsultant({ scriptContent, query });
      
      const aiMessage: ChatMessage = { role: 'assistant', content: result.feedback };
      const finalHistory = [...newHistory, aiMessage];
      setCurrentChatHistory(finalHistory);
      
      if (mode === 'roteiro' && activeScript) {
          updateScript({ 
              ...activeScript, 
              analysis: { 
                  ...activeScript.analysis, 
                  scriptDoctor: finalHistory 
              } 
          });
      }

    } catch (error) {
      console.error(error);
      const errorMessage = "Desculpe, não consegui processar sua pergunta. Tente novamente.";
      const finalHistory = [...newHistory, { role: 'assistant', content: errorMessage }]
      setCurrentChatHistory(finalHistory);
      
       if (mode === 'roteiro' && activeScript) {
          updateScript({ 
              ...activeScript, 
              analysis: { 
                  ...activeScript.analysis, 
                  scriptDoctor: finalHistory
              } 
          });
      }
      toast({ title: "Erro na Consulta", description: "Houve um problema com o Script Doctor.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderChatContent = () => (
    <>
      <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {currentChatHistory.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-10">
              <p>Faça sua primeira pergunta.</p>
              <p className="text-sm">
                {mode === 'roteiro' 
                    ? 'Ex: "Como posso melhorar o diálogo da cena 5?"'
                    : 'Ex: "Me ajude a criar um perfil psicológico para um detetive cínico."'
                }
              </p>
            </div>
          )}
          {currentChatHistory.map((message, index) => (
            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && <div className="p-2 rounded-full bg-primary"><Bot className="w-5 h-5 text-primary-foreground" /></div>}
              <div className={`rounded-lg p-3 max-w-xl ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && <div className="p-2 rounded-full bg-muted"><User className="w-5 h-5 text-muted-foreground" /></div>}
            </div>
          ))}
          {loading && (
             <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary"><Bot className="w-5 h-5 text-primary-foreground" /></div>
                <div className="rounded-lg p-3 max-w-xl bg-muted flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin"/>
                    <p className="text-sm">Analisando...</p>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
  
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Script Doctor</h1>
        <p className="text-muted-foreground">Converse com um consultor de IA para obter feedback em tempo real sobre seu roteiro ou para brainstorm de novas ideias.</p>
      </header>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Aviso de IA</AlertTitle>
        <AlertDescription>
            As respostas e interações desta página são geradas por Inteligência Artificial. Esta tecnologia pode cometer erros e produzir informações inconsistentes. Recomendamos a revisão humana de todo o conteúdo.
        </AlertDescription>
      </Alert>

      <Tabs value={mode} onValueChange={(value) => setMode(value as ConsultationMode)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="roteiro" disabled={!activeScript}><Stethoscope className="mr-2"/> Consultoria de Roteiro</TabsTrigger>
            <TabsTrigger value="brainstorm"><Brain className="mr-2"/> Brainstorming Criativo</TabsTrigger>
        </TabsList>
        <TabsContent value="roteiro" className="mt-4">
            {!activeScript ? (
                 <PagePlaceholder title="Modo de Consultoria" description="Para conversar sobre um roteiro específico, primeiro selecione um roteiro ativo." />
            ) : (
                <Card className="h-[600px] flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Sessão para: <span className="text-primary">{activeScript.name}</span></CardTitle>
                        <CardDescription>Converse com a IA para aprimorar o roteiro selecionado.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">{renderChatContent()}</CardContent>
                    <CardFooter>
                        <div className="flex w-full items-center space-x-2">
                            <Textarea placeholder="Digite sua pergunta sobre o roteiro..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleQuery(); } }} rows={1} className="min-h-0" disabled={loading} />
                            <Button onClick={handleQuery} disabled={loading}><Send className="h-4 w-4" /></Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </TabsContent>
        <TabsContent value="brainstorm" className="mt-4">
             <Card className="h-[600px] flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">Sessão de Brainstorming</CardTitle>
                    <CardDescription>Use este espaço para conversar sobre qualquer ideia de roteiro, personagens, temas ou o que mais precisar.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">{renderChatContent()}</CardContent>
                <CardFooter>
                    <div className="flex w-full items-center space-x-2">
                        <Textarea placeholder="Digite sua pergunta ou ideia aqui..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleQuery(); } }} rows={1} className="min-h-0" disabled={loading} />
                        <Button onClick={handleQuery} disabled={loading}><Send className="h-4 w-4" /></Button>
                    </div>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
