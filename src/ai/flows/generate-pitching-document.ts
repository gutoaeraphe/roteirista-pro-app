
'use server';

/**
 * @fileOverview Um fluxo que cria um documento de vendas profissional para um projeto de filme,
 * agindo como um produtor executivo.
 *
 * - generatePitchingDocument - Uma função que lida com a geração do documento de vendas.
 * - GeneratePitchingDocumentInput - O tipo de entrada para a função generatePitchingDocument.
 * - GeneratePitchingDocumentOutput - O tipo de retorno para a função generatePitchingDocument.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePitchingDocumentInputSchema = z.object({
  scriptContent: z.string().describe('O conteúdo do roteiro do filme.'),
  genre: z.string().describe('O gênero do filme.'),
});

export type GeneratePitchingDocumentInput = z.infer<typeof GeneratePitchingDocumentInputSchema>;

const PitchingDocumentSchema = z.object({
    elevatorPitch: z.string().describe('Um pitch rápido e impactante, de 2 a 3 frases, que resume a essência do projeto para gerar interesse imediato.'),
    logline: z.string().describe('Uma frase concisa e impactante que resume a essência da história.'),
    synopsis: z.string().describe('Um resumo da trama principal, apresentando o protagonista, seu objetivo, o conflito e o que está em jogo.'),
    theme: z.string().describe('A mensagem central e as questões universais que a obra explora.'),
    targetAudience: z.string().describe('Uma descrição do principal grupo de audiência para este filme.'),
    justification: z.string().describe('Uma explicação convincente de por que esta história é relevante e precisa ser contada agora.'),
    mainCharacters: z.string().describe('Breves descrições do protagonista e do antagonista, focando em seus arcos e conflitos.'),
    toneAndStyle: z.string().describe('A atmosfera, o estilo visual e a abordagem narrativa do filme.'),
    storyArc: z.string().describe('Um resumo do desenvolvimento da trama através de seus atos principais.'),
    detailedArgument: z.string().describe('Um tratamento mais expandido da história, cobrindo os principais pontos da trama do início ao fim.'),
    marketingPotential: z.string().describe('Uma análise das oportunidades de marketing e do apelo comercial do projeto.'),
});


const GeneratePitchingDocumentOutputSchema = z.object({
  pitchingDocument: PitchingDocumentSchema.describe(
      'O documento de pitching completo, com cada seção preenchida.'
    ),
});

export type GeneratePitchingDocumentOutput = z.infer<typeof GeneratePitchingDocumentOutputSchema>;

export async function generatePitchingDocument(
  input: GeneratePitchingDocumentInput
): Promise<GeneratePitchingDocumentOutput> {
  return generatePitchingDocumentFlow(input);
}

const generatePitchingDocumentPrompt = ai.definePrompt({
  name: 'generatePitchingDocumentPrompt',
  input: {schema: GeneratePitchingDocumentInputSchema},
  output: {schema: GeneratePitchingDocumentOutputSchema},
  prompt: `Você é um produtor executivo de cinema experiente. Sua tarefa é analisar o roteiro fornecido e criar um documento de vendas (pitching document) profissional, coeso e persuasivo. A resposta deve ser em português.

**Instruções:**
Analise o roteiro e gere o conteúdo para cada uma das seções a seguir. Seja conciso, mas informativo. O conteúdo deve ser em texto simples, sem formatação markdown complexa.

1.  **elevatorPitch**: Crie um pitch rápido e impactante (2-3 frases) que capture a essência do projeto e gere interesse imediato.
2.  **logline**: Uma frase concisa e impactante.
3.  **synopsis**: Um resumo da trama principal, apresentando o protagonista, seu objetivo, o conflito e o que está em jogo.
4.  **theme**: A mensagem central e as questões universais que a obra explora.
5.  **targetAudience**: Uma descrição do principal grupo de audiência para este filme.
6.  **justification**: Uma explicação convincente de por que esta história é relevante e precisa ser contada agora.
7.  **mainCharacters**: Breves descrições do protagonista e do antagonista, focando em seus arcos e conflitos.
8.  **toneAndStyle**: A atmosfera, o estilo visual e a abordagem narrativa do filme.
9.  **storyArc**: Um resumo do desenvolvimento da trama através de seus atos principais.
10. **detailedArgument**: Um tratamento mais expandido da história, cobrindo os principais pontos da trama do início ao fim.
11. **marketingPotential**: Uma análise das oportunidades de marketing e do apelo comercial do projeto.

---
Gênero do Filme: {{{genre}}}
---
Conteúdo do Roteiro:
{{{scriptContent}}}
---

Gere o documento de pitching completo, preenchendo o objeto 'pitchingDocument'.`,
});

const generatePitchingDocumentFlow = ai.defineFlow(
  {
    name: 'generatePitchingDocumentFlow',
    inputSchema: GeneratePitchingDocumentInputSchema,
    outputSchema: GeneratePitchingDocumentOutputSchema,
  },
  async input => {
    const {output} = await generatePitchingDocumentPrompt(input);
    return output!;
  }
);
