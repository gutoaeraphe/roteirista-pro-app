
'use server';

/**
 * @fileOverview Expande conceitos narrativos em uma descrição detalhada.
 *
 * - generateNarrativeDetails - Uma função que expande os conceitos.
 * - GenerateNarrativeDetailsInput - O tipo de entrada para a função.
 * - GenerateNarrativeDetailsOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateNarrativeDetailsInputSchema = z.object({
  concept: z.string().describe('Os conceitos iniciais da narrativa fornecidos pelo usuário.'),
});
export type GenerateNarrativeDetailsInput = z.infer<typeof GenerateNarrativeDetailsInputSchema>;

export const GenerateNarrativeDetailsOutputSchema = z.object({
  narrativeDetails: z.string().describe('Uma descrição expandida e coesa dos detalhes da narrativa.'),
});
export type GenerateNarrativeDetailsOutput = z.infer<typeof GenerateNarrativeDetailsOutputSchema>;

export async function generateNarrativeDetails(input: GenerateNarrativeDetailsInput): Promise<GenerateNarrativeDetailsOutput> {
  return generateNarrativeDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNarrativeDetailsPrompt',
  input: {schema: GenerateNarrativeDetailsInputSchema},
  output: {schema: GenerateNarrativeDetailsOutputSchema},
  prompt: `Você é um roteirista criativo. Sua tarefa é pegar os conceitos narrativos fornecidos pelo usuário e expandi-los em uma descrição mais detalhada e coesa. Integre os diferentes pontos (conceito, objetivos, plot twist, etc.) em um parágrafo fluido e inspirador. Responda inteiramente em português.

**Conceitos Fornecidos:**
{{{concept}}}

Gere a descrição detalhada no campo 'narrativeDetails'.`,
});

const generateNarrativeDetailsFlow = ai.defineFlow(
  {
    name: 'generateNarrativeDetailsFlow',
    inputSchema: GenerateNarrativeDetailsInputSchema,
    outputSchema: GenerateNarrativeDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
