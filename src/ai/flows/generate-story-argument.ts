
'use server';

/**
 * @fileOverview Gera um argumento de história incluindo tema, personagens e estrutura narrativa.
 *
 * - generateStoryArgument - Uma função que gera o argumento da história.
 * - GenerateStoryArgumentInput - O tipo de entrada para a função generateStoryArgument.
 * - GenerateStoryArgumentOutput - O tipo de retorno para a função generateStoryArgument.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryArgumentInputSchema = z.object({
  genre: z.string().describe('O gênero da história.'),
  title: z.string().describe('O título da história.'),
  numberOfActs: z.number().describe('O número desejado de atos na história.'),
});
export type GenerateStoryArgumentInput = z.infer<typeof GenerateStoryArgumentInputSchema>;

const GenerateStoryArgumentOutputSchema = z.object({
  theme: z.string().describe('O tema central da história.'),
  protagonistProfile: z.string().describe('Um perfil detalhado do protagonista.'),
  antagonistProfile: z.string().describe('Um perfil detalhado do antagonista.'),
  narrativeStructure: z.string().describe('Um esboço narrativo estruturado da história.'),
  argument: z.string().describe('Um argumento coeso resumindo a história.'),
});
export type GenerateStoryArgumentOutput = z.infer<typeof GenerateStoryArgumentOutputSchema>;

export async function generateStoryArgument(input: GenerateStoryArgumentInput): Promise<GenerateStoryArgumentOutput> {
  return generateStoryArgumentFlow(input);
}

const generateStoryArgumentPrompt = ai.definePrompt({
  name: 'generateStoryArgumentPrompt',
  input: {schema: GenerateStoryArgumentInputSchema},
  output: {schema: GenerateStoryArgumentOutputSchema},
  prompt: `Você é um roteirista e produtor experiente. Gere um argumento de história abrangente com base nas informações fornecidas. Responda inteiramente em português.

Gênero: {{{genre}}}
Título: {{{title}}}
Número de Atos: {{{numberOfActs}}}

Instruções:
1.  Defina um tema convincente que ressoe com o gênero e o título da história.
2.  Desenvolva perfis detalhados para o protagonista e o antagonista, incluindo suas motivações, histórias de fundo e arcos.
3.  Estruture a narrativa em {{{numberOfActs}}} atos, delineando os principais pontos da trama, conflitos e resoluções.
4.  Compile todos os elementos acima em um argumento coeso e persuasivo que encapsule a essência da história, destacando seu potencial de engajamento do público e sucesso comercial.

A saída deve ser um argumento completo pronto para ser usado em uma apresentação.`,
});

const generateStoryArgumentFlow = ai.defineFlow(
  {
    name: 'generateStoryArgumentFlow',
    inputSchema: GenerateStoryArgumentInputSchema,
    outputSchema: GenerateStoryArgumentOutputSchema,
  },
  async input => {
    const {output} = await generateStoryArgumentPrompt(input);
    return output!;
  }
);
