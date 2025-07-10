
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
type GenerateThemeSuggestionsInput = z.infer<typeof GenerateThemeSuggestionsInputSchema>;

const GenerateThemeSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('Uma lista de sugestões de temas relacionados.'),
});
type GenerateThemeSuggestionsOutput = z.infer<typeof GenerateThemeSuggestionsOutputSchema>;

export async function generateThemeSuggestions(input: GenerateThemeSuggestionsInput): Promise<GenerateThemeSuggestionsOutput> {
  return generateThemeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThemeSuggestionsPrompt',
  input: {schema: GenerateThemeSuggestionsInputSchema},
  output: {schema: GenerateThemeSuggestionsOutputSchema},
  prompt: `Você é um roteirista e filósofo. Com base no tema principal fornecido, gere exatamente {{count}} sugestões. Cada sugestão deve ser uma frase concisa que introduza um tema secundário e explique brevemente como ele pode enriquecer a história principal. Responda inteiramente em português.

**Exemplo de Formato:**
"Explorar o luto como um catalisador para a mudança, mostrando como a perda força o protagonista a confrontar suas falhas."

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
