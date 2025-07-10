// src/ai/flows/generate-pitching-document.ts
'use server';

/**
 * @fileOverview A flow that compiles all project information (script, analyses) into a professional and editable Film Design Document.
 *
 * - generatePitchingDocument - A function that handles the generation of the Film Design Document.
 * - GeneratePitchingDocumentInput - The input type for the generatePitchingDocument function.
 * - GeneratePitchingDocumentOutput - The return type for the generatePitchingDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePitchingDocumentInputSchema = z.object({
  script: z.string().describe('The script of the film.'),
  analysisSummary: z.string().describe('A summary of the script analysis.'),
  marketAnalysis: z.string().describe('The market analysis for the film.'),
  characterAnalysis: z.string().describe('The character analysis for the film.'),
  heroJourneyAnalysis: z.string().describe('The hero journey analysis for the film.'),
  representativityAnalysis: z.string().describe('The representativity analysis for the film.'),
});

export type GeneratePitchingDocumentInput = z.infer<typeof GeneratePitchingDocumentInputSchema>;

const GeneratePitchingDocumentOutputSchema = z.object({
  filmDesignDocument: z.string().describe('The compiled Film Design Document.'),
});

export type GeneratePitchingDocumentOutput = z.infer<typeof GeneratePitchingDocumentOutputSchema>;

export async function generatePitchingDocument(input: GeneratePitchingDocumentInput): Promise<GeneratePitchingDocumentOutput> {
  return generatePitchingDocumentFlow(input);
}

const generatePitchingDocumentPrompt = ai.definePrompt({
  name: 'generatePitchingDocumentPrompt',
  input: {schema: GeneratePitchingDocumentInputSchema},
  output: {schema: GeneratePitchingDocumentOutputSchema},
  prompt: `You are an expert film producer. You will receive the script, a script analysis summary, a market analysis, a character analysis, a hero journey analysis and a representativity analysis for a film.

  You will compile all this information into a professional and editable Film Design Document, ready to be presented to studios.

  Script: {{{script}}}
  Analysis Summary: {{{analysisSummary}}}
  Market Analysis: {{{marketAnalysis}}}
  Character Analysis: {{{characterAnalysis}}}
  Hero Journey Analysis: {{{heroJourneyAnalysis}}}
  Representativity Analysis: {{{representativityAnalysis}}}

  Film Design Document:`,
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
