
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
  detailedArgument: z.string().describe('Um argumento detalhado em prosa, conectando todos os elementos da história.'),
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
  prompt: `Você é um roteirista e produtor experiente. Sua tarefa é compilar todas as informações fornecidas em um único documento de argumento coeso e profissional. Responda inteiramente em português e NÃO use asteriscos (*) ou qualquer formatação especial. A saída deve ser em texto puro para cada campo.

**Instruções:**
1.  Analise o objeto JSON fornecido, que contém todas as seleções e entradas do usuário.
2.  **Crie uma Logline:** Uma frase concisa e impactante que resuma a história.
3.  **Crie uma Sinopse:** Um resumo da trama, apresentando os personagens, o conflito e o que está em jogo.
4.  **Crie Apresentações de Personagens:** Use os campos 'protagonistProfile' e 'antagonistProfile' para escrever breves apresentações dos personagens principais.
5.  **Escreva o Argumento Detalhado:** Com base em TODOS os dados fornecidos (tons, gêneros, conflitos, estilo, universo, tema, personagens, narrativa), escreva um argumento detalhado em prosa. O texto deve fluir como uma história, não como uma lista. Integre organicamente os conceitos em uma narrativa coesa.

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
