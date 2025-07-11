
'use server';

/**
 * @fileOverview Aprimora uma ideia de tema em um tema mais detalhado, considerando o contexto da história.
 *
 * - refineTheme - Uma função que refina o tema.
 * - RefineThemeInput - O tipo de entrada para a função.
 * - RefineThemeOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineThemeInputSchema = z.object({
  idea: z.string().describe('A ideia inicial do tema fornecida pelo usuário.'),
  storyContext: z.any().optional().describe('Um objeto contendo todas as seleções do usuário até o momento (tons, gêneros, conflitos, etc.).'),
});
type RefineThemeInput = z.infer<typeof RefineThemeInputSchema>;

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
  prompt: `Você é um roteirista e pensador conceitual. Sua tarefa é pegar a ideia de tema fornecida pelo usuário e aprimorá-la, tornando-a mais profunda e instigante.

**Instruções:**
1.  Analise a **Ideia Inicial** do usuário.
2.  Analise o **Contexto da História** fornecido, que contém os tons, gêneros, conflitos e universo já selecionados.
3.  Com base em TUDO isso, expanda a ideia inicial em um parágrafo bem formulado. O tema refinado deve ser coerente com o contexto da história. Se o contexto estiver vazio, foque apenas na ideia inicial.
4.  Responda inteiramente em português.

**Ideia Inicial:**
{{{idea}}}

**Contexto da História (se fornecido):**
\`\`\`json
{{{json storyContext}}}
\`\`\`

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
