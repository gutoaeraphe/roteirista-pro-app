import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, Mail } from "lucide-react";

const faqItems = [
    {
        question: "Como funciona o Painel de Roteiros?",
        answer: "No Painel de Roteiros, você pode adicionar novos roteiros fazendo o upload de arquivos de texto (.txt) e preenchendo os metadados. A lista de roteiros permite que você selecione um como 'ativo' para ser usado em todas as ferramentas de análise."
    },
    {
        question: "O que são as Análises?",
        answer: "As ferramentas de análise usam IA para fornecer insights profundos sobre o roteiro ativo. Cada módulo foca em um aspecto: estrutura narrativa, jornada do herói, perfis de personagens, representatividade e potencial de mercado."
    },
    {
        question: "Como usar o Script Doctor?",
        answer: "Com um roteiro ativo selecionado, vá para a página do Script Doctor e digite sua pergunta sobre o roteiro na caixa de texto. A IA atuará como um consultor, fornecendo feedback e sugestões com base no conteúdo do seu roteiro e na sua dúvida."
    },
    {
        question: "Para que serve o Gerador de Pitching?",
        answer: "Esta ferramenta compila todas as análises realizadas para o roteiro ativo em um único 'Film Design Document'. É um documento profissional pronto para ser apresentado a produtores e estúdios. Certifique-se de que todas as análises foram concluídas para obter o melhor resultado."
    },
    {
        question: "O que é o Gerador de Argumento?",
        answer: "Diferente das outras ferramentas, o Gerador de Argumento não precisa de um roteiro. Ele ajuda a criar uma nova história do zero. Você fornece um título, gênero e número de atos, e a IA gera um argumento completo, incluindo tema, personagens e estrutura."
    },
    {
        question: "Meus roteiros estão seguros?",
        answer: "Sim. Seus roteiros são armazenados de forma segura no Firebase Cloud Firestore, associados à sua conta pessoal. Eles só são acessados para o processamento de IA no momento da análise."
    }
];

export default function AjudaPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Central de Ajuda</h1>
        <p className="text-muted-foreground">Encontre respostas para suas dúvidas e saiba como aproveitar ao máximo o Roteiro Pro.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><HelpCircle/> Perguntas Frequentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{item.question}</AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
        
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Precisa de mais ajuda?</CardTitle>
                    <CardDescription>Se não encontrou o que procurava, entre em contato com nossa equipe de suporte.</CardDescription>
                </CardHeader>
                <CardContent>
                    <a href="mailto:atendimento@cmkfilmes.com">
                        <Button className="w-full">
                            <Mail className="mr-2 h-4 w-4"/> Enviar E-mail para Suporte
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
