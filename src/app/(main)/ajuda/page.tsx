import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, Mail } from "lucide-react";

const faqItems = [
    {
        question: "Como funciona o Painel de Roteiros?",
        answer: "No Painel de Roteiros, você pode adicionar novos roteiros fazendo o upload de arquivos de texto (.txt). A lista de roteiros permite que você selecione um como 'ativo' (clicando sobre ele) para ser usado em todas as ferramentas de análise, além de excluí-los."
    },
    {
        question: "Para que serve a Análise de Estrutura de Roteiro?",
        answer: "Esta ferramenta realiza um diagnóstico completo do roteiro ativo. Ela fornece um resumo da trama, avalia métricas-chave como estrutura, personagens e originalidade, e identifica os elementos dramáticos centrais da sua história, oferecendo sugestões para aprimorá-los."
    },
    {
        question: "O que a Análise da Jornada do Herói faz?",
        answer: "Este módulo identifica os 12 passos da Jornada do Herói em seu roteiro ativo. Ele mostra quais passos foram encontrados, avalia sua eficácia e exibe um gráfico de intensidade dramática para visualizar os picos de tensão da sua narrativa."
    },
    {
        question: "O que é a Análise de Personagens?",
        answer: "Aqui, a IA mergulha no perfil psicológico do seu protagonista e antagonista. Ela analisa suas motivações, forças, fraquezas e, mais importante, descreve o arco de transformação de cada um ao longo da história, fornecendo sugestões para torná-los mais complexos."
    },
     {
        question: "Como funciona o Teste de Representatividade?",
        answer: "Esta ferramenta avalia a diversidade e inclusão do seu roteiro usando três testes conhecidos: o Teste de Bechdel (representatividade feminina), o Teste de Vito Russo (LGBTQIA+) e o Teste de DuVernay (racial). Ele fornece um diagnóstico e a justificativa para cada critério."
    },
    {
        question: "O que eu encontro na Análise de Mercado?",
        answer: "Este dashboard oferece uma visão comercial do seu projeto. Ele analisa o público-alvo, o alinhamento com tendências de mercado, o potencial de marketing, obras de referência e os canais de distribuição mais adequados para o seu roteiro."
    },
    {
        question: "Como usar o Script Doctor?",
        answer: "O Script Doctor é um chat com uma IA consultora de roteiros. Com um roteiro ativo selecionado, você pode fazer perguntas específicas sobre sua história (diálogos, cenas, estrutura) e receber feedback analítico e sugestões em tempo real."
    },
    {
        question: "Para que serve o Gerador de Pitching?",
        answer: "Esta ferramenta compila as informações do seu roteiro ativo em um 'Film Design Document' profissional. Ele gera seções como logline, sinopse e justificativa, criando um documento pronto para ser apresentado a produtores e investidores."
    },
    {
        question: "Como o Gerador de Argumento funciona?",
        answer: "Diferente das outras ferramentas, o Gerador de Argumento não precisa de um roteiro pronto. Ele é uma ferramenta de criação que guia você passo a passo (definindo tom, gênero, tema, personagens e narrativa) para construir a base de uma nova história do zero, compilando tudo em um argumento final."
    },
    {
        question: "O que é a Masterclass?",
        answer: "A Masterclass é uma área de aprendizado contínuo. Ela exibe uma playlist de vídeos selecionados do YouTube sobre roteiro e produção audiovisual. Você pode assistir aos vídeos e navegar pela playlist diretamente dentro do aplicativo."
    }
];

export default function AjudaPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Central de Ajuda</h1>
        <p className="text-muted-foreground">Encontre respostas para suas dúvidas e saiba como aproveitar ao máximo o Roteirista Pro.</p>
      </header>

      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><HelpCircle/> Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
              <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                  ))}
              </Accordion>
          </CardContent>
      </Card>
        
      <Card className="mt-12">
          <CardHeader>
              <CardTitle>Precisa de mais ajuda?</CardTitle>
              <CardDescription>Se não encontrou o que procurava, entre em contato com nossa equipe de suporte.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground"/>
                <a href="mailto:atendimento@cmkfilmes.com" className="text-primary hover:underline">
                  atendimento@cmkfilmes.com
                </a>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
