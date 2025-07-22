
'use server';

/**
 * @fileOverview Realiza uma análise de Proposta de Valor (High Concept) de um projeto.
 *
 * - analyzeScriptHighConcept - Inicia a análise.
 * - AnalyzeScriptHighConceptInput - O tipo de entrada para a função.
 * - AnalyzeScriptHighConceptOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptHighConceptInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeScriptHighConceptInput = z.infer<
  typeof AnalyzeScriptHighConceptInputSchema
>;

const PillarAnalysisSchema = z.object({
    analysis: z.string().describe("Análise qualitativa do pilar."),
    score: z.number().min(1).max(5).describe("Pontuação de 1 (Muito Fraco) a 5 (Excelente)."),
});

const AnalyzeScriptHighConceptOutputSchema = z.object({
  theBook: PillarAnalysisSchema.describe('Análise do pilar "The Book" (O Enredo Central).'),
  theHook: PillarAnalysisSchema.describe('Análise do pilar "The Hook" (O Gancho).'),
  theLook: PillarAnalysisSchema.describe('Análise do pilar "The Look" (A Estética).'),
  overallScore: z.number().min(1).max(5).describe("A pontuação geral do High Concept (média das três notas)."),
  strategicRecommendations: z.string().describe("Diagnóstico geral com recomendações estratégicas para fortalecer o conceito."),
});
export type AnalyzeScriptHighConceptOutput = z.infer<
  typeof AnalyzeScriptHighConceptOutputSchema
>;

export async function analyzeScriptHighConcept(
  input: AnalyzeScriptHighConceptInput
): Promise<AnalyzeScriptHighConceptOutput> {
  return analyzeScriptHighConceptFlow(input);
}

const analyzeScriptHighConceptPrompt = ai.definePrompt({
  name: 'analyzeScriptHighConceptPrompt',
  input: {schema: AnalyzeScriptHighConceptInputSchema},
  output: {schema: AnalyzeScriptHighConceptOutputSchema},
  prompt: `Você é um executivo de estúdio de cinema, especialista em analisar o potencial de mercado de novos projetos. Sua tarefa é realizar uma Análise de Proposta de Valor (High Concept) do roteiro fornecido, avaliando os três pilares: "The Book", "The Hook" e "The Look". Responda inteiramente em português.

**Sua Tarefa:**

1.  **Analise cada um dos 3 pilares:** Forneça uma análise qualitativa e uma pontuação de 1 (Muito Fraco) a 5 (Excelente) para cada pilar.
2.  **Calcule a Média:** Calcule a pontuação média dos três pilares.
3.  **Escreva o Diagnóstico Final:** Forneça um diagnóstico geral consolidado com recomendações estratégicas para fortalecer o conceito, especialmente se um dos pilares estiver fraco.

---

**Pilar 1: Análise de "The Book" (O Enredo Central)**
Avalie a força da premissa central. A história pode ser explicada em poucas linhas e, ainda assim, gerar curiosidade? O conceito é claro, original e cativante? O conflito principal que move a trama é forte e bem definido? Responda à pergunta: **A premissa da história é forte o suficiente para sustentar o interesse do público do início ao fim?**

**Pilar 2: Análise de "The Hook" (O Gancho)**
Avalie o elemento de atração principal que prenderá a atenção imediata do público. Identifique qual é o gancho mais poderoso: uma tagline impactante, um mistério intrigante, a presença de um arquétipo forte, uma reviravolta chocante, ou um tema que está em alta na cultura pop? Responda à pergunta: **Qual é a "arma secreta" de marketing deste projeto e quão eficaz ela é para torná-lo memorável e desejável?**

**Pilar 3: Análise de "The Look" (A Estética)**
Avalie o potencial visual e o estilo estético do projeto. Com base no roteiro, qual identidade visual a história sugere? (Ex: "Paleta de cores sombrias", "Cenários grandiosos", "Estilo documental"). O visual contribui para criar uma conexão inicial com o espectador? Responda à pergunta: **A proposta visual do projeto é marcante e ajuda a definir sua identidade no mercado?**

---

**Roteiro para Análise:**
{{{scriptContent}}}
`,
});

const analyzeScriptHighConceptFlow = ai.defineFlow(
  {
    name: 'analyzeScriptHighConceptFlow',
    inputSchema: AnalyzeScriptHighConceptInputSchema,
    outputSchema: AnalyzeScriptHighConceptOutputSchema,
  },
  async input => {
    const {output} = await analyzeScriptHighConceptPrompt(input);
    
    if (!output) {
      throw new Error("A análise de High Concept não retornou um resultado válido.");
    }
    
    // Recalcular a média para garantir precisão.
    const calculatedAverage = (output.theBook.score + output.theHook.score + output.theLook.score) / 3;
    output.overallScore = parseFloat(calculatedAverage.toFixed(2));

    return output;
  }
);
