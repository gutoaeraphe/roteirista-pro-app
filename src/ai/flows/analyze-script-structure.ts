
'use server';

/**
 * @fileOverview Analisa um roteiro, fornecendo um dashboard detalhado de sua estrutura,
 * personagens, potencial comercial e originalidade, incluindo pontuações e sugestões.
 *
 * - analyzeScriptStructure - Uma função que lida com o processo de análise do roteiro.
 * - AnalyzeScriptStructureInput - O tipo de entrada para a função analyzeScriptStructure.
 * - AnalyzeScriptStructureOutput - O tipo de retorno para a função analyzeScriptStructure.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptStructureInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeScriptStructureInput = z.infer<
  typeof AnalyzeScriptStructureInputSchema
>;

const MetricSchema = z.object({
    score: z.number().min(1).max(10).describe('Uma pontuação de 1 a 10 para a métrica.'),
    analysis: z.string().describe('Uma análise contextual da pontuação.'),
    suggestions: z.string().optional().describe('Sugestões de melhoria se a pontuação for 7 ou menos.'),
});
export type Metric = z.infer<typeof MetricSchema>;

const DramaticElementSchema = z.object({
    name: z.string().describe('O nome do elemento dramático (ex: "Evento Desencadeador").'),
    identifiedExcerpt: z.string().describe('O trecho do roteiro que representa este elemento.'),
    effectivenessAnalysis: z.string().describe('Uma análise crítica da função e do impacto deste elemento.'),
});
export type DramaticElement = z.infer<typeof DramaticElementSchema>;


const AnalyzeScriptStructureOutputSchema = z.object({
  plotSummary: z.string().describe("Um breve resumo da trama."),
  mainMetrics: z.object({
    narrativeStructure: MetricSchema.describe("Avaliação da qualidade geral da estrutura narrativa, com média das pontuações de critérios específicos."),
    characterDevelopment: MetricSchema.describe("Avaliação da profundidade e do arco dos personagens principais."),
    commercialPotential: MetricSchema.describe("Estimativa baseada em gênero, originalidade e tendências de mercado."),
    originality: MetricSchema.describe("Avaliação da singularidade da premissa e da execução em comparação com obras existentes."),
  }),
  dramaticElements: z.array(DramaticElementSchema).describe("Identificação e análise dos elementos dramáticos centrais."),
  structureCriteria: z.object({
    balance: MetricSchema.describe("Avalia a distribuição de atenção e desenvolvimento entre as partes da história."),
    tension: MetricSchema.describe("Analisa a capacidade do roteiro de gerar e manter o interesse e a expectativa do público."),
    unity: MetricSchema.describe("Verifica a coesão e a integridade da narrativa, garantindo que todos os elementos contribuam para a história principal."),
    contrast: MetricSchema.describe("Examina a presença de elementos contrastantes (personagens, situações, emoções) que enriquecem a narrativa."),
    directionality: MetricSchema.describe("Avalia a clareza do objetivo da história e a progressão da trama em direção a ele."),
  }),
});
export type AnalyzeScriptStructureOutput = z.infer<
  typeof AnalyzeScriptStructureOutputSchema
>;

export async function analyzeScriptStructure(
  input: AnalyzeScriptStructureInput
): Promise<AnalyzeScriptStructureOutput> {
  return analyzeScriptStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptStructurePrompt',
  input: {schema: AnalyzeScriptStructureInputSchema},
  output: {schema: AnalyzeScriptStructureOutputSchema},
  prompt: `Você é um analista de roteiros especialista. Analise o roteiro fornecido e gere uma análise detalhada para um dashboard. Responda inteiramente em português.

Siga estas instruções precisamente:
1.  **Resumo da Trama**: Escreva um resumo conciso da trama.
2.  **Métricas Principais**: Forneça uma pontuação (1-10), uma análise contextual para essa pontuação e sugestões de melhoria se a pontuação for 7 ou menor para cada um dos seguintes itens:
    - **Estrutura Narrativa**: A média das cinco pontuações dos critérios de estrutura abaixo.
    - **Desenvolvimento de Personagens**: Profundidade e arco dos personagens principais.
    - **Potencial Comercial**: Com base em gênero, originalidade e tendências de mercado.
    - **Originalidade**: Singularidade da premissa e execução.
3.  **Elementos Dramáticos**: Para cada um dos seguintes elementos, identifique o trecho correspondente do roteiro e forneça uma análise crítica de sua eficácia e impacto:
    - Evento Desencadeador
    - Questão Dramática
    - Objetivo do Protagonista
    - Obstáculos
    - Clímax
    - Resolução
    - Tema Central
4.  **Critérios de Estrutura**: Para cada um dos seguintes critérios, forneça uma pontuação (1-10), uma análise contextual do roteiro com base neste critério e sugestões concretas de melhoria se a pontuação for 7 ou menor:
    - **Equilíbrio**: Distribuição da atenção entre as partes da história.
    - **Tensão**: Capacidade de gerar e manter o interesse.
    - **Unidade**: Coesão da narrativa.
    - **Contraste**: Elementos contrastantes que enriquecem a narrativa.
    - **Direcionalidade**: Clareza do objetivo da história e progressão.

Sempre forneça sugestões para qualquer pontuação de 7 ou inferior.

Conteúdo do Roteiro:
{{{scriptContent}}}
`,
});

const analyzeScriptStructureFlow = ai.defineFlow(
  {
    name: 'analyzeScriptStructureFlow',
    inputSchema: AnalyzeScriptStructureInputSchema,
    outputSchema: AnalyzeScriptStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
