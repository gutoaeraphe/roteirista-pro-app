
'use server';

/**
 * @fileOverview Um fluxo que cria um documento de vendas profissional para um projeto de filme,
 * agindo como um produtor executivo.
 *
 * - generatePitchingDocument - Uma função que lida com a geração do documento de vendas.
 * - GeneratePitchingDocumentInput - O tipo de entrada para a função generatePitchingDocument.
 * - GeneratePitchingDocumentOutput - O tipo de retorno para a função generatePitchingDocument.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePitchingDocumentInputSchema = z.object({
  scriptContent: z.string().describe('O conteúdo do roteiro do filme.'),
  genre: z.string().describe('O gênero do filme.'),
});

export type GeneratePitchingDocumentInput = z.infer<typeof GeneratePitchingDocumentInputSchema>;

const PitchingDocumentSchema = z.object({
    elevatorPitch: z.string().describe('Um pitch rápido e impactante, de 2 a 3 frases, que resume a essência do projeto para gerar interesse imediato.'),
    logline: z.string().describe('Uma frase concisa e impactante que resume a essência da história.'),
    synopsis: z.string().describe('Um resumo da trama principal, apresentando o protagonista, seu objetivo, o conflito e o que está em jogo.'),
    theme: z.string().describe('A mensagem central e as questões universais que a obra explora.'),
    targetAudience: z.string().describe('Uma descrição do principal grupo de audiência para este filme.'),
    justification: z.string().describe('Uma explicação convincente de por que esta história é relevante e precisa ser contada agora.'),
    contextualizacaoERelevancia: z.string().describe('Demonstra a relevância cultural e social, evidenciando como o projeto se conecta aos temas contemporâneos e às demandas do público.'),
    contribuicoesCulturaisEArtisticas: z.string().describe('Como o projeto dialoga com o público, retrata realidades, explora temas e expande os limites das narrativas.'),
    apeloEmocionalEVisionario: z.string().describe('A capacidade da narrativa de engajar, emocionando e conectando-se com valores humanos universais.'),
    mainCharacters: z.string().describe('Breves descrições do protagonista e do antagonista, focando em seus arcos e conflitos.'),
    toneAndStyle: z.string().describe('A atmosfera, o estilo visual e a abordagem narrativa do filme.'),
    storyArc: z.string().describe('Um resumo do desenvolvimento da trama através de seus atos principais.'),
    detailedArgument: z.string().describe('Um tratamento mais expandido da história, cobrindo os principais pontos da trama do início ao fim.'),
    marketingPotential: z.string().describe('Uma análise das oportunidades de marketing e do apelo comercial do projeto.'),
});


const GeneratePitchingDocumentOutputSchema = z.object({
  pitchingDocument: PitchingDocumentSchema.describe(
      'O documento de pitching completo, com cada seção preenchida.'
    ),
});

export type GeneratePitchingDocumentOutput = z.infer<typeof GeneratePitchingDocumentOutputSchema>;

export async function generatePitchingDocument(
  input: GeneratePitchingDocumentInput
): Promise<GeneratePitchingDocumentOutput> {
  return generatePitchingDocumentFlow(input);
}

const generatePitchingDocumentPrompt = ai.definePrompt({
  name: 'generatePitchingDocumentPrompt',
  input: {schema: GeneratePitchingDocumentInputSchema},
  output: {schema: GeneratePitchingDocumentOutputSchema},
  prompt: `Você é um produtor executivo de cinema sênior e estrategista de conteúdo. Sua tarefa é analisar o roteiro fornecido e criar um documento de vendas (pitching document) altamente profissional, analítico e persuasivo. Seu tom deve ser vendedor, destacando o potencial comercial e artístico do projeto. Responda em português.

**Instruções Gerais:**
Para cada seção, não apenas descreva, mas **analise e venda a ideia**. Explique *por que* cada elemento é forte e como ele contribui para o sucesso do projeto. Seja elaborado e use uma linguagem que inspire confiança em investidores e distribuidores.

1.  **elevatorPitch**: Crie um pitch de elevador magnético (2-3 frases). Ele deve ser claro, conciso e despertar curiosidade imediata.
2.  **logline**: Desenvolva uma logline poderosa e memorável que encapsule o conflito central e os riscos da história.
3.  **synopsis**: Elabore uma sinopse envolvente. Apresente o protagonista, seu mundo, o incidente incitante, o objetivo, o conflito principal e o que está em jogo de forma cativante.
4.  **theme**: Analise o tema. Vá além da superfície. Discuta a profundidade temática e as questões universais que a obra explora, explicando por que elas ressoarão com o público.
5.  **targetAudience**: Defina o público-alvo com precisão (primário e secundário). Justifique por que este grupo será atraído pela história, personagens e tema.
6.  **justification**: Construa uma justificativa de mercado sólida. Por que esta história é relevante e comercialmente viável *agora*? Use argumentos fortes.
7.  **contextualizacaoERelevancia**: Demonstre a relevância cultural e social. Conecte o projeto a conversas e temas contemporâneos, provando que ele está alinhado com o zeitgeist.
8.  **contribuicoesCulturaisEArtisticas**: Destaque o valor artístico do projeto. Como ele inova, explora novas linguagens, retrata realidades de forma única ou expande os limites narrativos do gênero?
9.  **apeloEmocionalEVisionario**: Descreva o coração do projeto. Qual é a jornada emocional do espectador? Como a história se conecta com valores humanos universais para criar uma experiência visionária e memorável?
10. **mainCharacters**: Apresente os personagens principais (protagonista e antagonista) de forma analítica. Descreva seus perfis psicológicos, arcos de transformação e a dinâmica complexa entre eles.
11. **toneAndStyle**: Defina o tom e o estilo visual de forma vívida. Use referências cinematográficas para pintar um quadro claro da atmosfera e da abordagem narrativa.
12. **storyArc**: Resuma o arco da história em seus atos principais, mas foque na escalada da tensão e nos pontos de virada, mostrando um domínio da estrutura dramática.
13. **detailedArgument**: Elabore um argumento detalhado e completo. Esta é a sua chance de contar a história de forma mais aprofundada, mostrando o fluxo narrativo, o desenvolvimento dos personagens e a resolução de forma coesa e impactante.
14. **marketingPotential**: Forneça uma análise estratégica do potencial de marketing. Identifique ganchos de marketing, públicos de nicho, oportunidades de branding e o apelo comercial geral.

---
Gênero do Filme: {{{genre}}}
---
Conteúdo do Roteiro:
{{{scriptContent}}}
---

Gere o documento de pitching completo, preenchendo o objeto 'pitchingDocument'.`,
});

const generatePitchingDocumentFlow = ai.defineFlow(
  {
    name: 'generatePitchingDocumentFlow',
    inputSchema: GeneratePitchingDocumentInputSchema,
    outputSchema: GeneratePitchingDocumentOutputSchema,
  },
  async input => {
    const {output} = await generatePitchingDocumentPrompt(input);
    return output!;
  }
);
