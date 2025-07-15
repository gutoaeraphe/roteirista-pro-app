
'use server';
/**
 * @fileOverview Analisa um roteiro para identificar os passos da Jornada do Herói, a estrutura de 3 atos e visualizar a intensidade dramática.
 *
 * - analyzeScriptHeroJourney - Uma função que lida com o processo de análise de roteiro.
 * - AnalyzeScriptHeroJourneyInput - O tipo de entrada para a função analyzeScriptHeroJourney.
 * - AnalyzeScriptHeroJourneyOutput - O tipo de retorno para a função analyzeScriptHeroJourney.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptHeroJourneyInputSchema = z.object({
  script: z.string().describe('O roteiro do filme a ser analisado.'),
});
export type AnalyzeScriptHeroJourneyInput = z.infer<
  typeof AnalyzeScriptHeroJourneyInputSchema
>;

const HeroJourneyStepSchema = z.object({
  stepName: z.string().describe('O nome do passo da jornada do herói.'),
  analysis: z.string().describe('A análise de como este passo se manifesta no roteiro ou uma explicação sobre sua ausência e o impacto disso.'),
  score: z.number().min(0).max(10).describe('Uma pontuação de 0 a 10 para a presença e eficácia deste passo (0 se ausente).'),
  suggestions: z.string().optional().describe('Sugestões de melhoria se a pontuação for 7 ou menos.'),
  intensity: z.number().min(0).max(100).describe('A intensidade dramática neste ponto da história (0-100).'),
});
export type HeroJourneyStep = z.infer<typeof HeroJourneyStepSchema>;

const ThreeActStructureSchema = z.object({
    actOne: z.string().describe('Análise do Primeiro Ato (Apresentação).'),
    actTwo: z.string().describe('Análise do Segundo Ato (Confronto).'),
    actThree: z.string().describe('Análise do Terceiro Ato (Resolução).'),
});

const AnalyzeScriptHeroJourneyOutputSchema = z.object({
  overallAnalysis: z.object({
    summary: z.string().describe('Um resumo geral da análise dramatúrgica da jornada do herói no roteiro.'),
    score: z.number().min(1).max(10).describe('Uma nota geral de 1 a 10 para a aplicação da jornada do herói.'),
    suggestions: z.string().optional().describe('Sugestões de melhoria se a nota geral for 7 ou menos.'),
  }),
  identifiedSteps: z.array(HeroJourneyStepSchema).describe('Uma lista com a análise dos 12 passos da Jornada do Herói, na ordem teórica.'),
  threeActAnalysis: ThreeActStructureSchema.describe('Análise da estrutura de três atos do roteiro.')
});
export type AnalyzeScriptHeroJourneyOutput = z.infer<
  typeof AnalyzeScriptHeroJourneyOutputSchema
>;

export async function analyzeScriptHeroJourney(
  input: AnalyzeScriptHeroJourneyInput
): Promise<AnalyzeScriptHeroJourneyOutput> {
  return analyzeScriptHeroJourneyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptHeroJourneyPrompt',
  input: {schema: AnalyzeScriptHeroJourneyInputSchema},
  output: {schema: AnalyzeScriptHeroJourneyOutputSchema},
  prompt: `Você é um dramaturgo e consultor de roteiros especialista na Jornada do Herói e na estrutura clássica. Sua análise deve ser crítica, técnica e direta, com o objetivo de identificar pontos fracos e fornecer feedback acionável. Responda inteiramente em português, seguindo estritamente o formato de saída JSON.

**Princípios da Análise Crítica:**

1.  **Análise Completa:** Analise o roteiro em busca de manifestações de **TODOS os 12 passos** da Jornada do Herói. Para cada um dos 12 passos, você deve fornecer uma análise.
2.  **Identificação e Avaliação:** Se um passo for identificado, descreva como ele se manifesta e avalie sua eficácia. Se um passo **não for encontrado**, sua análise deve explicar a ausência e o impacto narrativo disso. Atribua uma pontuação de 0 se o passo estiver ausente.
3.  **Avaliação Exigente:** Seja rigoroso nas pontuações. Uma nota 10 deve ser reservada para execuções exemplares. Qualquer nota 7 ou inferior exige uma sugestão de melhoria clara e construtiva.

**Tarefas de Análise:**

1.  **Análise Geral (overallAnalysis):**
    *   'summary': Escreva um resumo crítico sobre como a Jornada do Herói é utilizada. Aponte se a estrutura é bem-sucedida ou se parece subdesenvolvida.
    *   'score': Atribua uma nota geral de 1 a 10, refletindo a eficácia geral da estrutura.
    *   'suggestions': Se a nota for 7 ou menos, forneça sugestões estratégicas para fortalecer a estrutura geral.

2.  **Passos da Jornada (identifiedSteps):**
    *   Liste **TODOS os 12 passos** na ordem teórica.
    *   Para cada passo, forneça: 'stepName', 'analysis' (crítica e concisa, explicando a presença ou ausência), 'score' (0-10), 'intensity' (0-100), e 'suggestions' (obrigatoriamente se a nota for <= 7).

3.  **Estrutura de 3 Atos (threeActAnalysis):**
    *   Forneça uma análise crítica e concisa de cada ato, focando em seu funcionamento (ou falhas) dentro da narrativa. Aponte problemas de ritmo, clareza e desenvolvimento.

**Os 12 Passos para Analisar:**
1. Mundo Comum
2. O Chamado à Aventura
3. Recusa do Chamado
4. Encontro com o Mentor
5. A Travessia do Primeiro Limiar
6. Provas, Aliados e Inimigos
7. Aproximação da Caverna Oculta
8. A Provação
9. A Recompensa
10. O Caminho de Volta
11. A Ressurreição
12. O Retorno com o Elixir

**Roteiro para Análise:**
{{{script}}}
`,
});

const analyzeScriptHeroJourneyFlow = ai.defineFlow(
  {
    name: 'analyzeScriptHeroJourneyFlow',
    inputSchema: AnalyzeScriptHeroJourneyInputSchema,
    outputSchema: AnalyzeScriptHeroJourneyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
