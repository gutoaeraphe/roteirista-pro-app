
'use server';

/**
 * @fileOverview Aprimora um conceito de personagem em um perfil detalhado, considerando o contexto da história.
 *
 * - refineCharacterProfile - Uma função que detalha o perfil do personagem.
 * - RefineCharacterProfileInput - O tipo de entrada para a função.
 * - RefineCharacterProfileOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const RefineCharacterProfileInputSchema = z.object({
  concept: z.string().describe('O conceito inicial do personagem fornecido pelo usuário.'),
  storyContext: z.any().optional().describe('Um objeto contendo todas as seleções do usuário até o momento (conceitos, tema, etc.).'),
});
export type RefineCharacterProfileInput = z.infer<typeof RefineCharacterProfileInputSchema>;

export const RefineCharacterProfileOutputSchema = z.object({
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
  prompt: `Você é um criador de personagens especialista. Com base no conceito inicial e no contexto da história fornecidos, crie um perfil de personagem detalhado.

**Instruções:**
1.  Analise o **Conceito Inicial** do personagem.
2.  Analise o **Contexto da História** (tons, gêneros, tema, etc.).
3.  Crie um perfil que elabore sobre o psicológico, forças, fraquezas e motivações do personagem.
4.  O perfil deve ser **coerente** com o contexto da história. Por exemplo, um personagem em um drama íntimo sobre redenção será diferente de um em uma fantasia épica sobre poder.
5.  Apresente o resultado como um texto em prosa, bem escrito, **objetivo e conciso**, não como uma lista.
6.  Responda inteiramente em português.

**Conceito Inicial:**
{{{concept}}}

**Contexto da História:**
\`\`\`json
{{{json storyContext}}}
\`\`\`

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
