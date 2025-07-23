
'use server';
/**
 * @fileOverview Analisa um roteiro para identificar os passos da Jornada do Herói, a estrutura de 3 atos e visualizar a intensidade dramática.
 *
 * - analyzeScriptHeroJourney - Uma função que lida com o processo de análise de roteiro.
 * - AnalyzeScriptHeroJourneyInput - O tipo de entrada para a função analyzeScriptHeroJourney.
 * - AnalyzeScriptHeroJourneyOutput - O tipo de retorno para a função analyzeScriptHeroJourney.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptHeroJourneyInputSchema = z.object({
  script: z.string().describe('O roteiro do filme a ser analisado.'),
});
export type AnalyzeScriptHeroJourneyInput = z.infer<
  typeof AnalyzeScriptHeroJourneyInputSchema
>;

const HeroJourneyStepSchema = z.object({
  stepName: z.string().describe('O nome do passo da jornada do herói.'),
  analysis: z.string().describe('A análise de como este passo se manifesta no roteiro ou uma explicação sobre sua ausência e o impacto disso.'),
  score: z.number().min(0).max(10).describe('Uma pontuação de 0 a 10 para a presença e eficácia deste passo (0 se ausente).'),
  suggestions: z.string().optional().describe('Sugestões de melhoria se a pontuação for 7 ou menos.'),
  intensity: z.number().min(0).max(100).describe('A intensidade dramática neste ponto da história (0-100).'),
});
export type HeroJourneyStep = z.infer<typeof HeroJourneyStepSchema>;

const ThreeActStructureSchema = z.object({
    actOne: z.string().describe('Análise do Primeiro Ato (Apresentação).'),
    actTwo: z.string().describe('Análise do Segundo Ato (Confronto).'),
    actThree: z.string().describe('Análise do Terceiro Ato (Resolução).'),
});

const AnalyzeScriptHeroJourneyOutputSchema = z.object({
  overallAnalysis: z.object({
    summary: z.string().describe('Um resumo geral da análise dramatúrgica da jornada do herói no roteiro.'),
    score: z.number().min(1).max(10).describe('Uma nota geral de 1 a 10 para a aplicação da jornada do herói.'),
    suggestions: z.string().optional().describe('Sugestões de melhoria se a nota geral for 7 ou menos.'),
  }),
  identifiedSteps: z.array(HeroJourneyStepSchema).describe('Uma lista com a análise dos 12 passos da Jornada do Herói, na ordem teórica.'),
  threeActAnalysis: ThreeActStructureSchema.describe('Análise da estrutura de três atos do roteiro.')
});
export type AnalyzeScriptHeroJourneyOutput = z.infer<
  typeof AnalyzeScriptHeroJourneyOutputSchema
>;

const AnalysisOnlySchema = AnalyzeScriptHeroJourneyOutputSchema.deepPartial().extend({
    overallAnalysis: z.object({
        summary: z.string(),
        score: z.number().min(1).max(10),
    }),
    identifiedSteps: z.array(HeroJourneyStepSchema.omit({ suggestions: true })),
    threeActAnalysis: ThreeActStructureSchema,
});

const SuggestionsOnlySchema = z.object({
    overallAnalysis: z.string().optional().describe('Sugestão para a análise geral, se a nota for <= 7.'),
    stepSuggestions: z.array(z.string().optional()).describe('Uma lista de sugestões para cada passo, correspondendo à ordem dos passos. Será preenchida apenas se a nota do passo for <= 7.')
});


export async function analyzeScriptHeroJourney(
  input: AnalyzeScriptHeroJourneyInput
): Promise<AnalyzeScriptHeroJourneyOutput> {
  return analyzeScriptHeroJourneyFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeHeroJourneyAnalysisPrompt',
  input: {schema: AnalyzeScriptHeroJourneyInputSchema},
  output: {schema: AnalysisOnlySchema},
  config: { temperature: 0.2 },
  prompt: `Você é um dramaturgo e consultor de roteiros especialista na Jornada do Herói. Sua análise deve ser técnica e direta. **NÃO GERE SUGESTÕES DE MELHORIA**. Apenas analise e pontue. Responda inteiramente em português.

**Princípios da Análise:**
1.  **Análise Completa:** Analise o roteiro em busca de **TODOS os 12 passos** da Jornada do Herói.
2.  **Identificação e Avaliação:** Se um passo for identificado, descreva como ele se manifesta e avalie sua eficácia. Se um passo **não for encontrado**, explique a ausência e o impacto narrativo disso. Atribua uma pontuação de 0 se o passo estiver ausente.
3.  **Avaliação Exigente:** Seja rigoroso nas pontuações.

**Tarefas de Análise (SEM SUGESTÕES):**
1.  **Análise Geral (overallAnalysis):**
    *   'summary': Escreva um resumo crítico sobre como a Jornada do Herói é utilizada.
    *   'score': Atribua uma nota geral de 1 a 10.
2.  **Passos da Jornada (identifiedSteps):**
    *   Liste **TODOS os 12 passos** na ordem teórica.
    *   Para cada passo, forneça: 'stepName', 'analysis', 'score' (0-10), 'intensity' (0-100).
3.  **Estrutura de 3 Atos (threeActAnalysis):**
    *   Forneça uma análise crítica e concisa de cada ato.

**Os 12 Passos para Analisar:**
1. Mundo Comum, 2. O Chamado à Aventura, 3. Recusa do Chamado, 4. Encontro com o Mentor, 5. A Travessia do Primeiro Limiar, 6. Provas, Aliados e Inimigos, 7. Aproximação da Caverna Oculta, 8. A Provação, 9. A Recompensa, 10. O Caminho de Volta, 11. A Ressurreição, 12. O Retorno com o Elixir

**Roteiro para Análise:**
{{{script}}}
`,
});

const suggestionsPrompt = ai.definePrompt({
    name: 'generateHeroJourneySuggestionsPrompt',
    input: { schema: AnalysisOnlySchema },
    output: { schema: SuggestionsOnlySchema },
    config: { temperature: 0.9 },
    prompt: `Você é um roteirista criativo e um "script doctor". Com base na análise técnica da Jornada do Herói fornecida, sua tarefa é gerar **sugestões criativas e contextualizadas** para cada critério com nota igual ou inferior a 7.

**Regra de Ouro:** Suas sugestões devem ser específicas e acionáveis, usando elementos do próprio roteiro.
- **Exemplo Ruim:** "Torne o chamado à aventura mais forte."
- **Exemplo Bom:** "O chamado à aventura poderia ser mais impactante se o protagonista perdesse seu emprego *como consequência direta* da oferta misteriosa, forçando-o a aceitar o desafio."

**Análise Técnica para Referência:**
\`\`\`json
{{{json this}}}
\`\`\`

Gere uma sugestão para 'overallAnalysis' se a nota geral for menor ou igual a 7. Para 'stepSuggestions', gere uma sugestão para cada um dos 12 passos cuja nota seja menor ou igual a 7. Mantenha a ordem dos passos. Se a nota for maior que 7, deixe a sugestão como uma string vazia ("").`
});


const analyzeScriptHeroJourneyFlow = ai.defineFlow(
  {
    name: 'analyzeScriptHeroJourneyFlow',
    inputSchema: AnalyzeScriptHeroJourneyInputSchema,
    outputSchema: AnalyzeScriptHeroJourneyOutputSchema,
  },
  async input => {
    // 1. Análise técnica
    const { output: analysis } = await analysisPrompt(input);
    if (!analysis) {
        throw new Error("A fase de análise técnica da Jornada do Herói falhou.");
    }

    // 2. Geração de sugestões
    const { output: suggestions } = await suggestionsPrompt(analysis);
    if (!suggestions) {
        throw new Error("A fase de geração de sugestões da Jornada do Herói falhou.");
    }
    
    // 3. Combinar resultados
    const finalResult: AnalyzeScriptHeroJourneyOutput = {
      overallAnalysis: {
        ...analysis.overallAnalysis,
        suggestions: suggestions.overallAnalysis,
      },
      threeActAnalysis: analysis.threeActAnalysis,
      identifiedSteps: analysis.identifiedSteps.map((step, index) => ({
        ...step,
        suggestions: suggestions.stepSuggestions?.[index] || undefined,
      })),
    };

    return finalResult;
  }
);
