
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
  analysis: z.string().describe('A análise de como este passo se manifesta no roteiro.'),
  score: z.number().min(1).max(10).describe('Uma pontuação de 1 a 10 para a eficácia deste passo.'),
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
  identifiedSteps: z.array(HeroJourneyStepSchema).describe('Uma lista dos passos da Jornada do Herói que foram efetivamente identificados no roteiro, na ordem em que aparecem.'),
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
  prompt: `Você é um analista de roteiros especialista em dramaturgia e na Jornada do Herói. Analise o roteiro fornecido. Responda inteiramente em português.

**Instruções Importantes:**
1.  **Não force a estrutura:** Identifique **APENAS** os passos da Jornada do Herói que estão claramente presentes no roteiro. Se um passo não existir, não o inclua na análise.
2.  **Ordem de Aparição:** Liste os passos identificados na ordem em que eles aparecem na narrativa, não na ordem teórica tradicional.
3.  **Análise Detalhada:**
    *   **Análise Geral:** Escreva um resumo da análise dramatúrgica geral sobre como a Jornada do Herói é (ou não é) utilizada. Atribua uma nota geral de 1 a 10. Se a nota for 7 ou menos, forneça sugestões para melhorar a estrutura geral da jornada.
    *   **Passos Identificados:** Para cada passo que você identificar, forneça:
        - `stepName`: O nome do passo (ex: "O Chamado à Aventura").
        - `analysis`: Uma análise de como o passo se manifesta no roteiro.
        - `score`: Uma nota de 1 a 10 para a eficácia e clareza da execução do passo.
        - `suggestions`: Sugestões de melhoria **apenas se a nota for 7 ou inferior**.
        - `intensity`: Um número de 0 a 100 representando a intensidade dramática daquele momento.
    *   **Estrutura de 3 Atos:** Forneça uma análise concisa de cada um dos três atos (Apresentação, Confronto, Resolução), com comentários ou sugestões.

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
