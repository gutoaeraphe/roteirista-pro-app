
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

const GeneratePitchingDocumentOutputSchema = z.object({
  pitchingDocument: z
    .string()
    .describe(
      'O documento de pitching completo e formatado, pronto para apresentação.'
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

Formate a saída como um único documento de texto (string), usando marcações simples como títulos (ex: "## Logline") e parágrafos para organizar o conteúdo.

O documento deve incluir as seguintes seções, nesta ordem:

1.  **Logline**: Uma frase concisa e impactante que resume a essência da história.
2.  **Sinopse**: Um resumo da trama principal, apresentando o protagonista, seu objetivo, o conflito e o que está em jogo.
3.  **Tema**: A mensagem central e as questões universais que a obra explora.
4.  **Público-Alvo**: Uma descrição do principal grupo de audiência para este filme.
5.  **Justificativa**: Uma explicação convincente de por que esta história é relevante e precisa ser contada agora.
6.  **Personagens Principais**: Breves descrições do protagonista e do antagonista, focando em seus arcos e conflitos.
7.  **Tom e Estilo**: A atmosfera, o estilo visual e a abordagem narrativa do filme.
8.  **Arco da História**: Um resumo do desenvolvimento da trama através de seus atos principais.
9.  **Argumento Detalhado**: Um tratamento mais expandido da história, cobrindo os principais pontos da trama do início ao fim.
10. **Potencial de Marketing**: Uma análise das oportunidades de marketing e do apelo comercial do projeto.

---
Gênero do Filme: {{{genre}}}
---
Conteúdo do Roteiro:
{{{scriptContent}}}
---

Gere o documento de pitching completo no campo 'pitchingDocument'.`,
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
