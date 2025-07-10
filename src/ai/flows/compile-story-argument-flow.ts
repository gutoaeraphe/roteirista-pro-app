
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

export const CompileStoryArgumentInputSchema = z.object({
  storyData: z.string().describe('Uma string JSON com todos os dados da história coletados do usuário.'),
});
export type CompileStoryArgumentInput = z.infer<typeof CompileStoryArgumentInputSchema>;

export const CompileStoryArgumentOutputSchema = z.object({
    fullArgument: z.string().describe('O documento de argumento completo, incluindo logline, sinopse e o argumento em prosa.'),
});
export type CompileStoryArgumentOutput = z.infer<typeof CompileStoryArgumentOutputSchema>;

export async function compileStoryArgument(input: CompileStoryArgumentInput): Promise<CompileStoryArgumentOutput> {
  return compileStoryArgumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compileStoryArgumentPrompt',
  input: {schema: CompileStoryArgumentInputSchema},
  output: {schema: CompileStoryArgumentOutputSchema},
  prompt: `Você é um roteirista e produtor experiente. Sua tarefa é compilar todas as informações fornecidas em um único documento de argumento coeso e profissional. Responda inteiramente em português.

**Instruções:**
1.  Analise o objeto JSON fornecido, que contém todas as seleções e entradas do usuário.
2.  **Crie uma Logline:** Uma frase concisa e impactante que resuma a história.
3.  **Crie uma Sinopse:** Um resumo da trama, apresentando os personagens, o conflito e o que está em jogo.
4.  **Escreva o Argumento:** Com base em TODOS os dados fornecidos (tons, gêneros, conflitos, estilo, universo, tema, personagens, narrativa), escreva um argumento detalhado em prosa. O texto deve fluir como uma história, não como uma lista de itens. Integre organicamente os conceitos em uma narrativa coesa.

**Formato da Saída:**
O resultado deve ser um único texto contínuo, formatado da seguinte maneira:

**LOGLINE**
[Sua logline aqui]

**SINOPSE**
[Sua sinopse aqui]

**ARGUMENTO**
[Seu argumento detalhado em prosa aqui]

---
**Dados da História (JSON):**
{{{storyData}}}
---
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
