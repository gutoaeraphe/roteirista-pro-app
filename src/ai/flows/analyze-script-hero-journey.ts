
'use server';
/**
 * @fileOverview Analisa um roteiro para identificar os 12 passos da Jornada do Herói e visualizar a intensidade dramática.
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

const AnalyzeScriptHeroJourneyOutputSchema = z.object({
  heroJourneySteps: z
    .array(z.string())
    .describe('Os 12 passos da jornada do herói identificados no roteiro, com descrições em português.'),
  dramaticIntensity: z
    .array(z.number())
    .describe('Uma lista de números representando a intensidade dramática ao longo do roteiro.'),
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
  prompt: `Você é um analista de histórias especialista. Analise o roteiro fornecido e identifique os 12 passos da Jornada do Herói dentro dele. Além disso, determine a intensidade dramática ao longo do roteiro.

Roteiro:
{{{script}}}

Responda inteiramente em português. Para cada um dos 12 passos, forneça o nome do passo seguido por uma breve descrição de como ele se manifesta no roteiro.

Produza heroJourneySteps como uma lista de strings (cada string contendo o nome do passo e a descrição), e dramaticIntensity como uma lista correspondente de números (0-100) para cada passo da jornada. Quanto maior o número, mais intensa a dramaticidade naquele ponto da história. Certifique-se de que as listas tenham o mesmo comprimento.

{{outputFormatInstructions}}`,
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
