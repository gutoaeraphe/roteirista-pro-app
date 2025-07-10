
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
  generalAnalysis: z.string().describe('Uma análise geral do personagem, resumindo suas principais características e seu papel na história.'),
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
  prompt: `Você é um consultor de roteiros e especialista em desenvolvimento de personagens. Sua análise deve ser profunda, crítica e construtiva, focada em identificar fraquezas e oportunidades de aprofundamento. Aja como um "script doctor" que não tem medo de dar feedback direto para melhorar a história. Responda inteiramente em português.

Para cada personagem principal (protagonista e antagonista), forneça a seguinte análise crítica:
1.  **Análise Geral**: Resuma o papel do personagem na história, avaliando sua eficácia em cumprir essa função.
2.  **Perfil Psicológico**: Vá além da superfície. Analise as possíveis contradições, complexidades e falhas no perfil psicológico apresentado.
3.  **Forças**: Liste as qualidades do personagem, mas questione se elas são usadas de forma interessante ou se o tornam previsível.
4.  **Fraquezas**: Identifique as vulnerabilidades e falhas de caráter. São elas que geram conflito e humanizam o personagem? Elas são exploradas de forma significativa na trama?
5.  **Motivações Internas**: Avalie a clareza e a força das motivações internas. São elas convincentes e fortes o suficiente para sustentar as ações do personagem?
6.  **Motivações Externas**: Analise como os fatores externos impactam o personagem. A relação entre motivação interna e externa é bem construída?
7.  **Arco de Personagem**: Descreva a jornada de transformação. O arco é claro e significativo? A mudança (ou a falta dela) é earned (conquistada) ou parece arbitrária? Aponte os pontos altos e baixos do arco.
8.  **Sugestões para Melhorar**: Esta é a seção mais importante. Forneça insights e recomendações claras, diretas e acionáveis para aprofundar o personagem. Sugira maneiras de torná-lo mais complexo, imprevisível e cativante. Não hesite em apontar clichês ou superficialidades.

Seja detalhado e forneça uma análise que desafie o roteirista a pensar criticamente sobre seus personagens.

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
