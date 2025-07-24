
'use server';

/**
 * @fileOverview Analisa um roteiro usando o "Checklist de Tchekhov" para garantir que cada elemento narrativo tenha um propósito dramático claro.
 *
 * - analyzeScriptTchekhov - Inicia a análise do roteiro.
 * - AnalyzeScriptTchekhovInput - O tipo de entrada para a função.
 * - AnalyzeScriptTchekhovOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptTchekhovInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeScriptTchekhovInput = z.infer<
  typeof AnalyzeScriptTchekhovInputSchema
>;

const TchekhovCriterionSchema = z.object({
    criterionName: z.string().describe("O nome do critério do checklist de Tchekhov."),
    analysis: z.string().describe("Análise qualitativa sobre se o roteiro cumpre o critério."),
    examples: z.string().describe("Exemplos específicos do roteiro (diálogos, cenas ou ações) que justificam a análise."),
    score: z.number().min(0).max(10).describe("Pontuação de 0 (muito fraco) a 10 (excelente) para o critério."),
    suggestions: z.string().optional().describe("Sugestões de melhoria se a pontuação for 7 ou menos."),
});
export type TchekhovCriterion = z.infer<typeof TchekhovCriterionSchema>;

const AnalyzeScriptTchekhovOutputSchema = z.object({
  criteria: z.array(TchekhovCriterionSchema).length(8).describe("Uma lista com a análise dos 8 pontos do Checklist de Tchekhov, na ordem correta."),
  overallSummary: z.string().describe("Um resumo geral que consolida a análise, destaca la pontuação média e sugere os próximos passos."),
  averageScore: z.number().min(0).max(10).describe("A pontuação média de todos os 8 critérios."),
});
export type AnalyzeScriptTchekhovOutput = z.infer<
  typeof AnalyzeScriptTchekhovOutputSchema
>;

const AnalysisOnlySchema = z.object({
    criteria: z.array(TchekhovCriterionSchema.omit({ suggestions: true })).length(8),
    overallSummary: z.string(),
    averageScore: z.number().min(0).max(10),
});

const SuggestionsOnlySchema = z.object({
    criteriaSuggestions: z.array(z.string().optional()).describe('Uma lista de sugestões para cada critério, correspondendo à ordem. Será preenchida apenas se a nota do critério for <= 7.')
});


export async function analyzeScriptTchekhov(
  input: AnalyzeScriptTchekhovInput
): Promise<AnalyzeScriptTchekhovOutput> {
  return analyzeScriptTchekhovFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeTchekhovAnalysisPrompt',
  input: {schema: AnalyzeScriptTchekhovInputSchema},
  output: {schema: AnalysisOnlySchema},
  config: { temperature: 0.2 },
  prompt: `Você é um dramaturgo especialista e analista de roteiros. Sua tarefa é avaliar o roteiro fornecido usando o "Checklist de Tchekhov". Sua análise deve ser objetiva, técnica e **NÃO gerar sugestões de melhoria**. Responda inteiramente em português.

**Sua Tarefa:**
Avalie o roteiro em CADA UM dos 8 pontos do checklist a seguir. Para cada ponto, forneça:
a) 'analysis': Uma análise qualitativa que explique se o critério é cumprido.
b) 'examples': Exemplos específicos do roteiro que justifiquem sua análise.
c) 'score': Uma pontuação rigorosa de 0 (muito fraco) a 10 (excelente).

**Os 8 Pontos do Checklist de Tchekhov:**

1.  **Acontecimento Desestabilizador:** O roteiro apresenta um evento claro, forte e bem posicionado que quebra o equilíbrio inicial do protagonista e serve como catalisador da trama?
2.  **Pressão e Reação:** A reação do protagonista à pressão inicial é dramática, psicologicamente coerente e revela suas motivações, desejos e fraquezas?
3.  **Impacto na Vida do Personagem:** As consequências dos eventos são claras e afetam o personagem de maneira significativa (psicológica, social, material), impulsionando sua transformação?
4.  **Momento da Ideia-Chave:** Existe um momento em que as conexões da trama se unem para revelar o tema central da história de forma satisfatória para o público?
5.  **Conflito e Perspectiva:** O conflito principal é desafiador, evita soluções previsíveis e força o personagem (e o público) a considerar novas perspectivas sobre o tema?
6.  **Momento Mais Intenso:** O clímax é emocionalmente impactante e serve como a culminação de todos os arcos narrativos construídos até então, decidindo o destino do protagonista?
7.  **Mudança do Protagonista:** O roteiro demonstra claramente um arco de transformação significativo e evidente no protagonista como resultado direto de sua jornada?
8.  **Mudança na Visão do Público:** Ao final, a história deixa o público com uma nova compreensão, sentimento ou reflexão sobre o tema abordado?

**Instruções Finais:**
- Preencha a lista 'criteria' com exatamente 8 itens, na ordem acima.
- Calcule a média das 8 pontuações e preencha o campo 'averageScore'.
- Escreva um 'overallSummary' que consolide a análise e apresente a pontuação média.

Roteiro para Análise:
{{{scriptContent}}}`,
});

const suggestionsPrompt = ai.definePrompt({
    name: 'generateTchekhovSuggestionsPrompt',
    input: { schema: AnalysisOnlySchema },
    output: { schema: SuggestionsOnlySchema },
    config: { temperature: 0.8 },
    prompt: `Você é um roteirista criativo. Com base na análise técnica do Checklist de Tchekhov, gere sugestões de melhoria criativas e acionáveis para cada critério com nota igual ou inferior a 7.

**Regra para Sugestões:**
Seja específico. Use elementos do roteiro para propor soluções.
- **Exemplo Ruim:** "Melhore o clímax."
- **Exemplo Bom:** "Para tornar o clímax mais intenso, considere fazer o protagonista confrontar não apenas o vilão, mas também sua própria falha que ele tentou evitar durante toda a história."

**Análise Técnica para Referência:**
\`\`\`json
{{{json this}}}
\`\`\`

Para 'criteriaSuggestions', gere uma sugestão para cada um dos 8 critérios cuja nota seja menor ou igual a 7. Mantenha a ordem dos critérios. Se a nota for maior que 7, a sugestão deve ser uma string vazia ou nula.`
});


const analyzeScriptTchekhovFlow = ai.defineFlow(
  {
    name: 'analyzeScriptTchekhovFlow',
    inputSchema: AnalyzeScriptTchekhovInputSchema,
    outputSchema: AnalyzeScriptTchekhovOutputSchema,
  },
  async input => {
    const { output: analysis } = await analysisPrompt(input);
    if (!analysis) {
      throw new Error("A análise de Tchekhov (fase 1) não retornou um resultado válido.");
    }
    
    const { output: suggestions } = await suggestionsPrompt(analysis);
    if (!suggestions) {
        throw new Error("A geração de sugestões de Tchekhov (fase 2) falhou.");
    }

    // Recalcular a média para garantir precisão, caso a IA erre.
    const calculatedAverage = analysis.criteria.reduce((sum, item) => sum + item.score, 0) / analysis.criteria.length;
    analysis.averageScore = parseFloat(calculatedAverage.toFixed(2));

    const finalResult: AnalyzeScriptTchekhovOutput = {
      ...analysis,
      criteria: analysis.criteria.map((criterion, index) => ({
        ...criterion,
        suggestions: suggestions.criteriaSuggestions?.[index] || undefined,
      })),
    };

    return finalResult;
  }
);
