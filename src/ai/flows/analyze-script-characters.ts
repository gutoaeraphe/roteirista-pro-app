
'use server';

/**
 * @fileOverview Analisa os perfis psicológicos, motivações e arcos do protagonista e antagonista em um roteiro.
 *
 * - analyzeScriptCharacters - Uma função que lida com o processo de análise de personagens.
 * - AnalyzeScriptCharactersInput - O tipo de entrada para a função analyzeScriptCharacters.
 * - AnalyzeScriptCharactersOutput - O tipo de retorno para a função analyzeScriptCharacters.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptCharactersInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeScriptCharactersInput = z.infer<
  typeof AnalyzeScriptCharactersInputSchema
>;

const AnalyzeScriptCharactersOutputSchema = z.object({
  protagonistAnalysis: z.object({
    psychologicalProfile: z
      .string()
      .describe('Um perfil psicológico detalhado do protagonista.'),
    motivations: z
      .string()
      .describe('As motivações primárias que impulsionam o protagonista.'),
    arc: z
      .string()
      .describe('Uma descrição do arco do personagem do protagonista ao longo do roteiro.'),
  }),
  antagonistAnalysis: z.object({
    psychologicalProfile: z
      .string()
      .describe('Um perfil psicológico detalhado do antagonista.'),
    motivations: z
      .string()
      .describe('As motivações primárias que impulsionam o antagonista.'),
    arc: z
      .string()
      .describe('Uma descrição do arco do personagem do antagonista ao longo do roteiro.'),
  }),
});
export type AnalyzeScriptCharactersOutput = z.infer<
  typeof AnalyzeScriptCharactersOutputSchema
>;

export async function analyzeScriptCharacters(
  input: AnalyzeScriptCharactersInput
): Promise<AnalyzeScriptCharactersOutput> {
  return analyzeScriptCharactersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptCharactersPrompt',
  input: {schema: AnalyzeScriptCharactersInputSchema},
  output: {schema: AnalyzeScriptCharactersOutputSchema},
  prompt: `Você é um analista de roteiros especialista, habilidoso em entender as motivações e os arcos dos personagens.

  Analise o roteiro fornecido para determinar os perfis psicológicos, as motivações e os arcos tanto do protagonista quanto do antagonista.

  Forneça descrições detalhadas em português para cada personagem, focando no que os impulsiona e como eles mudam (ou não mudam) ao longo da história.

  Conteúdo do Roteiro: {{{scriptContent}}}
  `,
});

const analyzeScriptCharactersFlow = ai.defineFlow(
  {
    name: 'analyzeScriptCharactersFlow',
    inputSchema: AnalyzeScriptCharactersInputSchema,
    outputSchema: AnalyzeScriptCharactersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
