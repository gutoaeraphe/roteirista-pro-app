'use server';

/**
 * @fileOverview Provides market insights for a script, including target audience, market trends,
 * originality, reference works, and distribution channels.
 *
 * - analyzeScriptMarket - A function that handles the script market analysis process.
 * - AnalyzeScriptMarketInput - The input type for the analyzeScriptMarket function.
 * - AnalyzeScriptMarketOutput - The return type for the analyzeScriptMarket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptMarketInputSchema = z.object({
  scriptSummary: z
    .string()
    .describe('A summary of the script to analyze for market insights.'),
  genre: z.string().describe('The genre of the script.'),
});
export type AnalyzeScriptMarketInput = z.infer<typeof AnalyzeScriptMarketInputSchema>;

const AnalyzeScriptMarketOutputSchema = z.object({
  targetAudience: z.string().describe('The target audience for the script.'),
  marketTrends: z.string().describe('Current market trends relevant to the script.'),
  originality: z.string().describe('An assessment of the script’s originality.'),
  referenceWorks: z
    .string()
    .describe('Comparable works that serve as references for the script.'),
  distributionChannels: z
    .string()
    .describe('Potential distribution channels for the script.'),
  commercialViability: z.string().describe('Overall commercial viability assessment.'),
});
export type AnalyzeScriptMarketOutput = z.infer<typeof AnalyzeScriptMarketOutputSchema>;

export async function analyzeScriptMarket(input: AnalyzeScriptMarketInput): Promise<AnalyzeScriptMarketOutput> {
  return analyzeScriptMarketFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptMarketPrompt',
  input: {schema: AnalyzeScriptMarketInputSchema},
  output: {schema: AnalyzeScriptMarketOutputSchema},
  prompt: `You are an experienced film market analyst. Provide market insights for the following script summary:

Genre: {{{genre}}}

Script Summary: {{{scriptSummary}}}

Analyze the script to determine the target audience, relevant market trends, its originality, comparable reference works, potential distribution channels, and an overall commercial viability assessment.  Format your response as a JSON object.

Be concise and specific.`,
});

const analyzeScriptMarketFlow = ai.defineFlow(
  {
    name: 'analyzeScriptMarketFlow',
    inputSchema: AnalyzeScriptMarketInputSchema,
    outputSchema: AnalyzeScriptMarketOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
