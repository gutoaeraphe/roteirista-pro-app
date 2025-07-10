"use client";

import { useState } from "react";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { scriptDoctorConsultant } from "@/ai/flows/script-doctor-consultant";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { Stethoscope, Send, User, Bot, Sparkles } from "lucide-react";
import { ChatMessage } from "@/lib/types";

export default function ScriptDoctorPage() {
  const { activeScript } = useScript();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { toast } = useToast();

  const handleQuery = async () => {
    if (!activeScript) {
      toast({ title: "Erro", description: "Selecione um roteiro para consultar o Script Doctor.", variant: "destructive" });
      return;
    }
    if (!query.trim()) {
      toast({ title: "Erro", description: "Sua pergunta não pode estar vazia.", variant: "destructive" });
      return;
    }

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: query }];
    setChatHistory(newHistory);
    setQuery("");
    setLoading(true);

    try {
      const result = await scriptDoctorConsultant({ scriptContent: activeScript.content, query });
      setChatHistory([...newHistory, { role: 'assistant', content: result.feedback }]);
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

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Script Doctor</h1>
        <p className="text-muted-foreground">Converse com um consultor de IA para obter feedback em tempo real sobre seu roteiro.</p>
      </header>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope />
            Sessão com o Script Doctor para: <span className="text-primary">{activeScript.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {chatHistory.length === 0 && (
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
              placeholder="Digite sua pergunta aqui..."
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
            />
            <Button onClick={handleQuery} disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
