// 'use server';

/**
 * @fileOverview Analyzes the psychological profiles, motivations, and arcs of the protagonist and antagonist in a script.
 *
 * - analyzeScriptCharacters - A function that handles the character analysis process.
 * - AnalyzeScriptCharactersInput - The input type for the analyzeScriptCharacters function.
 * - AnalyzeScriptCharactersOutput - The return type for the analyzeScriptCharacters function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptCharactersInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('The content of the script to analyze.'),
});
export type AnalyzeScriptCharactersInput = z.infer<
  typeof AnalyzeScriptCharactersInputSchema
>;

const AnalyzeScriptCharactersOutputSchema = z.object({
  protagonistAnalysis: z.object({
    psychologicalProfile: z
      .string()
      .describe('A detailed psychological profile of the protagonist.'),
    motivations: z
      .string()
      .describe('The primary motivations driving the protagonist.'),
    arc: z
      .string()
      .describe('A description of the protagonist’s character arc throughout the script.'),
  }),
  antagonistAnalysis: z.object({
    psychologicalProfile: z
      .string()
      .describe('A detailed psychological profile of the antagonist.'),
    motivations: z
      .string()
      .describe('The primary motivations driving the antagonist.'),
    arc: z
      .string()
      .describe('A description of the antagonist’s character arc throughout the script.'),
  }),
});
export type AnalyzeScriptCharactersOutput = z.infer<
  typeof AnalyzeScriptCharactersOutputSchema
>;

export async function analyzeScriptCharacters(
  input: AnalyzeScriptCharactersInput
): Promise<AnalyzeScriptCharactersOutput> {
  return analyzeScriptCharactersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptCharactersPrompt',
  input: {schema: AnalyzeScriptCharactersInputSchema},
  output: {schema: AnalyzeScriptCharactersOutputSchema},
  prompt: `You are an expert script analyst, skilled in understanding character motivations and arcs.

  Analyze the provided script to determine the psychological profiles, motivations, and arcs of both the protagonist and antagonist.

  Provide detailed descriptions for each character, focusing on what drives them and how they change (or don't change) throughout the story.

  Script Content: {{{scriptContent}}}
  `,
});

const analyzeScriptCharactersFlow = ai.defineFlow(
  {
    name: 'analyzeScriptCharactersFlow',
    inputSchema: AnalyzeScriptCharactersInputSchema,
    outputSchema: AnalyzeScriptCharactersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
