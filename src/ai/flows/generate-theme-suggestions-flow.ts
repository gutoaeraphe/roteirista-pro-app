
'use server';

/**
 * @fileOverview Gera sugestões de temas relacionados a um tema principal.
 *
 * - generateThemeSuggestions - Uma função que gera sugestões de tema.
 * - GenerateThemeSuggestionsInput - O tipo de entrada para a função.
 * - GenerateThemeSuggestionsOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThemeSuggestionsInputSchema = z.object({
  mainTheme: z.string().describe('O tema principal a partir do qual as sugestões serão geradas.'),
  count: z.number().optional().default(4).describe('O número de sugestões a serem geradas.'),
});
export type GenerateThemeSuggestionsInput = z.infer<typeof GenerateThemeSuggestionsInputSchema>;

const GenerateThemeSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('Uma lista de sugestões de temas relacionados.'),
});
export type GenerateThemeSuggestionsOutput = z.infer<typeof GenerateThemeSuggestionsOutputSchema>;

export async function generateThemeSuggestions(input: GenerateThemeSuggestionsInput): Promise<GenerateThemeSuggestionsOutput> {
  return generateThemeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThemeSuggestionsPrompt',
  input: {schema: GenerateThemeSuggestionsInputSchema},
  output: {schema: GenerateThemeSuggestionsOutputSchema},
  prompt: `Você é um roteirista e filósofo. Com base no tema principal fornecido, gere {{count}} sugestões de temas secundários ou facetas que possam enriquecer a história. Cada sugestão deve ser uma frase concisa e instigante. Responda inteiramente em português.

**Tema Principal:**
{{{mainTheme}}}

Gere as sugestões na lista 'suggestions'.`,
});

const generateThemeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateThemeSuggestionsFlow',
    inputSchema: GenerateThemeSuggestionsInputSchema,
    outputSchema: GenerateThemeSuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
