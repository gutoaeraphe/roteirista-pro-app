
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
  summary: z.string().max(1500).describe('Um resumo objetivo da persona, combinando sua descrição (demografia, estilo de vida), comportamento de consumo de mídia, obstáculos e expectativas em uma narrativa coesa. Máximo de 1500 caracteres.'),
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
  prompt: `Você é um especialista em marketing de entretenimento e criação de personas. Sua tarefa é criar uma persona detalhada, realista e OBJETIVA com base na descrição do público-alvo fornecida. Responda inteiramente em português.

**Descrição do Público-Alvo Fornecida:**
{{{audienceDescription}}}

**Instruções para Criação da Persona:**

1.  **audienceDescription**: Repita a descrição original do público-alvo fornecida pelo usuário.
2.  **name**: Dê um nome fictício e memorável para a persona.
3.  **summary**: Crie um resumo coeso que combine os seguintes pontos em um texto fluido. Seja direto e não exceda 1500 caracteres:
    *   **Descrição:** Informações demográficas (idade, local), estilo de vida, preferências gerais.
    *   **Comportamento:** Como a persona descobre, escolhe e assiste a filmes/séries (plataformas, frequência, influências).
    *   **Obstáculos:** Barreiras que dificultam seu consumo de conteúdo (falta de tempo, excesso de opções, etc.).
    *   **Expectativas:** O que ela fundamentalmente busca em uma história (entretenimento, reflexão, escapismo, etc.).

Construa uma persona que pareça uma pessoa real, com complexidades e nuances.`,
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
