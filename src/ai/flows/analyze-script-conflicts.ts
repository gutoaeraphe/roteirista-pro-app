
'use server';

/**
 * @fileOverview Realiza um mapeamento detalhado dos conflitos internos e externos do protagonista em um roteiro.
 *
 * - analyzeScriptConflicts - Inicia a análise de conflitos.
 * - AnalyzeScriptConflictsInput - O tipo de entrada para a função.
 * - AnalyzeScriptConflictsOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptConflictsInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeScriptConflictsInput = z.infer<
  typeof AnalyzeScriptConflictsInputSchema
>;

const ConflictItemSchema = z.object({
    sceneOrEvent: z.string().describe("Descrição concisa da cena ou evento onde o conflito ocorre. Ex: 'Cena 15 - A discussão no jantar'."),
    conflictType: z.enum(["Interno", "Externo"]).describe("A categoria principal do conflito."),
    subCategory: z.string().describe("A sub-categoria do conflito, conforme a lista fornecida."),
    descriptionAndFunction: z.string().describe("Descrição da natureza do conflito e sua função na cena ou na trama geral."),
});

const AnalyzeScriptConflictsOutputSchema = z.object({
  mappedConflicts: z.array(ConflictItemSchema).describe("Uma lista de todos os conflitos principais mapeados no roteiro."),
  analyticalSummary: z.string().describe("Um resumo analítico que responde às perguntas sobre o equilíbrio, progressão e oportunidades dos conflitos."),
});
export type AnalyzeScriptConflictsOutput = z.infer<
  typeof AnalyzeScriptConflictsOutputSchema
>;

export async function analyzeScriptConflicts(
  input: AnalyzeScriptConflictsInput
): Promise<AnalyzeScriptConflictsOutput> {
  return analyzeScriptConflictsFlow(input);
}

const analyzeScriptConflictsPrompt = ai.definePrompt({
  name: 'analyzeScriptConflictsPrompt',
  input: {schema: AnalyzeScriptConflictsInputSchema},
  output: {schema: AnalyzeScriptConflictsOutputSchema},
  prompt: `Você é um dramaturgo e analista de roteiro, especialista em estrutura de conflitos. Sua tarefa é realizar um "Mapeamento de Conflitos" detalhado do roteiro fornecido, focando no protagonista. Responda inteiramente em português.

**Sua Tarefa:**

1.  **Mapeie os Conflitos (mappedConflicts):**
    *   Identifique os principais momentos de conflito na narrativa.
    *   Para cada conflito, preencha um objeto com os seguintes campos:
        *   **sceneOrEvent**: Descreva a cena ou evento.
        *   **conflictType**: Categorize como "Interno" ou "Externo".
        *   **subCategory**: Use uma das sub-categorias abaixo.
        *   **descriptionAndFunction**: Descreva a natureza do conflito e sua função na trama.

2.  **Escreva o Resumo Analítico (analyticalSummary):**
    *   Ao final, escreva um parágrafo de análise consolidada, respondendo a estas quatro perguntas:
        1.  Qual é o tipo de conflito predominante na história?
        2.  Existe um bom equilíbrio entre os conflitos internos e externos do protagonista?
        3.  Como a intensidade e a natureza dos conflitos evoluem ao longo dos atos, conduzindo ao clímax?
        4.  Existem oportunidades para intensificar ou adicionar novas camadas de conflito para enriquecer a jornada do personagem?

---

**Sub-categorias para usar:**

*   **Se for CONFLITO INTERNO, use:**
    *   **Personagem vs. Ele Mesmo:** Luta contra medos, culpas, traumas, dilemas morais.

*   **Se for CONFLITO EXTERNO, use uma destas:**
    *   **Personagem vs. Personagem:** Embate direto com outro personagem.
    *   **Personagem vs. Sociedade:** Oposição a normas, leis, preconceitos de um sistema.
    *   **Personagem vs. Natureza:** Luta pela sobrevivência contra forças naturais.
    *   **Personagem vs. Inevitável (Destino):** Luta contra forças superiores como morte, destino, tempo.
    *   **Personagem vs. Máquina:** Confronto com tecnologia, IA, robôs.

---

**Roteiro para Análise:**
{{{scriptContent}}}
`,
});

const analyzeScriptConflictsFlow = ai.defineFlow(
  {
    name: 'analyzeScriptConflictsFlow',
    inputSchema: AnalyzeScriptConflictsInputSchema,
    outputSchema: AnalyzeScriptConflictsOutputSchema,
  },
  async input => {
    const {output} = await analyzeScriptConflictsPrompt(input);
    
    if (!output) {
      throw new Error("O mapeamento de conflitos não retornou um resultado válido.");
    }

    return output;
  }
);
