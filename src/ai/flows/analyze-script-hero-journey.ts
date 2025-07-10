// use server'
'use server';
/**
 * @fileOverview Analyzes a script to identify the 12 steps of the Hero's Journey and visualize the dramatic intensity.
 *
 * - analyzeScriptHeroJourney - A function that handles the script analysis process.
 * - AnalyzeScriptHeroJourneyInput - The input type for the analyzeScriptHeroJourney function.
 * - AnalyzeScriptHeroJourneyOutput - The return type for the analyzeScriptHeroJourney function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptHeroJourneyInputSchema = z.object({
  script: z.string().describe('The screenplay script to analyze.'),
});
export type AnalyzeScriptHeroJourneyInput = z.infer<
  typeof AnalyzeScriptHeroJourneyInputSchema
>;

const AnalyzeScriptHeroJourneyOutputSchema = z.object({
  heroJourneySteps: z
    .array(z.string())
    .describe('The 12 steps of the hero\'s journey identified in the script.'),
  dramaticIntensity: z
    .array(z.number())
    .describe('A list of numbers representing the dramatic intensity throughout the script.'),
});
export type AnalyzeScriptHeroJourneyOutput = z.infer<
  typeof AnalyzeScriptHeroJourneyOutputSchema
>;

export async function analyzeScriptHeroJourney(
  input: AnalyzeScriptHeroJourneyInput
): Promise<AnalyzeScriptHeroJourneyOutput> {
  return analyzeScriptHeroJourneyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptHeroJourneyPrompt',
  input: {schema: AnalyzeScriptHeroJourneyInputSchema},
  output: {schema: AnalyzeScriptHeroJourneyOutputSchema},
  prompt: `You are an expert story analyst. Analyze the provided script and identify the 12 steps of the Hero's Journey within it. Also, determine the dramatic intensity throughout the script.

Script:
{{{script}}}

Output the heroJourneySteps as a list of strings, and dramaticIntensity as a corresponding list of numbers (0-100) for each step in the journey.  The higher the number, the more intense the drama at that point in the story.  Make sure the lists are the same length.

{{outputFormatInstructions}}`,
});

const analyzeScriptHeroJourneyFlow = ai.defineFlow(
  {
    name: 'analyzeScriptHeroJourneyFlow',
    inputSchema: AnalyzeScriptHeroJourneyInputSchema,
    outputSchema: AnalyzeScriptHeroJourneyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
