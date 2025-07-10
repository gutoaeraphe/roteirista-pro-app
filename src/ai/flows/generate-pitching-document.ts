
'use server';

/**
 * @fileOverview Um fluxo que compila todas as informações do projeto (roteiro, análises) em um Documento de Design de Filme profissional e editável.
 *
 * - generatePitchingDocument - Uma função que lida com a geração do Documento de Design de Filme.
 * - GeneratePitchingDocumentInput - O tipo de entrada para a função generatePitchingDocument.
 * - GeneratePitchingDocumentOutput - O tipo de retorno para a função generatePitchingDocument.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePitchingDocumentInputSchema = z.object({
  script: z.string().describe('O roteiro do filme.'),
  analysisSummary: z.string().describe('Um resumo da análise do roteiro.'),
  marketAnalysis: z.string().describe('A análise de mercado para o filme.'),
  characterAnalysis: z.string().describe('A análise de personagens para o filme.'),
  heroJourneyAnalysis: z.string().describe('A análise da jornada do herói para o filme.'),
  representativityAnalysis: z.string().describe('A análise de representatividade para o filme.'),
});

export type GeneratePitchingDocumentInput = z.infer<typeof GeneratePitchingDocumentInputSchema>;

const GeneratePitchingDocumentOutputSchema = z.object({
  filmDesignDocument: z.string().describe('O Documento de Design de Filme compilado.'),
});

export type GeneratePitchingDocumentOutput = z.infer<typeof GeneratePitchingDocumentOutputSchema>;

export async function generatePitchingDocument(input: GeneratePitchingDocumentInput): Promise<GeneratePitchingDocumentOutput> {
  return generatePitchingDocumentFlow(input);
}

const generatePitchingDocumentPrompt = ai.definePrompt({
  name: 'generatePitchingDocumentPrompt',
  input: {schema: GeneratePitchingDocumentInputSchema},
  output: {schema: GeneratePitchingDocumentOutputSchema},
  prompt: `Você é um produtor de cinema especialista. Você receberá o roteiro, um resumo da análise do roteiro, uma análise de mercado, uma análise de personagens, uma análise da jornada do herói e uma análise de representatividade para um filme.

  Compile todas essas informações em um Documento de Design de Filme profissional e editável em português, pronto para ser apresentado a estúdios.

  Roteiro: {{{script}}}
  Resumo da Análise: {{{analysisSummary}}}
  Análise de Mercado: {{{marketAnalysis}}}
  Análise de Personagens: {{{characterAnalysis}}}
  Análise da Jornada do Herói: {{{heroJourneyAnalysis}}}
  Análise de Representatividade: {{{representativityAnalysis}}}

  Documento de Design de Filme:`,
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
