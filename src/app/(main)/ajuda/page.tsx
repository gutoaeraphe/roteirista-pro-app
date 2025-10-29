
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, Mail } from "lucide-react";

const faqItems = [
    {
        question: "Como funciona o Painel de Roteiros?",
        answer: "O Painel de Roteiros é sua central de controle. Aqui, você pode adicionar todos os seus projetos fazendo o upload de arquivos de texto (.txt). Cada roteiro que você adiciona fica listado, e você pode selecionar um para torná-lo 'ativo' com um simples clique. O roteiro ativo é aquele que será usado em todas as ferramentas de análise da plataforma. Você também pode excluir roteiros que não precisa mais. Se um roteiro for um 'Argumento' criado pelo gerador, clicar nele abrirá o editor para que você possa continuar aprimorando-o."
    },
    {
        question: "O que é a Análise de Proposta de Valor (High Concept)?",
        answer: "Esta é uma análise estratégica fundamental, ideal para o início do desenvolvimento. Ela avalia a força da sua ideia central sob a ótica do mercado, dividindo-a em três pilares: 'The Book' (a força e originalidade do enredo), 'The Hook' (o elemento que serve como 'gancho' para o marketing e atração de público) e 'The Look' (o potencial estético e visual da história). O resultado é uma pontuação clara e um diagnóstico que ajuda a entender o apelo comercial do seu projeto antes mesmo de escrever a primeira página."
    },
    {
        question: "Para que serve a Análise de Estrutura de Roteiro?",
        answer: "Esta ferramenta oferece um diagnóstico dramatúrgico completo do seu roteiro ativo. Ela vai além de um simples resumo, fornecendo métricas detalhadas (com pontuação e sugestões) sobre a qualidade da estrutura, o desenvolvimento dos personagens, o potencial comercial e a originalidade. Além disso, a IA identifica e analisa criticamente os elementos dramáticos fundamentais (como o evento desencadeador, o clímax e o tema), dando um feedback valioso sobre a eficácia de cada parte da sua narrativa."
    },
    {
        question: "O que é a Análise de Viabilidade (MCV)?",
        answer: "A análise de Mínimo Conteúdo Viável (MCV) funciona como um 'produtor virtual'. Ela avalia seu roteiro sob uma perspectiva de produção, identificando a complexidade e os custos potenciais. A ferramenta analisa 8 áreas críticas (logística, arte, elenco, etc.) e atribui uma pontuação de 0 a 10. Atenção: nesta análise, o objetivo é ter notas baixas, pois elas indicam menor custo e complexidade. O resultado é um guia realista para entender o quão viável é produzir sua história."
    },
    {
        question: "O que a Análise da Jornada do Herói faz?",
        answer: "Baseado na famosa estrutura de Joseph Campbell, este módulo disseca seu roteiro para encontrar os 12 passos da Jornada do Herói. Ele não apenas identifica os passos presentes, mas também avalia a eficácia de cada um com uma pontuação e fornece sugestões de melhoria. Ao final, a ferramenta também oferece uma análise concisa da estrutura de 3 atos do seu roteiro."
    },
     {
        question: "O que a Análise do Arco da Jornada faz?",
        answer: "Enquanto a Jornada do Herói foca em uma estrutura clássica de 12 passos, esta análise se concentra na transformação interna do protagonista através de 8 momentos-chave do arco dramático: Equilíbrio, Gatilho, Busca, Clímax, Escolha, Surpresa, Reviravolta e Desfecho. É uma ferramenta complementar excelente para garantir que a jornada emocional e psicológica do seu personagem seja coesa, impactante e bem resolvida."
    },
    {
        question: "O que é a Análise de Personagens?",
        answer: "Esta é uma das análises mais profundas. A IA não só traça perfis psicológicos detalhados para seu protagonista e antagonista (avaliando forças, fraquezas, motivações e arcos), como também constrói um 'Mapa de Relações'. Esse mapa visualiza a teia de interações entre todos os personagens importantes, identificando os tipos de relação (conflito, aliança, romance, etc.) e como elas impulsionam a trama, oferecendo um entendimento completo da dinâmica do seu elenco."
    },
    {
        question: "O que é a Análise de Beat Sheet?",
        answer: "Esta ferramenta mapeia a espinha dorsal da sua narrativa. A IA analisa seu roteiro ativo e identifica os 15 'beats' ou pontos de virada essenciais da estrutura de roteiro, como a Imagem de Abertura, o Catalisador, o Ponto Médio e o Final. Para cada 'beat', a análise indica a página onde ele ocorre e explica como aquele evento se manifesta na sua história. É ideal para verificar o ritmo, a coesão e garantir que todos os momentos cruciais da sua trama estão no lugar certo e funcionando como deveriam."
    },
    {
        question: "Como funciona a Análise SWOT?",
        answer: "Esta ferramenta aplica a clássica matriz de análise de negócios (SWOT) ao seu projeto, proporcionando uma visão 360º. A IA atua com uma dupla persona: um 'Mentor Criativo', que analisa os fatores internos (Forças e Fraquezas da sua história), e um 'Estrategista de Mercado', que avalia os fatores externos (Oportunidades e Ameaças do mercado). O resultado é um diagnóstico completo que une o potencial criativo e comercial do seu roteiro."
    },
    {
        question: "O que é o Mapeamento de Conflitos?",
        answer: "O conflito é o motor de toda boa história. Esta ferramenta identifica e categoriza todos os principais conflitos que seu protagonista enfrenta, sejam eles internos (dilemas morais, medos) ou externos (contra outros personagens, a sociedade ou a natureza). Ao final, ela fornece um resumo analítico sobre o equilíbrio e a progressão desses conflitos, ajudando você a garantir que seu personagem seja constantemente desafiado de maneira significativa."
    },
     {
        question: "O que é o Checklist de Tchekhov?",
        answer: "Inspirada no princípio da 'Arma de Tchekhov', esta análise avalia a economia e a eficiência da sua narrativa. Ela verifica 8 pontos cruciais para garantir que cada elemento do seu roteiro (cenas, personagens, diálogos, etc.) tenha um propósito dramático claro e funcional. É a ferramenta perfeita para 'aparar as arestas', eliminar o que é desnecessário e garantir que cada parte da sua história contribua para o todo, resultando em um roteiro mais coeso e impactante."
    },
    {
        question: "O que a Análise de Recepção e Engajamento avalia?",
        answer: "Esta é uma análise preditiva sofisticada. Em vez de avaliar a 'qualidade' do seu roteiro, ela diagnostica como diferentes públicos provavelmente irão interpretá-lo e se conectar emocionalmente com ele. A ferramenta avalia dois grandes eixos: a 'Recepção' (como a história será interpretada, seu potencial de debate e clareza temática) e a 'Espectatorialidade' (como a história será sentida, analisando a imersão, a tensão e a identificação com os personagens)."
    },
    {
        question: "Como funciona o Teste de Representatividade?",
        answer: "Esta ferramenta serve como um espelho para a diversidade e inclusão em seu roteiro. Ela aplica três dos mais conhecidos testes da indústria: o Teste de Bechdel (representatividade feminina), o Teste de Vito Russo (representatividade LGBTQIA+) e o Teste de DuVernay (representatividade racial). Para cada um, a IA fornece um diagnóstico claro, critério por critério, explicando se o roteiro foi aprovado ou não e por quê. É uma ferramenta de autoavaliação para identificar oportunidades de enriquecer suas narrativas."
    },
    {
        question: "O que eu encontro na Análise de Mercado?",
        answer: "Este é o seu dashboard de negócios. A IA analisa o resumo e o gênero do seu roteiro para gerar um relatório comercial completo. Ele define o público-alvo, compara seu projeto com as tendências atuais, sugere obras de referência para posicionamento, aponta os melhores canais de distribuição e até mesmo brainstorms de produtos derivados e estratégias de marketing. É a ferramenta ideal para preparar seu projeto para o mercado."
    },
    {
        question: "Como usar o Script Doctor?",
        answer: "O Script Doctor é o seu consultor de IA pessoal. Ele funciona em dois modos: 'Consultoria de Roteiro', onde você pode fazer perguntas específicas sobre o seu roteiro ativo (ex: 'Como posso melhorar esta cena?' ou 'Este diálogo soa natural?'); e 'Brainstorming Criativo', um chat livre para você desenvolver novas ideias do zero, criar perfis de personagens, explorar temas ou qualquer outra necessidade criativa, sem a necessidade de um roteiro."
    },
    {
        question: "Para que serve o Gerador de Pitching?",
        answer: "Transforme seu roteiro em um documento de vendas profissional com um clique. Esta ferramenta analisa seu roteiro ativo e gera automaticamente um 'Film Design Document' completo, com tom analítico e vendedor. Ele cria seções essenciais como logline, sinopse, justificativa de mercado, análise de personagens, apelo emocional e artístico, e muito mais, deixando você com um material pronto para ser apresentado a produtores e investidores."
    },
    {
        question: "Como o Gerador de Argumento funciona?",
        answer: "Esta é a única ferramenta que não precisa de um roteiro pronto. Pelo contrário, ela ajuda você a criar um do zero. Através de um processo guiado passo a passo, você seleciona os pilares da sua história (tom, gênero, conflito, etc.) e a IA vai ajudando a refinar cada etapa. Ao final, ela compila todas as suas ideias em um argumento narrativo coeso e estruturado, que pode ser salvo no seu painel e editado posteriormente."
    },
    {
        question: "Como funciona o Teste de Público?",
        answer: "Esta ferramenta inovadora permite que você simule a reação de um espectador específico ao seu roteiro. O processo tem duas etapas: primeiro, você descreve em detalhes o seu público-alvo ideal; com base nisso, a IA cria uma 'persona' fictícia, com nome, perfil e comportamento. Em seguida, essa persona 'lê' seu roteiro ativo e fornece uma análise crítica completa do ponto de vista dela, avaliando a trama, os personagens, os diálogos e o impacto geral da história."
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
