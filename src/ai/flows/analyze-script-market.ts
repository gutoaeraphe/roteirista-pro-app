
'use server';

/**
 * @fileOverview Fornece insights de mercado para um roteiro, incluindo público-alvo, tendências de mercado,
 * originalidade, obras de referência e canais de distribuição.
 *
 * - analyzeScriptMarket - Uma função que lida com o processo de análise de mercado do roteiro.
 * - AnalyzeScriptMarketInput - O tipo de entrada para a função analyzeScriptMarket.
 * - AnalyzeScriptMarketOutput - O tipo de retorno para a função analyzeScriptMarket.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptMarketInputSchema = z.object({
  scriptSummary: z
    .string()
    .describe('Um resumo do roteiro a ser analisado para insights de mercado.'),
  genre: z.string().describe('O gênero do roteiro.'),
});
export type AnalyzeScriptMarketInput = z.infer<typeof AnalyzeScriptMarketInputSchema>;

const AnalyzeScriptMarketOutputSchema = z.object({
  targetAudience: z.string().describe('O público-alvo para o roteiro.'),
  marketTrends: z.string().describe('Tendências de mercado atuais relevantes para o roteiro.'),
  originality: z.string().describe('Uma avaliação da originalidade do roteiro.'),
  referenceWorks: z
    .string()
    .describe('Obras comparáveis que servem como referência para o roteiro.'),
  distributionChannels: z
    .string()
    .describe('Canais de distribuição potenciais para o roteiro.'),
  commercialViability: z.string().describe('Avaliação geral da viabilidade comercial.'),
});
export type AnalyzeScriptMarketOutput = z.infer<typeof AnalyzeScriptMarketOutputSchema>;

export async function analyzeScriptMarket(input: AnalyzeScriptMarketInput): Promise<AnalyzeScriptMarketOutput> {
  return analyzeScriptMarketFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptMarketPrompt',
  input: {schema: AnalyzeScriptMarketInputSchema},
  output: {schema: AnalyzeScriptMarketOutputSchema},
  prompt: `Você é um analista de mercado de cinema experiente. Forneça insights de mercado em português para o seguinte resumo de roteiro:

Gênero: {{{genre}}}

Resumo do Roteiro: {{{scriptSummary}}}

Analise o roteiro para determinar o público-alvo, tendências de mercado relevantes, sua originalidade, obras de referência comparáveis, canais de distribuição potenciais e uma avaliação geral da viabilidade comercial.

Seja conciso, específico e responda inteiramente em português.`,
});

const analyzeScriptMarketFlow = ai.defineFlow(
  {
    name: 'analyzeScriptMarketFlow',
    inputSchema: AnalyzeScriptMarketInputSchema,
    outputSchema: AnalyzeScriptMarketOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
