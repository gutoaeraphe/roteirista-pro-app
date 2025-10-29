
'use server';

/**
 * @fileOverview Analisa o roteiro e mapeia os 15 "beats" narrativos essenciais da estrutura de roteiro.
 *
 * - analyzeScriptBeatSheet - Inicia a análise.
 * - AnalyzeScriptBeatSheetInput - O tipo de entrada para a função.
 * - AnalyzeScriptBeatSheetOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptBeatSheetInputSchema = z.object({
  scriptContent: z.string().describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeScriptBeatSheetInput = z.infer<typeof AnalyzeScriptBeatSheetInputSchema>;

const BeatSchema = z.object({
  beatName: z.string().describe('O nome do "beat" narrativo.'),
  pageNumber: z.string().describe('A página ou intervalo de páginas onde o beat ocorre.'),
  analysis: z.string().describe('A análise de como este beat se manifesta no roteiro.'),
});

const AnalyzeScriptBeatSheetOutputSchema = z.object({
  beats: z.array(BeatSchema).length(15).describe('Uma lista com a análise dos 15 beats narrativos.'),
  summary: z.string().describe('Um resumo geral sobre a coesão e eficácia da estrutura de beats do roteiro.'),
});
export type AnalyzeScriptBeatSheetOutput = z.infer<typeof AnalyzeScriptBeatSheetOutputSchema>;


export async function analyzeScriptBeatSheet(
  input: AnalyzeScriptBeatSheetInput
): Promise<AnalyzeScriptBeatSheetOutput> {
  return analyzeScriptBeatSheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptBeatSheetPrompt',
  input: {schema: AnalyzeScriptBeatSheetInputSchema},
  output: {schema: AnalyzeScriptBeatSheetOutputSchema},
  config: { temperature: 0.3 },
  prompt: `Você é um consultor de roteiro especialista em estrutura narrativa. Sua tarefa é analisar o roteiro fornecido e mapear os 15 "beats" narrativos essenciais. Para cada beat, identifique em qual página (ou intervalo de páginas) ele ocorre e forneça uma análise concisa de como o evento se manifesta na história. Ao final, escreva um breve resumo sobre a coesão geral da estrutura. Responda inteiramente em português.

**Os 15 Beats Narrativos:**

1.  **Imagem de Abertura (Pág. 1):** A primeira impressão. Mostra o tom, estilo e o ponto de partida do protagonista.
2.  **Tema Declarado (Pág. 5):** Uma declaração, geralmente feita por um personagem secundário, que aponta para o tema central da história.
3.  **Configuração (Págs. 1-10):** Apresenta o mundo do protagonista, os personagens de apoio e os objetivos iniciais. Mostra o que precisa mudar.
4.  **Catalisador (Pág. 12):** O evento que vira o mundo do protagonista de cabeça para baixo e inicia a jornada.
5.  **Debate (Págs. 12-25):** O protagonista hesita. Ele deve aceitar o desafio? É um momento de dúvida e questionamento.
6.  **Quebra para o Ato 2 (Pág. 25):** O protagonista toma a decisão de agir e entra em um novo mundo ou situação.
7.  **História B (Pág. 30):** Introdução de uma subtrama, geralmente romântica ou de amizade, que ajuda a explorar o tema.
8.  **Diversão e Jogos (Págs. 30-55):** O protagonista explora o novo mundo. É o "trailer do filme", mostrando a premissa em ação.
9.  **Ponto Médio (Pág. 55):** Um grande evento que eleva os riscos. Pode ser uma falsa vitória ou uma falsa derrota, e muda o objetivo do protagonista.
10. **Os Maus se Aproximam (Págs. 55-75):** As forças antagônicas se reorganizam e atacam com mais força, pressionando o herói.
11. **Tudo Está Perdido (Pág. 75):** O ponto mais baixo. O protagonista perde tudo. Parece que não há mais esperança.
12. **Noite Escura da Alma (Págs. 75-85):** O momento de reflexão. O herói digere a derrota e encontra a força interior para continuar.
13. **Quebra para o Ato 3 (Pág. 85):** Com uma nova ideia ou motivação, o protagonista decide agir uma última vez, liderando a batalha final.
14. **Final (Págs. 85-110):** O clímax. O protagonista confronta a força antagônica, aplicando a lição que aprendeu durante a jornada.
15. **Imagem Final (Pág. 110):** A imagem final espelha a imagem de abertura, mostrando a transformação completa do protagonista.

---

**Roteiro para Análise:**
{{{scriptContent}}}
`,
});

const analyzeScriptBeatSheetFlow = ai.defineFlow(
  {
    name: 'analyzeScriptBeatSheetFlow',
    inputSchema: AnalyzeScriptBeatSheetInputSchema,
    outputSchema: AnalyzeScriptBeatSheetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
