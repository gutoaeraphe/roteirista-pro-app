
'use server';

/**
 * @fileOverview Aprimora uma ideia de tema em um tema mais detalhado.
 *
 * - refineTheme - Uma função que refina o tema.
 * - RefineThemeInput - O tipo de entrada para a função.
 * - RefineThemeOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineThemeInputSchema = z.object({
  idea: z.string().describe('A ideia inicial do tema fornecida pelo usuário.'),
});
export type RefineThemeInput = z.infer<typeof RefineThemeInputSchema>;

const RefineThemeOutputSchema = z.object({
  refinedTheme: z.string().describe('O tema aprimorado e detalhado pela IA.'),
});
export type RefineThemeOutput = z.infer<typeof RefineThemeOutputSchema>;

export async function refineTheme(input: RefineThemeInput): Promise<RefineThemeOutput> {
  return refineThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineThemePrompt',
  input: {schema: RefineThemeInputSchema},
  output: {schema: RefineThemeOutputSchema},
  prompt: `Você é um roteirista e pensador conceitual. Sua tarefa é pegar a ideia de tema fornecida pelo usuário e aprimorá-la, tornando-a mais profunda, detalhada e instigante. Expanda a ideia inicial em um parágrafo bem formulado. Responda inteiramente em português.

**Ideia Inicial:**
{{{idea}}}

Gere o tema aprimorado no campo 'refinedTheme'.`,
});

const refineThemeFlow = ai.defineFlow(
  {
    name: 'refineThemeFlow',
    inputSchema: RefineThemeInputSchema,
    outputSchema: RefineThemeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
