'use server';

/**
 * @fileOverview Analyzes a screenplay, providing a summary of its narrative structure,
 * characters, commercial potential, and originality.
 *
 * - analyzeScriptNarrative - A function that handles the screenplay analysis process.
 * - AnalyzeScriptNarrativeInput - The input type for the analyzeScriptNarrative function.
 * - AnalyzeScriptNarrativeOutput - The return type for the analyzeScriptNarrative function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptNarrativeInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('The content of the screenplay to be analyzed.'),
});
export type AnalyzeScriptNarrativeInput = z.infer<
  typeof AnalyzeScriptNarrativeInputSchema
>;

const AnalyzeScriptNarrativeOutputSchema = z.object({
  summary: z.object({
    plotSummary: z.string().describe('A brief summary of the plot.'),
    narrativeStructure: z
      .string()
      .describe('Summary of the narrative structure.'),
    characters: z.string().describe('Summary of the characters.'),
    commercialPotential: z
      .string()
      .describe('Assessment of the commercial potential.'),
    originality: z.string().describe('Assessment of the originality.'),
  }),
  narrativeStructureAnalysis: z
    .string()
    .describe('Detailed analysis of narrative elements (balance, tension, unit).'),
  dramaturgyCanvasAnalysis: z
    .string()
    .describe('Critical analysis of triggering event, climax, theme and other elements.'),
});
export type AnalyzeScriptNarrativeOutput = z.infer<
  typeof AnalyzeScriptNarrativeOutputSchema
>;

export async function analyzeScriptNarrative(
  input: AnalyzeScriptNarrativeInput
): Promise<AnalyzeScriptNarrativeOutput> {
  return analyzeScriptNarrativeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptNarrativePrompt',
  input: {schema: AnalyzeScriptNarrativeInputSchema},
  output: {schema: AnalyzeScriptNarrativeOutputSchema},
  prompt: `You are an experienced script reader and story analyst. Analyze the provided screenplay and provide a summary covering the following aspects:\n\nPlot Summary: A concise overview of the script's main storyline.\nNarrative Structure: A breakdown of the script's structure, including acts, sequences, and key plot points.\nCharacters: An assessment of the main characters, their motivations, and their arcs.\nCommercial Potential: An evaluation of the script's potential appeal to audiences and the market.\nOriginality: An assessment of the script's unique elements and its differentiation from existing works.\nNarrative Structure Analysis: Detailed analysis of narrative elements such as balance, tension and unity.\nDramaturgy Canvas Analysis: Critical analysis of triggering event, climax, theme and other elements.\n\nScreenplay:\n{{{scriptContent}}}',
});

const analyzeScriptNarrativeFlow = ai.defineFlow(
  {
    name: 'analyzeScriptNarrativeFlow',
    inputSchema: AnalyzeScriptNarrativeInputSchema,
    outputSchema: AnalyzeScriptNarrativeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
