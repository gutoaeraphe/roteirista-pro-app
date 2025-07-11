
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
import { Stethoscope, Send, User, Bot, Sparkles, CreditCard, AlertCircle } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { NoCreditsPlaceholder } from "@/components/layout/no-credits-placeholder";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ScriptDoctorPage() {
  const { activeScript, updateScript } = useScript();
  const { userProfile, updateUserProfile } = useAuth();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(activeScript?.analysis.scriptDoctor || []);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (activeScript) {
        setChatHistory(activeScript.analysis.scriptDoctor || []);
    }
  }, [activeScript]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, loading]);

  const hasMessages = userProfile?.isAdmin || (userProfile?.scriptDoctorMessagesRemaining ?? 0) > 0;
  const hasCredits = userProfile?.isAdmin || (userProfile?.credits ?? 0) > 0;

  const handleActivateSession = async () => {
    if (!userProfile) return;

    if (!hasCredits) {
      toast({
        title: "Créditos Insuficientes",
        description: "Você não tem créditos para iniciar uma nova sessão.",
        variant: "destructive"
      });
      return;
    }
    
    await updateUserProfile({
      credits: (userProfile.credits ?? 0) - 1,
      scriptDoctorMessagesRemaining: (userProfile.scriptDoctorMessagesRemaining ?? 0) + 10
    });
    
    toast({
      title: "Sessão Ativada!",
      description: "Você tem 10 novas mensagens para usar com o Script Doctor. 1 crédito foi consumido."
    });
    
    setShowCreditDialog(false);
  };

  const handleQuery = async () => {
    if (!activeScript) {
      toast({ title: "Erro", description: "Selecione um roteiro para consultar o Script Doctor.", variant: "destructive" });
      return;
    }
    if (!query.trim()) {
      toast({ title: "Erro", description: "Sua pergunta não pode estar vazia.", variant: "destructive" });
      return;
    }
    if (!userProfile) return;
    if (!hasMessages) {
        setShowCreditDialog(true);
        return;
    }

    const userMessage: ChatMessage = { role: 'user', content: query };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setQuery("");
    setLoading(true);

    try {
      await updateUserProfile({ scriptDoctorMessagesRemaining: userProfile.scriptDoctorMessagesRemaining - 1 });

      const result = await scriptDoctorConsultant({ scriptContent: activeScript.content, query });
      const aiMessage: ChatMessage = { role: 'assistant', content: result.feedback };
      const finalHistory = [...newHistory, aiMessage];
      setChatHistory(finalHistory);
      updateScript({ 
          ...activeScript, 
          analysis: { 
              ...activeScript.analysis, 
              scriptDoctor: finalHistory 
          } 
      });

    } catch (error) {
      console.error(error);
      const errorMessage = "Desculpe, não consegui processar sua pergunta. Tente novamente.";
      setChatHistory([...newHistory, { role: 'assistant', content: errorMessage }]);
      toast({ title: "Erro na Consulta", description: "Houve um problema com o Script Doctor.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!activeScript) {
    return <PagePlaceholder title="Script Doctor" description="Para conversar com o consultor de IA, primeiro selecione um roteiro ativo." />;
  }
  
  if (!userProfile?.isAdmin && !hasCredits && !hasMessages) {
    return <NoCreditsPlaceholder title="Script Doctor" />;
  }

  return (
    <>
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Script Doctor</h1>
        <p className="text-muted-foreground">Converse com um consultor de IA para obter feedback em tempo real sobre seu roteiro.</p>
      </header>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope />
                Sessão para: <span className="text-primary">{activeScript.name}</span>
              </CardTitle>
              <CardDescription>
                {userProfile?.isAdmin ? "Acesso ilimitado como Admin." : `Você tem ${userProfile?.scriptDoctorMessagesRemaining || 0} mensagens restantes.`}
              </CardDescription>
            </div>
            {!hasMessages && hasCredits && (
              <Button onClick={() => setShowCreditDialog(true)}>Ativar Sessão (-1 crédito)</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {chatHistory.length === 0 && !loading && (
                <div className="text-center text-muted-foreground py-10">
                  <p>Faça sua primeira pergunta sobre o roteiro.</p>
                  <p className="text-sm">Ex: "Como posso melhorar o diálogo da cena 5?"</p>
                </div>
              )}
              {chatHistory.map((message, index) => (
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
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder={hasMessages ? "Digite sua pergunta aqui..." : "Ative uma sessão para enviar mensagens."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleQuery();
                }
              }}
              rows={1}
              className="min-h-0"
              disabled={loading || !hasMessages}
            />
            <Button onClick={handleQuery} disabled={loading || !hasMessages}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
    
     <AlertDialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="text-amber-500"/>
              Ativar Sessão do Script Doctor?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você não tem mais mensagens para usar no chat. Deseja usar 1 crédito para obter mais 10 mensagens?
            Seu saldo atual é de {userProfile?.credits || 0} créditos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleActivateSession} disabled={!hasCredits}>
             Sim, usar 1 crédito
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
