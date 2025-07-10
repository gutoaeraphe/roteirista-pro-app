
'use server';

/**
 * @fileOverview Gera sugestões de temas relacionados a um tema principal, considerando o contexto da história.
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
  storyContext: z.any().optional().describe('Um objeto contendo todas as seleções do usuário até o momento (tons, gêneros, conflitos, etc.).'),
});
type GenerateThemeSuggestionsInput = z.infer<typeof GenerateThemeSuggestionsInputSchema>;

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
  prompt: `Você é um roteirista e filósofo. Com base no tema principal e no contexto da história fornecidos, gere exatamente {{count}} sugestões.

**Instruções:**
1.  Considere o **Tema Principal**.
2.  Analise o **Contexto da História** (tons, gêneros, etc.), se fornecido.
3.  Cada sugestão deve ser uma frase concisa que introduza um tema secundário e explique brevemente como ele pode enriquecer a história principal, sendo coerente com o contexto.
4.  Responda inteiramente em português.

**Exemplo de Formato:**
"Explorar o luto como um catalisador para a mudança, mostrando como a perda força o protagonista a confrontar suas falhas."

**Tema Principal:**
{{{mainTheme}}}

**Contexto da História (se fornecido):**
\`\`\`json
{{{json storyContext}}}
\`\`\`

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
