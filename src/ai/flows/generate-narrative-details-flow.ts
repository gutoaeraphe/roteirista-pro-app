
'use server';

/**
 * @fileOverview Expande conceitos narrativos em uma descrição detalhada, usando o contexto da história.
 *
 * - generateNarrativeDetails - Uma função que expande os conceitos.
 * - GenerateNarrativeDetailsInput - O tipo de entrada para a função.
 * - GenerateNarrativeDetailsOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNarrativeDetailsInputSchema = z.object({
  concept: z.string().describe('Os conceitos narrativos fornecidos pelo usuário.'),
  storyContext: z.any().optional().describe('O contexto completo da história, incluindo conceitos, tema e personagens.'),
});
type GenerateNarrativeDetailsInput = z.infer<typeof GenerateNarrativeDetailsInputSchema>;

const GenerateNarrativeDetailsOutputSchema = z.object({
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
  prompt: `Você é um roteirista criativo. Sua tarefa é pegar os conceitos narrativos fornecidos e expandi-los em uma descrição detalhada, garantindo que ela se conecte a todo o contexto da história.

**Instruções:**
1.  Analise os **Conceitos Narrativos** fornecidos.
2.  Analise o **Contexto da História** (tons, gêneros, tema, personagens).
3.  Integre os diferentes pontos (conceito fundamental, objetivos, plot twist, etc.) em um parágrafo fluido e inspirador.
4.  A narrativa detalhada deve ser **consistente** com os personagens e o tema já estabelecidos no contexto.
5.  Responda inteiramente em português.

**Conceitos Narrativos:**
{{{concept}}}

**Contexto da História:**
\`\`\`json
{{{json storyContext}}}
\`\`\`

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
