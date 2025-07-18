
'use server';

/**
 * @fileOverview Gera uma persona de público-alvo com base na descrição do usuário.
 *
 * - generateAudiencePersona - Gera uma persona detalhada.
 * - GenerateAudiencePersonaInput - O tipo de entrada para a função.
 * - GenerateAudiencePersonaOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAudiencePersonaInputSchema = z.object({
  audienceDescription: z.string().describe('A descrição do público-alvo fornecida pelo usuário.'),
});
export type GenerateAudiencePersonaInput = z.infer<
  typeof GenerateAudiencePersonaInputSchema
>;

const GenerateAudiencePersonaOutputSchema = z.object({
  audienceDescription: z.string().describe('A descrição original do público para referência futura.'),
  name: z.string().describe('Um nome fictício e crível para a persona (ex: "Sofia, a Cinéfila Analítica").'),
  description: z.string().describe('Uma descrição detalhada da persona, incluindo dados demográficos, estilo de vida, profissão e gostos gerais.'),
  behavior: z.string().describe('Como a persona descobre, escolhe, assiste e interage com filmes e séries (plataformas, frequência, influências).'),
  obstacles: z.string().describe('Os principais desafios que a persona enfrenta ao consumir conteúdo (falta de tempo, excesso de opções, etc.).'),
  expectations: z.string().describe('O que a persona busca em uma história (entretenimento, emoção, reflexão, escapismo, etc.).'),
});
export type GenerateAudiencePersonaOutput = z.infer<
  typeof GenerateAudiencePersonaOutputSchema
>;

export async function generateAudiencePersona(
  input: GenerateAudiencePersonaInput
): Promise<GenerateAudiencePersonaOutput> {
  return generateAudiencePersonaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAudiencePersonaPrompt',
  input: {schema: GenerateAudiencePersonaInputSchema},
  output: {schema: GenerateAudiencePersonaOutputSchema},
  prompt: `Você é um especialista em marketing de entretenimento e criação de personas. Sua tarefa é criar uma persona detalhada e realista com base na descrição do público-alvo fornecida por um roteirista. Responda inteiramente em português.

**Descrição do Público-Alvo Fornecida:**
{{{audienceDescription}}}

**Instruções para Criação da Persona:**

1.  **audienceDescription**: Repita a descrição original do público-alvo fornecida pelo usuário.
2.  **Nome e Descrição (name, description)**: Dê um nome fictício e memorável para a persona. Crie uma descrição detalhada que vá além do óbvio, incluindo informações demográficas (idade, local), estilo de vida, preferências de entretenimento, e como o cinema/séries se encaixam em sua rotina.
3.  **Comportamento (behavior)**: Descreva os hábitos de consumo de mídia da persona. Como ela descobre novos filmes? Quais plataformas prefere? Assiste sozinha ou acompanhada? Comenta sobre o que assiste nas redes sociais? Lê críticas?
4.  **Obstáculos (obstacles)**: Identifique as barreiras que dificultam o consumo de conteúdo para essa persona. É a falta de tempo, a fadiga de decisão ("paradoxo da escolha"), o custo, ou a dificuldade em encontrar algo que realmente a agrade?
5.  **Expectativas (expectations)**: Descreva o que a persona fundamentalmente busca ao assistir a uma obra. É puro entretenimento e escapismo? É uma conexão emocional profunda? É um desafio intelectual? Ela quer aprender algo novo ou se sentir representada?

Seja criativo e construa uma persona que pareça uma pessoa real, com complexidades e nuances. Isso ajudará o roteirista a entender melhor para quem ele está escrevendo.`,
});

const generateAudiencePersonaFlow = ai.defineFlow(
  {
    name: 'generateAudiencePersonaFlow',
    inputSchema: GenerateAudiencePersonaInputSchema,
    outputSchema: GenerateAudiencePersonaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
