
'use server';

/**
 * @fileOverview Analisa a recepção e o engajamento de um roteiro.
 *
 * - analyzeReceptionAndEngagement - Inicia a análise.
 * - AnalyzeReceptionAndEngagementInput - O tipo de entrada para a função.
 * - AnalyzeReceptionAndEngagementOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeReceptionAndEngagementInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeReceptionAndEngagementInput = z.infer<
  typeof AnalyzeReceptionAndEngagementInputSchema
>;

const AnalysisCriterionSchema = z.object({
    parameterName: z.string().describe("O nome do parâmetro avaliado."),
    analysis: z.string().describe("Análise qualitativa do parâmetro."),
    score: z.number().min(0).max(10).describe("Pontuação de 0 (Baixo Potencial) a 10 (Alto Potencial)."),
    suggestions: z.string().optional().describe("Sugestões de melhoria se a pontuação for 7 ou menos."),
});
export type AnalysisCriterion = z.infer<typeof AnalysisCriterionSchema>;

const AnalysisModuleSchema = z.object({
    moduleName: z.string().describe("O nome do módulo de análise (Recepção ou Espectatorialidade)."),
    criteria: z.array(AnalysisCriterionSchema).length(4).describe("Uma lista com a análise dos 4 parâmetros do módulo."),
});

const AnalyzeReceptionAndEngagementOutputSchema = z.object({
  receptionAnalysis: AnalysisModuleSchema,
  spectatorshipAnalysis: AnalysisModuleSchema,
  strategicSummary: z.string().describe("Um resumo estratégico que indica a maior força de conexão do roteiro e a área com maior oportunidade de aprimoramento."),
});
export type AnalyzeReceptionAndEngagementOutput = z.infer<
  typeof AnalyzeReceptionAndEngagementOutputSchema
>;

const AnalysisOnlySchema = z.object({
    receptionAnalysis: AnalysisModuleSchema.omit({ criteria: { suggestions: true } }),
    spectatorshipAnalysis: AnalysisModuleSchema.omit({ criteria: { suggestions: true } }),
    strategicSummary: z.string(),
}).deepPartial().extend({
    receptionAnalysis: z.object({
        moduleName: z.string(),
        criteria: z.array(AnalysisCriterionSchema.omit({ suggestions: true })).length(4)
    }),
    spectatorshipAnalysis: z.object({
        moduleName: z.string(),
        criteria: z.array(AnalysisCriterionSchema.omit({ suggestions: true })).length(4)
    }),
    strategicSummary: z.string(),
});

const SuggestionsOnlySchema = z.object({
    receptionSuggestions: z.array(z.string().optional()).describe('Lista de sugestões para os critérios de Recepção com nota <= 7.'),
    spectatorshipSuggestions: z.array(z.string().optional()).describe('Lista de sugestões para os critérios de Espectatorialidade com nota <= 7.'),
});


export async function analyzeReceptionAndEngagement(
  input: AnalyzeReceptionAndEngagementInput
): Promise<AnalyzeReceptionAndEngagementOutput> {
  return analyzeReceptionAndEngagementFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeReceptionAnalysisPrompt',
  input: {schema: AnalyzeReceptionAndEngagementInputSchema},
  output: {schema: AnalysisOnlySchema},
  config: { temperature: 0.2 },
  prompt: `Você é uma IA especialista em estudos de recepção e análise de audiência. Sua tarefa é realizar uma "Análise Preditiva de Recepção e Engajamento Espectatorial". Sua análise não deve julgar a "qualidade" do roteiro, mas sim diagnosticar os mecanismos que ele utiliza para se comunicar. Responda inteiramente em português e **NÃO GERE SUGESTÕES**.

**Sua Tarefa:**
Para o roteiro fornecido, preencha os dois módulos de análise a seguir. Para cada um dos 8 parâmetros, forneça uma análise qualitativa e uma pontuação de 0 (Baixo Potencial) a 10 (Alto Potencial). Por fim, escreva um resumo estratégico.

---

**Módulo 1: Análise de Recepção (Como a história será interpretada?)**
(Preencha o objeto 'receptionAnalysis')

1.  **Clareza vs. Ambiguidade Temática:** O tema central é unívoco ou convida a múltiplas interpretações?
2.  **Pontos de Conexão Cultural:** O roteiro usa elementos que ressoam com o repertório cultural do público-alvo?
3.  **Potencial de Leitura Aberrante:** Elementos podem ser facilmente mal interpretados por diferentes públicos?
4.  **Capital Social e Potencial de Debate:** A história levanta questões que engajam o público em discussões?

---

**Módulo 2: Análise de Espectatorialidade (Como a história será sentida?)**
(Preencha o objeto 'spectatorshipAnalysis')

1.  **Mapeamento de Identificação:** Qual personagem é a principal âncora emocional?
2.  **Análise da "Sutura" Narrativa:** O fluxo de cenas é coeso e imersivo, ou existem quebras?
3.  **Curva de Tensão e Catarse:** O roteiro manipula eficazmente suspense e surpresa para gerar catarse?
4.  **Análise do "Gaze" (O Olhar):** Qual perspectiva domina a narrativa e como os personagens são enquadrados?

---

**Resumo Estratégico**
(Preencha o campo 'strategicSummary')
Indique a maior força de conexão do roteiro e a área com maior oportunidade de aprimoramento.

---

**Roteiro para Análise:**
{{{scriptContent}}}
`,
});

const suggestionsPrompt = ai.definePrompt({
    name: 'generateReceptionSuggestionsPrompt',
    input: { schema: AnalysisOnlySchema },
    output: { schema: SuggestionsOnlySchema },
    config: { temperature: 0.8 },
    prompt: `Você é um roteirista criativo. Com base na análise técnica de Recepção e Espectatorialidade, gere sugestões de melhoria criativas e acionáveis para cada critério com nota igual ou inferior a 7.

**Regra para Sugestões:**
Seja específico. Use elementos do roteiro para propor soluções.
- **Exemplo Ruim:** "Aumente a conexão cultural."
- **Exemplo Bom:** "Para fortalecer a conexão cultural, considere adicionar referências musicais ou gírias da Geração Z na cena do bar, o que aproximaria o diálogo do público-alvo definido."

**Análise Técnica para Referência:**
\`\`\`json
{{{json this}}}
\`\`\`

Para 'receptionSuggestions' e 'spectatorshipSuggestions', gere uma sugestão para cada critério com nota menor ou igual a 7. Mantenha a ordem dos critérios. Se a nota for maior que 7, a sugestão deve ser uma string vazia ou nula.`
});


const analyzeReceptionAndEngagementFlow = ai.defineFlow(
  {
    name: 'analyzeReceptionAndEngagementFlow',
    inputSchema: AnalyzeReceptionAndEngagementInputSchema,
    outputSchema: AnalyzeReceptionAndEngagementOutputSchema,
  },
  async input => {
    const { output: analysis } = await analysisPrompt(input);
    if (!analysis) {
      throw new Error("A análise de recepção (fase 1) não retornou um resultado válido.");
    }
    
    const { output: suggestions } = await suggestionsPrompt(analysis);
    if (!suggestions) {
        throw new Error("A geração de sugestões (fase 2) falhou.");
    }

    const finalResult: AnalyzeReceptionAndEngagementOutput = {
      strategicSummary: analysis.strategicSummary,
      receptionAnalysis: {
        ...analysis.receptionAnalysis,
        criteria: analysis.receptionAnalysis.criteria.map((criterion, index) => ({
            ...criterion,
            suggestions: suggestions.receptionSuggestions?.[index] || undefined,
        })),
      },
      spectatorshipAnalysis: {
        ...analysis.spectatorshipAnalysis,
        criteria: analysis.spectatorshipAnalysis.criteria.map((criterion, index) => ({
            ...criterion,
            suggestions: suggestions.spectatorshipSuggestions?.[index] || undefined,
        })),
      },
    };

    return finalResult;
  }
);
