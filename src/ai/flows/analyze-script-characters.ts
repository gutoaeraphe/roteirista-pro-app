
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
  protagonistAntagonistRelationship: z.string().describe('Uma análise da dinâmica, conflito e evolução da relação entre o protagonista e o antagonista, explicando como essa interação move a trama.'),
  protagonistAnalysis: CharacterProfileSchema,
  antagonistAnalysis: CharacterProfileSchema,
});
export type AnalyzeScriptCharactersOutput = z.infer<
  typeof AnalyzeScriptCharactersOutputSchema
>;

const AnalysisOnlySchema = AnalyzeScriptCharactersOutputSchema.deepPartial().extend({
    protagonistAntagonistRelationship: z.string(),
    protagonistAnalysis: CharacterProfileSchema.omit({ improvementSuggestions: true }),
    antagonistAnalysis: CharacterProfileSchema.omit({ improvementSuggestions: true }),
});

const SuggestionsOnlySchema = z.object({
    protagonist: z.string().describe("Sugestões para o protagonista."),
    antagonist: z.string().describe("Sugestões para o antagonista."),
});


export async function analyzeScriptCharacters(
  input: AnalyzeScriptCharactersInput
): Promise<AnalyzeScriptCharactersOutput> {
  return analyzeScriptCharactersFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeCharactersAnalysisPrompt',
  input: {schema: AnalyzeScriptCharactersInputSchema},
  output: {schema: AnalysisOnlySchema},
  config: { temperature: 0.2 },
  prompt: `Você é um consultor de roteiros e especialista em desenvolvimento de personagens. Sua análise deve ser profunda e crítica. **NÃO GERE SUGESTÕES DE MELHORIA**. Apenas faça a análise. Responda inteiramente em português.

**Primeiro e mais importante: Analise a Relação Protagonista vs. Antagonista.**
Descreva a dinâmica central entre eles. Como o conflito evolui? Essa relação é o motor da trama?

**Em seguida, para cada personagem principal (protagonista e antagonista), forneça a seguinte análise crítica (SEM SUGESTÕES):**
1.  **Análise Geral**: Resuma o papel do personagem.
2.  **Perfil Psicológico**: Analise as contradições e complexidades.
3.  **Forças**: Liste as qualidades do personagem.
4.  **Fraquezas**: Identifique as vulnerabilidades e falhas.
5.  **Motivações Internas**: Avalie a clareza e a força das motivações.
6.  **Motivações Externas**: Analise os fatores externos.
7.  **Arco de Personagem**: Descreva a jornada de transformação.

Conteúdo do Roteiro:
{{{scriptContent}}}
  `,
});

const suggestionsPrompt = ai.definePrompt({
    name: 'generateCharacterSuggestionsPrompt',
    input: { schema: AnalysisOnlySchema },
    output: { schema: SuggestionsOnlySchema },
    config: { temperature: 0.9 },
    prompt: `Você é um roteirista criativo e especialista em personagens. Com base na análise técnica fornecida, gere **sugestões claras, diretas e acionáveis** para aprofundar o protagonista e o antagonista.

**Instruções para as Sugestões:**
- Suas sugestões devem ser criativas e desafiar o roteirista a pensar criticamente.
- Sugira maneiras de tornar os personagens mais complexos, imprevisíveis e cativantes.
- Não hesite em apontar clichês ou superficialidades e oferecer alternativas.
- Seja específico e use o contexto da análise para embasar suas ideias.

**Análise Técnica para Referência:**
\`\`\`json
{{{json this}}}
\`\`\`

Gere sugestões para o campo 'protagonist' e 'antagonist' com base em suas respectivas análises.`
});

const analyzeScriptCharactersFlow = ai.defineFlow(
  {
    name: 'analyzeScriptCharactersFlow',
    inputSchema: AnalyzeScriptCharactersInputSchema,
    outputSchema: AnalyzeScriptCharactersOutputSchema,
  },
  async input => {
    // 1. Análise técnica
    const { output: analysis } = await analysisPrompt(input);
    if (!analysis) {
        throw new Error("A fase de análise de personagens falhou.");
    }

    // 2. Geração de sugestões
    const { output: suggestions } = await suggestionsPrompt(analysis);
    if (!suggestions) {
        throw new Error("A fase de geração de sugestões de personagens falhou.");
    }
    
    // 3. Combinar resultados
    const finalResult: AnalyzeScriptCharactersOutput = {
      protagonistAntagonistRelationship: analysis.protagonistAntagonistRelationship,
      protagonistAnalysis: {
        ...analysis.protagonistAnalysis,
        improvementSuggestions: suggestions.protagonist,
      },
      antagonistAnalysis: {
        ...analysis.antagonistAnalysis,
        improvementSuggestions: suggestions.antagonist,
      },
    };

    return finalResult;
  }
);
