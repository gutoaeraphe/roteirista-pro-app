
'use server';

/**
 * @fileOverview Realiza uma análise de viabilidade técnica e financeira de um roteiro (Conteúdo Mínimo Viável).
 *
 * - analyzeScriptMCV - Inicia a análise de viabilidade.
 * - AnalyzeScriptMCVInput - O tipo de entrada para a função.
 * - AnalyzeScriptMCVOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptMCVInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeScriptMCVInput = z.infer<
  typeof AnalyzeScriptMCVInputSchema
>;

const ViabilityFactorSchema = z.object({
    factorName: z.string().describe("O nome do fator de viabilidade avaliado (Logística, Arte, etc.)."),
    justification: z.string().describe("Justificativa da IA para a pontuação atribuída, com base no roteiro."),
    score: z.number().min(1).max(5).describe("Pontuação de 1 (Baixo Custo/Complexidade) a 5 (Alto Custo/Complexidade)."),
});
export type ViabilityFactor = z.infer<typeof ViabilityFactorSchema>;

const AnalyzeScriptMCVOutputSchema = z.object({
  factors: z.array(ViabilityFactorSchema).length(8).describe("Uma lista com a análise dos 8 fatores de viabilidade, na ordem correta."),
  averageScore: z.number().min(1).max(5).describe("A pontuação média de todos os 8 fatores."),
  strategicRecommendations: z.string().describe("Diagnóstico final com base na média e sugestões de otimização de custo, se a média for alta."),
});
export type AnalyzeScriptMCVOutput = z.infer<
  typeof AnalyzeScriptMCVOutputSchema
>;

export async function analyzeScriptMCV(
  input: AnalyzeScriptMCVInput
): Promise<AnalyzeScriptMCVOutput> {
  return analyzeScriptMCVFlow(input);
}

const analyzeScriptMCVPrompt = ai.definePrompt({
  name: 'analyzeScriptMCVPrompt',
  input: {schema: AnalyzeScriptMCVInputSchema},
  output: {schema: AnalyzeScriptMCVOutputSchema},
  prompt: `Você é um produtor de cinema experiente, especialista em orçamentos e logística de produção. Sua tarefa é realizar uma análise de "Conteúdo Mínimo Viável" (MCV), avaliando a viabilidade técnica e financeira de um roteiro. Responda inteiramente em português.

**Sua Tarefa:**

1.  **Análise dos Fatores (factors):**
    *   Avalie o roteiro em CADA UM dos 8 fatores abaixo.
    *   Para cada fator, atribua uma pontuação de 1 (Baixo Custo/Complexidade) a 5 (Alto Custo/Complexidade).
    *   Forneça uma justificativa concisa para cada pontuação.

2.  **Diagnóstico Final (averageScore e strategicRecommendations):**
    *   Calcule a média de todas as 8 pontuações.
    *   Com base na média, forneça um diagnóstico geral.
    *   Se a média for 4 ou maior, sugira ajustes concretos no roteiro para reduzir custos sem sacrificar a essência da história. Se for menor que 4, apenas comente sobre a viabilidade.

---

**Os 8 Fatores de Viabilidade Técnica e Financeira:**

1.  **Logística:** Analise a quantidade de locações distintas, a necessidade de deslocamentos e a complexidade do transporte de equipe e equipamentos.
2.  **Arte:** Avalie a necessidade de construção de cenários complexos, figurinos de época, maquiagens especiais ou múltiplos adereços de cena.
3.  **Elenco:** Considere o número de personagens com diálogos, a necessidade de atores com habilidades específicas (luta, dança) e a quantidade de figurantes em cenas-chave.
4.  **Pré-produção:** Estime a complexidade do planejamento, incluindo a necessidade de ensaios, scouting de locações e desenvolvimento técnico.
5.  **Equipe:** Avalie a necessidade de uma equipe técnica grande ou com especialistas (ex: coordenador de dublês, consultor de segurança).
6.  **Equipamento:** Identifique a demanda por equipamentos especializados, como drones, gruas, câmeras de alta resolução ou iluminação complexa.
7.  **Pós-produção:** Analise a quantidade de cenas que exigem efeitos visuais (CGI), correção de cor complexa, ou uma trilha sonora original elaborada.
8.  **Lançamento:** Considere a complexidade da estratégia de marketing implícita, como a necessidade de uma grande campanha de divulgação para competir no mercado.

---

**Roteiro para Análise:**
{{{scriptContent}}}
`,
});

const analyzeScriptMCVFlow = ai.defineFlow(
  {
    name: 'analyzeScriptMCVFlow',
    inputSchema: AnalyzeScriptMCVInputSchema,
    outputSchema: AnalyzeScriptMCVOutputSchema,
  },
  async input => {
    const {output} = await analyzeScriptMCVPrompt(input);
    
    if (!output) {
      throw new Error("A análise de viabilidade (MCV) não retornou um resultado válido.");
    }
    
    // Recalcular a média para garantir precisão, caso a IA erre.
    const calculatedAverage = output.factors.reduce((sum, item) => sum + item.score, 0) / output.factors.length;
    output.averageScore = parseFloat(calculatedAverage.toFixed(2));

    return output;
  }
);
