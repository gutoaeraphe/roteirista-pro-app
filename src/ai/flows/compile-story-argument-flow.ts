
'use server';

/**
 * @fileOverview Compila todas as informações da criação de uma história em um argumento final.
 *
 * - compileStoryArgument - Uma função que compila os dados em um argumento.
 * - CompileStoryArgumentInput - O tipo de entrada para a função.
 * - CompileStoryArgumentOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompileStoryArgumentInputSchema = z.object({
  storyData: z.string().describe('Uma string JSON com todos os dados da história coletados do usuário.'),
});
type CompileStoryArgumentInput = z.infer<typeof CompileStoryArgumentInputSchema>;

const FinalArgumentSchema = z.object({
  logline: z.string().describe('Uma frase concisa e impactante que resume a essência da história.'),
  synopsis: z.string().describe('Um resumo da trama principal, apresentando os personagens, o conflito e o que está em jogo.'),
  protagonistPresentation: z.string().describe('A apresentação final do protagonista, baseada em seu perfil.'),
  antagonistPresentation: z.string().describe('A apresentação final do antagonista, baseada em seu perfil.'),
  detailedArgument: z.string().describe('Um argumento detalhado em prosa, conectando todos os elementos da história em uma dramaturgia com início, meio e fim.'),
});

const CompileStoryArgumentOutputSchema = z.object({
  finalArgument: FinalArgumentSchema,
});
export type CompileStoryArgumentOutput = z.infer<typeof CompileStoryArgumentOutputSchema>;

export async function compileStoryArgument(input: CompileStoryArgumentInput): Promise<CompileStoryArgumentOutput> {
  return compileStoryArgumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compileStoryArgumentPrompt',
  input: {schema: CompileStoryArgumentInputSchema},
  output: {schema: CompileStoryArgumentOutputSchema},
  prompt: `Você é um roteirista e dramaturgo experiente. Sua tarefa é transformar as informações fornecidas em um documento de argumento coeso e profissional. Responda inteiramente em português e NÃO use asteriscos (*) ou qualquer formatação especial.

**Instruções:**
1.  **Analise o objeto JSON** fornecido, que contém todas as seleções e entradas do usuário.
2.  **Crie uma Logline:** Uma única frase que capture a essência da história.
3.  **Crie uma Sinopse:** Um resumo da trama, apresentando os personagens, o conflito e o que está em jogo.
4.  **Crie Apresentações de Personagens:** Use os perfis de protagonista e antagonista para escrever breves apresentações.
5.  **Escreva o Argumento Detalhado:** Esta é a parte mais importante. Não apenas junte as informações. Em vez disso, **crie uma história de verdade**, uma dramaturgia com início, meio e fim, tecendo todos os elementos (tons, gêneros, conflitos, tema, personagens e detalhes narrativos) em uma narrativa fluida. A estrutura deve ser clara:
    *   **Ato 1 (Início):** Apresente o protagonista em seu mundo normal. Introduza o conflito principal e o incidente que o força a agir, estabelecendo seu objetivo.
    *   **Ato 2 (Meio):** Desenvolva a jornada. Mostre os obstáculos aumentando, os riscos se tornando maiores e o protagonista sendo forçado a confrontar suas fraquezas. O antagonista deve atuar ativamente.
    *   **Ato 3 (Fim):** Leve a história ao clímax, onde o protagonista enfrenta o conflito final. Forneça uma resolução que seja consequência dos eventos e que reflita o tema da história.

---
**Dados da História (JSON):**
{{{storyData}}}
---

Gere o resultado no objeto 'finalArgument', preenchendo todos os seus campos.
`,
});

const compileStoryArgumentFlow = ai.defineFlow(
  {
    name: 'compileStoryArgumentFlow',
    inputSchema: CompileStoryArgumentInputSchema,
    outputSchema: CompileStoryArgumentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
