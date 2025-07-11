
'use server';

/**
 * @fileOverview Este arquivo define um fluxo Genkit para analisar a representação da diversidade em um roteiro
 * usando os testes de Bechdel, Vito Russo e DuVernay.
 *
 * - analyzeScriptRepresentation - Uma função que inicia o fluxo de análise de representação do roteiro.
 * - AnalyzeScriptRepresentationInput - O tipo de entrada para a função analyzeScriptRepresentation.
 * - AnalyzeScriptRepresentationOutput - O tipo de retorno para a função analyzeScriptRepresentation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptRepresentationInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeScriptRepresentationInput = z.infer<
  typeof AnalyzeScriptRepresentationInputSchema
>;

const CriterionResultSchema = z.object({
  criterion: z.string().describe('A descrição do critério avaliado.'),
  passed: z.boolean().describe('Se o critério foi atendido.'),
  reasoning: z
    .string()
    .describe(
      'A justificativa da IA, explicando por que o critério foi ou não atendido, com exemplos do roteiro.'
    ),
});

const TestResultSchema = z.object({
  testName: z.string().describe('O nome do teste (ex: "Teste de Bechdel").'),
  summary: z.string().describe('Um resumo da análise geral para este teste.'),
  criteria: z.array(CriterionResultSchema).describe('A lista de critérios avaliados para o teste.'),
});

const AnalyzeScriptRepresentationOutputSchema = z.object({
  bechdelTest: TestResultSchema,
  vitoRussoTest: TestResultSchema,
  duVernayTest: TestResultSchema,
});
export type AnalyzeScriptRepresentationOutput = z.infer<
  typeof AnalyzeScriptRepresentationOutputSchema
>;

export async function analyzeScriptRepresentation(
  input: AnalyzeScriptRepresentationInput
): Promise<AnalyzeScriptRepresentationOutput> {
  return analyzeScriptRepresentationFlow(input);
}

const analyzeScriptRepresentationPrompt = ai.definePrompt({
  name: 'analyzeScriptRepresentationPrompt',
  input: {schema: AnalyzeScriptRepresentationInputSchema},
  output: {schema: AnalyzeScriptRepresentationOutputSchema},
  prompt: `Você é uma IA especialista em análise de roteiros com foco em diversidade e representatividade. Analise o roteiro fornecido com base nos testes de Bechdel, Vito Russo e DuVernay. Responda inteiramente em português.

**Sua Tarefa:**
Para cada um dos três testes (Bechdel, Vito Russo, DuVernay), você deve:
1.  Avaliar cada um de seus critérios individualmente.
2.  Para cada critério, preencher os campos 'criterion', 'passed' (true/false) e 'reasoning'. A justificativa deve ser clara, concisa e baseada em evidências do roteiro.
3.  Escrever um 'summary' geral para cada teste, consolidando os resultados.

**Definições dos Testes e Critérios:**

*   **Teste de Bechdel (Representatividade Feminina):**
    *   **Critério 1:** A obra tem pelo menos duas mulheres com nomes?
    *   **Critério 2:** Elas conversam uma com a outra?
    *   **Critério 3:** O assunto dessa conversa não é sobre um homem?

*   **Teste de Vito Russo (Representatividade LGBTQIA+):**
    *   **Critério 1:** Contém um personagem identificável como LGBTQIA+?
    *   **Critério 2:** Este personagem não é definido apenas por sua identidade, possuindo outras dimensões?
    *   **Critério 3:** Sua remoção impactaria a trama significativamente?

*   **Teste de DuVernay (Representatividade Racial):**
    *   **Critério 1:** A obra tem pelo menos dois personagens não-brancos com nome?
    *   **Critério 2:** Esses personagens têm arcos próprios que não servem apenas à história de um personagem branco?
    *   **Critério 3:** Eles conversam entre si sobre algo não relacionado a um personagem branco?

Analise o roteiro a seguir e preencha a estrutura de saída de forma completa e detalhada.

Roteiro:
{{{scriptContent}}}`,
});

const analyzeScriptRepresentationFlow = ai.defineFlow(
  {
    name: 'analyzeScriptRepresentationFlow',
    inputSchema: AnalyzeScriptRepresentationInputSchema,
    outputSchema: AnalyzeScriptRepresentationOutputSchema,
  },
  async input => {
    const {output} = await analyzeScriptRepresentationPrompt(input);
    return output!;
  }
);
