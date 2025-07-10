'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a script's representation of diversity
 *  using the Bechdel, Vito Russo, and DuVernay tests.
 *
 * - analyzeScriptRepresentation - A function that initiates the script representation analysis flow.
 * - AnalyzeScriptRepresentationInput - The input type for the analyzeScriptRepresentation function.
 * - AnalyzeScriptRepresentationOutput - The return type for the analyzeScriptRepresentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptRepresentationInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('The content of the script to be analyzed.'),
});
export type AnalyzeScriptRepresentationInput = z.infer<
  typeof AnalyzeScriptRepresentationInputSchema
>;

const AnalyzeScriptRepresentationOutputSchema = z.object({
  bechdelTest: z.object({
    passed: z.boolean().describe('Whether the script passes the Bechdel test.'),
    reason: z
      .string()
      .describe('The reason for passing or failing the Bechdel test.'),
  }),
  vitoRussoTest: z.object({
    passed: z
      .boolean()
      .describe('Whether the script passes the Vito Russo test.'),
    reason: z
      .string()
      .describe('The reason for passing or failing the Vito Russo test.'),
  }),
  duVernayTest: z.object({
    passed: z
      .boolean()
      .describe('Whether the script passes the DuVernay test.'),
    reason: z
      .string()
      .describe('The reason for passing or failing the DuVernay test.'),
  }),
});
export type AnalyzeScriptRepresentationOutput = z.infer<
  typeof AnalyzeScriptRepresentationOutputSchema
>;

export async function analyzeScriptRepresentation(
  input: AnalyzeScriptRepresentationInput
): Promise<AnalyzeScriptRepresentationOutput> {
  return analyzeScriptRepresentationFlow(input);
}

const analyzeScriptRepresentationPrompt = ai.definePrompt({
  name: 'analyzeScriptRepresentationPrompt',
  input: {schema: AnalyzeScriptRepresentationInputSchema},
  output: {schema: AnalyzeScriptRepresentationOutputSchema},
  prompt: `You are an AI assistant that analyzes movie scripts for diversity and representation using the Bechdel, Vito Russo, and DuVernay tests.

Bechdel Test: A script passes if it includes at least two named female characters who have at least one conversation with each other about something other than a man.
Vito Russo Test: A script passes if it contains at least one character that is identifiably lesbian, gay, bisexual, and/or transgender, the character is not solely or predominantly defined by their sexual orientation or gender identity, and the character is integral to the plot, such that their removal would have a significant effect.
DuVernay Test: A script passes if the cast and crew include women and people of color and if the story subverts classic film stereotypes.

Analyze the following script and determine whether it passes each of the tests. Explain why or why not in the "reason" field.

Script: {{{scriptContent}}}`,
});

const analyzeScriptRepresentationFlow = ai.defineFlow(
  {
    name: 'analyzeScriptRepresentationFlow',
    inputSchema: AnalyzeScriptRepresentationInputSchema,
    outputSchema: AnalyzeScriptRepresentationOutputSchema,
  },
  async input => {
    const {output} = await analyzeScriptRepresentationPrompt(input);
    return output!;
  }
);
