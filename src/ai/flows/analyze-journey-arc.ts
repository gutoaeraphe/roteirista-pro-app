
'use server';

/**
 * @fileOverview Analisa o arco da jornada do personagem em 8 passos.
 *
 * - analyzeJourneyArc - Inicia a análise.
 * - AnalyzeJourneyArcInput - O tipo de entrada para a função.
 * - AnalyzeJourneyArcOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJourneyArcInputSchema = z.object({
  scriptContent: z.string().describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeJourneyArcInput = z.infer<typeof AnalyzeJourneyArcInputSchema>;

const JourneyArcStepSchema = z.object({
  step: z.string().describe('O nome do passo no arco da jornada.'),
  analysis: z.string().describe('A análise de como este passo se manifesta no roteiro.'),
});

const AnalyzeJourneyArcOutputSchema = z.object({
  steps: z.array(JourneyArcStepSchema).length(8).describe('Uma lista com a análise dos 8 passos do arco da jornada.'),
  summary: z.string().describe('Um resumo geral sobre a coesão e eficácia do arco do personagem.'),
});
export type AnalyzeJourneyArcOutput = z.infer<typeof AnalyzeJourneyArcOutputSchema>;


export async function analyzeJourneyArc(
  input: AnalyzeJourneyArcInput
): Promise<AnalyzeJourneyArcOutput> {
  return analyzeJourneyArcFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJourneyArcPrompt',
  input: {schema: AnalyzeJourneyArcInputSchema},
  output: {schema: AnalyzeJourneyArcOutputSchema},
  config: { temperature: 0.3 },
  prompt: `Você é um dramaturgo especialista em arcos de personagem. Analise o roteiro fornecido com base nos 8 passos do "Arco da Jornada" descritos abaixo. Para cada passo, forneça uma análise concisa sobre como ele se manifesta na história. Ao final, escreva um resumo sobre a coesão geral do arco. Responda inteiramente em português.

**Os 8 Passos do Arco da Jornada:**

1.  **Equilíbrio:** Quem é a personagem e onde ela vive? (Descreva o mundo comum e o estado inicial da protagonista).
2.  **Gatilho:** O que está errado e qual a necessidade? (Identifique o evento que desestabiliza a vida da personagem e cria uma necessidade de mudança).
3.  **Busca:** Qual o motivo da partida e como ele vai partir? (Descreva a decisão da personagem de agir e o início de sua jornada).
4.  **Clímax:** Pegue o que precisa, mas pague o preço. (Analise o ponto de confronto principal, onde a personagem obtém algo importante, mas sofre uma perda significativa).
5.  **Escolha:** Supere o seu maior medo. (Identifique o momento em que a personagem deve confrontar sua maior fraqueza ou medo para poder continuar).
6.  **Surpresa:** Como será a busca? (Descreva os desafios, obstáculos e aliados encontrados no meio da jornada que testam a personagem).
7.  **Reviravolta:** Uma grande virada na trama. (Identifique um plot twist ou uma revelação que muda drasticamente a perspectiva da personagem e o rumo da história).
8.  **Desfecho:** O que a personagem aprendeu? (Analise a resolução da história e a transformação final da personagem, mostrando o que ela ganhou ou perdeu em sua jornada).

---

**Roteiro para Análise:**
{{{scriptContent}}}
`,
});

const analyzeJourneyArcFlow = ai.defineFlow(
  {
    name: 'analyzeJourneyArcFlow',
    inputSchema: AnalyzeJourneyArcInputSchema,
    outputSchema: AnalyzeJourneyArcOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
