
'use server';

/**
 * @fileOverview Analisa os perfis psicológicos, motivações e arcos do protagonista e antagonista em um roteiro, fornecendo sugestões de melhoria.
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

const CharacterProfileSchema = z.object({
  psychologicalProfile: z
    .string()
    .describe(
      'Uma descrição da personalidade, traços de caráter e estado emocional do personagem.'
    ),
  strengths: z
    .string()
    .describe('As qualidades positivas e habilidades do personagem.'),
  weaknesses: z
    .string()
    .describe('As vulnerabilidades e defeitos do personagem.'),
  internalMotivations: z
    .string()
    .describe('Os desejos, necessidades e impulsos internos que movem o personagem.'),
  externalMotivations: z
    .string()
    .describe(
      'Os fatores e eventos externos que influenciam as ações do personagem.'
    ),
  arc: z
    .string()
    .describe(
      'Uma descrição da transformação do personagem ao longo da história, identificando mudanças, objetivos e obstáculos.'
    ),
  improvementSuggestions: z
    .string()
    .describe(
      'Insights e recomendações da IA para aprofundar ou melhorar o personagem.'
    ),
});

const AnalyzeScriptCharactersOutputSchema = z.object({
  protagonistAnalysis: CharacterProfileSchema,
  antagonistAnalysis: CharacterProfileSchema,
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
  prompt: `Você é um analista de roteiros e psicólogo de personagens especialista. Analise o roteiro fornecido para criar perfis detalhados do protagonista e do antagonista. Responda inteiramente em português.

Para cada personagem (protagonista e antagonista), forneça a seguinte análise aprofundada:
1.  **Perfil Psicológico**: Descreva a personalidade, traços de caráter e estado emocional geral.
2.  **Forças**: Liste suas qualidades positivas, talentos e habilidades.
3.  **Fraquezas**: Aponte suas vulnerabilidades, defeitos e falhas de caráter.
4.  **Motivações Internas**: Explique seus desejos, necessidades e impulsos mais profundos.
5.  **Motivações Externas**: Descreva os fatores e eventos externos que o influenciam.
6.  **Arco de Personagem**: Trace sua jornada de transformação, identificando mudanças, objetivos e os obstáculos que enfrenta.
7.  **Sugestões para Melhorar**: Ofereça insights e recomendações claras para aprofundar o personagem, tornando-o mais complexo e cativante.

Seja detalhado e forneça análises que possam ser diretamente usadas pelo roteirista para aprimorar a história.

Conteúdo do Roteiro:
{{{scriptContent}}}
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
