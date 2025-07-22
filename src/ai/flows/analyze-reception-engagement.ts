
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
    score: z.number().min(1).max(5).describe("Pontuação de 1 (Baixo Potencial) a 5 (Alto Potencial)."),
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

export async function analyzeReceptionAndEngagement(
  input: AnalyzeReceptionAndEngagementInput
): Promise<AnalyzeReceptionAndEngagementOutput> {
  return analyzeReceptionAndEngagementFlow(input);
}

const analyzeReceptionAndEngagementPrompt = ai.definePrompt({
  name: 'analyzeReceptionAndEngagementPrompt',
  input: {schema: AnalyzeReceptionAndEngagementInputSchema},
  output: {schema: AnalyzeReceptionAndEngagementOutputSchema},
  prompt: `Você é uma IA especialista em estudos de recepção e análise de audiência no campo do cinema e da dramaturgia. Sua tarefa é realizar uma "Análise Preditiva de Recepção e Engajamento Espectatorial". Sua análise não deve julgar a "qualidade" do roteiro, mas sim diagnosticar os mecanismos que ele utiliza para se comunicar e se conectar com o espectador. Responda inteiramente em português.

**Sua Tarefa:**
Para o roteiro fornecido, preencha os dois módulos de análise a seguir. Para cada um dos 8 parâmetros, forneça uma análise qualitativa e uma pontuação de 1 (Baixo Potencial) a 5 (Alto Potencial). Por fim, escreva um resumo estratégico.

---

**Módulo 1: Análise de Recepção (Como a história será interpretada?)**
(Preencha o objeto 'receptionAnalysis')

1.  **Clareza vs. Ambiguidade Temática:** O tema central é apresentado de forma unívoca ou o roteiro convida a múltiplas interpretações?
2.  **Pontos de Conexão Cultural:** O roteiro utiliza elementos (símbolos, gírias, situações) que ressoam com o repertório cultural do público-alvo definido?
3.  **Potencial de Leitura Aberrante:** Existem elementos na trama ou nos personagens que poderiam ser facilmente mal interpretados por segmentos de público com visões de mundo diferentes?
4.  **Capital Social e Potencial de Debate:** A história levanta questões que podem engajar o público em discussões e debates nas redes sociais, fortalecendo a comunidade de fãs?

---

**Módulo 2: Análise de Espectatorialidade (Como a história será sentida?)**
(Preencha o objeto 'spectatorshipAnalysis')

1.  **Mapeamento de Identificação:** Qual personagem é o principal ponto de ancoragem emocional para o espectador? Que recursos o roteiro usa para construir essa identificação?
2.  **Análise da "Sutura" Narrativa:** O fluxo de cenas e informações é coeso e imersivo, ou existem quebras (ex: exposição forçada) que podem prejudicar o engajamento?
3.  **Curva de Tensão e Catarse:** O roteiro manipula eficazmente o suspense e a surpresa para construir momentos de forte liberação emocional (catarse)?
4.  **Análise do "Gaze" (O Olhar):** Qual perspectiva (gaze) domina a narrativa? Como os personagens, especialmente os femininos ou de grupos minoritários, são enquadrados pelo olhar da história?

---

**Resumo Estratégico**
(Preencha o campo 'strategicSummary')
Indique qual é a maior força do roteiro na conexão com o público e qual área oferece a maior oportunidade de aprimoramento para maximizar o impacto emocional e temático.

---

**Roteiro para Análise:**
{{{scriptContent}}}
`,
});

const analyzeReceptionAndEngagementFlow = ai.defineFlow(
  {
    name: 'analyzeReceptionAndEngagementFlow',
    inputSchema: AnalyzeReceptionAndEngagementInputSchema,
    outputSchema: AnalyzeReceptionAndEngagementOutputSchema,
  },
  async input => {
    const {output} = await analyzeReceptionAndEngagementPrompt(input);
    
    if (!output) {
      throw new Error("A análise de recepção não retornou um resultado válido.");
    }

    return output;
  }
);
