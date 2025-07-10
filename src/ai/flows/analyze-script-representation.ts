
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

const AnalyzeScriptRepresentationOutputSchema = z.object({
  bechdelTest: z.object({
    passed: z.boolean().describe('Se o roteiro passa no teste de Bechdel.'),
    reason: z
      .string()
      .describe('A razão em português para passar ou falhar no teste de Bechdel.'),
  }),
  vitoRussoTest: z.object({
    passed: z
      .boolean()
      .describe('Se o roteiro passa no teste de Vito Russo.'),
    reason: z
      .string()
      .describe('A razão em português para passar ou falhar no teste de Vito Russo.'),
  }),
  duVernayTest: z.object({
    passed: z
      .boolean()
      .describe('Se o roteiro passa no teste de DuVernay.'),
    reason: z
      .string()
      .describe('A razão em português para passar ou falhar no teste de DuVernay.'),
  }),
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
  prompt: `Você é uma IA assistente que analisa roteiros de cinema em busca de diversidade e representatividade, utilizando os testes de Bechdel, Vito Russo e DuVernay.

Teste de Bechdel: Um roteiro é aprovado se inclui pelo menos duas personagens femininas nomeadas que têm pelo menos uma conversa entre si sobre algo que não seja um homem.
Teste de Vito Russo: Um roteiro é aprovado se contém pelo menos um personagem que seja identificavelmente lésbica, gay, bissexual e/ou transgênero, o personagem não é única ou predominantemente definido por sua orientação sexual ou identidade de gênero, e o personagem é essencial para a trama, de modo que sua remoção teria um efeito significativo.
Teste de DuVernay: Um roteiro é aprovado se os personagens principais são pessoas não-brancas e se suas histórias subvertem os estereótipos clássicos do cinema.

Analise o roteiro a seguir e determine se ele passa em cada um dos testes. Explique o porquê, em português, no campo "reason".

Roteiro: {{{scriptContent}}}`,
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
