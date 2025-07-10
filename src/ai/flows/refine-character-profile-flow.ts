
'use server';

/**
 * @fileOverview Aprimora um conceito de personagem em um perfil detalhado.
 *
 * - refineCharacterProfile - Uma função que detalha o perfil do personagem.
 * - RefineCharacterProfileInput - O tipo de entrada para a função.
 * - RefineCharacterProfileOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineCharacterProfileInputSchema = z.object({
  concept: z.string().describe('O conceito inicial do personagem fornecido pelo usuário.'),
});
export type RefineCharacterProfileInput = z.infer<typeof RefineCharacterProfileInputSchema>;

const RefineCharacterProfileOutputSchema = z.object({
  detailedProfile: z.string().describe('O perfil detalhado do personagem, incluindo psicológico, forças, fraquezas e motivações.'),
});
export type RefineCharacterProfileOutput = z.infer<typeof RefineCharacterProfileOutputSchema>;

export async function refineCharacterProfile(input: RefineCharacterProfileInput): Promise<RefineCharacterProfileOutput> {
  return refineCharacterProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineCharacterProfilePrompt',
  input: {schema: RefineCharacterProfileInputSchema},
  output: {schema: RefineCharacterProfileOutputSchema},
  prompt: `Você é um criador de personagens especialista. Com base no conceito inicial fornecido pelo usuário, crie um perfil de personagem detalhado. Elabore sobre o perfil psicológico, forças, fraquezas e motivações (internas, externas, sociais). Apresente o resultado como um texto em prosa, bem escrito e coeso, não como uma lista. Responda inteiramente em português.

**Conceito Inicial:**
{{{concept}}}

Gere o perfil detalhado no campo 'detailedProfile'.`,
});

const refineCharacterProfileFlow = ai.defineFlow(
  {
    name: 'refineCharacterProfileFlow',
    inputSchema: RefineCharacterProfileInputSchema,
    outputSchema: RefineCharacterProfileOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
