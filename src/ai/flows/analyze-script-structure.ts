
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
    effectivenessAnalysis: z.string().describe('Uma crítica da função e do impacto deste elemento.'),
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

const AnalysisOnlySchema = AnalyzeScriptStructureOutputSchema.deepPartial().extend({
    plotSummary: z.string(),
    mainMetrics: z.object({
        narrativeStructure: MetricSchema.omit({suggestions: true}),
        characterDevelopment: MetricSchema.omit({suggestions: true}),
        commercialPotential: MetricSchema.omit({suggestions: true}),
        originality: MetricSchema.omit({suggestions: true}),
    }),
    dramaticElements: z.array(DramaticElementSchema),
    structureCriteria: z.object({
        balance: MetricSchema.omit({suggestions: true}),
        tension: MetricSchema.omit({suggestions: true}),
        unity: MetricSchema.omit({suggestions: true}),
        contrast: MetricSchema.omit({suggestions: true}),
        directionality: MetricSchema.omit({suggestions: true}),
    }),
});

const SuggestionsOnlySchema = z.object({
    mainMetrics: z.object({
        narrativeStructure: z.string().optional(),
        characterDevelopment: z.string().optional(),
        commercialPotential: z.string().optional(),
        originality: z.string().optional(),
    }),
    structureCriteria: z.object({
        balance: z.string().optional(),
        tension: z.string().optional(),
        unity: z.string().optional(),
        contrast: z.string().optional(),
        directionality: z.string().optional(),
    }),
});

export async function analyzeScriptStructure(
  input: AnalyzeScriptStructureInput
): Promise<AnalyzeScriptStructureOutput> {
  return analyzeScriptStructureFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeScriptStructureAnalysisPrompt',
  input: {schema: AnalyzeScriptStructureInputSchema},
  output: {schema: AnalysisOnlySchema},
  config: { temperature: 0.2 },
  prompt: `Você é um consultor de roteiros sênior, um "script doctor" com um olhar crítico e analítico. Sua tarefa é analisar o roteiro fornecido com rigor técnico, como se estivesse preparando um relatório para um estúdio. Seja objetivo, direto e **NÃO gere sugestões de melhoria**. Apenas faça a análise e atribua as pontuações. Responda inteiramente em português.

**Instruções Precisas:**
1.  **Resumo da Trama**: Escreva um resumo conciso e neutro da trama.
2.  **Métricas Principais**: Para cada item, seja rigoroso na pontuação (1-10) e forneça uma análise crítica. **NÃO CRIE SUGESTÕES.**
    - **Estrutura Narrativa**: A média das cinco pontuações dos critérios de estrutura abaixo.
    - **Desenvolvimento de Personagens**: Profundidade, falhas, motivações e arco dos personagens principais.
    - **Potencial Comercial**: Análise fria baseada em gênero, apelo de público e tendências de mercado.
    - **Originalidade**: Avalie a premissa e a execução em relação a clichês e obras existentes.
3.  **Elementos Dramáticos**: Para cada elemento, identifique o trecho correspondente do roteiro e forneça uma análise crítica de sua eficácia. Ele funciona? É impactante? Poderia ser mais forte?
    - Evento Desencadeador, Questão Dramática, Objetivo do Protagonista, Obstáculos, Clímax, Resolução, Tema Central.
4.  **Critérios de Estrutura**: Para cada critério, seja exigente. Forneça uma pontuação (1-10) e uma análise que justifique a nota (apontando falhas e acertos). **NÃO CRIE SUGESTÕES.**
    - **Equilíbrio**: A distribuição de tempo e desenvolvimento entre os atos e personagens é eficaz?
    - **Tensão**: O roteiro consegue criar e sustentar o interesse?
    - **Unidade**: Todos os elementos servem à trama principal?
    - **Contraste**: O roteiro usa elementos de contraste para enriquecer a narrativa?
    - **Direcionalidade**: A trama tem um rumo claro?

Conteúdo do Roteiro:
{{{scriptContent}}}
`,
});

const suggestionsPrompt = ai.definePrompt({
    name: 'generateStructureSuggestionsPrompt',
    input: { schema: AnalysisOnlySchema },
    output: { schema: SuggestionsOnlySchema },
    config: { temperature: 0.9 },
    prompt: `Você é um roteirista criativo e um "script doctor" experiente. Com base na análise técnica fornecida, sua tarefa é gerar **sugestões de melhoria criativas, contextualizadas e acionáveis** para cada critério com nota igual ou inferior a 7.

**Regra de Ouro para as Sugestões:**
Seja específico! Use os elementos do roteiro para propor soluções.
- **Exemplo Ruim:** "Melhore a tensão."
- **Exemplo Bom:** "Para aumentar a tensão, considere fazer com que o prazo para o protagonista desarmar a bomba coincida com o aniversário de sua filha, adicionando um peso emocional à contagem regressiva."

**Análise Técnica para Referência:**
\`\`\`json
{{{json this}}}
\`\`\`

Gere sugestões apenas para os campos onde a pontuação for 7 ou menor. Se a pontuação for maior que 7, deixe o campo de sugestão em branco ou omita-o. As sugestões devem ser um texto (string).`
});


const analyzeScriptStructureFlow = ai.defineFlow(
  {
    name: 'analyzeScriptStructureFlow',
    inputSchema: AnalyzeScriptStructureInputSchema,
    outputSchema: AnalyzeScriptStructureOutputSchema,
  },
  async input => {
    // 1. Análise técnica com baixa temperatura
    const { output: analysis } = await analysisPrompt(input);
    if (!analysis) {
        throw new Error("A fase de análise técnica falhou.");
    }

    // 2. Geração de sugestões criativas com alta temperatura
    const { output: suggestions } = await suggestionsPrompt(analysis);
     if (!suggestions) {
        throw new Error("A fase de geração de sugestões falhou.");
    }

    // 3. Combinar os resultados
    const finalResult: AnalyzeScriptStructureOutput = {
      ...analysis,
      mainMetrics: {
        narrativeStructure: {
          ...analysis.mainMetrics.narrativeStructure,
          suggestions: suggestions.mainMetrics.narrativeStructure,
        },
        characterDevelopment: {
          ...analysis.mainMetrics.characterDevelopment,
          suggestions: suggestions.mainMetrics.characterDevelopment,
        },
        commercialPotential: {
          ...analysis.mainMetrics.commercialPotential,
          suggestions: suggestions.mainMetrics.commercialPotential,
        },
        originality: {
          ...analysis.mainMetrics.originality,
          suggestions: suggestions.mainMetrics.originality,
        },
      },
      structureCriteria: {
        balance: {
          ...analysis.structureCriteria.balance,
          suggestions: suggestions.structureCriteria.balance,
        },
        tension: {
          ...analysis.structureCriteria.tension,
          suggestions: suggestions.structureCriteria.tension,
        },
        unity: {
          ...analysis.structureCriteria.unity,
          suggestions: suggestions.structureCriteria.unity,
        },
        contrast: {
          ...analysis.structureCriteria.contrast,
          suggestions: suggestions.structureCriteria.contrast,
        },
        directionality: {
          ...analysis.structureCriteria.directionality,
          suggestions: suggestions.structureCriteria.directionality,
        },
      },
    };

    return finalResult;
  }
);
