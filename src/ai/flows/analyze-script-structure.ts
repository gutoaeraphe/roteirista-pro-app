'use server';

/**
 * @fileOverview Analyzes a screenplay, providing a detailed dashboard of its structure,
 * characters, commercial potential, and originality, including scores and suggestions.
 *
 * - analyzeScriptStructure - A function that handles the screenplay analysis process.
 * - AnalyzeScriptStructureInput - The input type for the analyzeScriptStructure function.
 * - AnalyzeScriptStructureOutput - The return type for the analyzeScriptStructure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptStructureInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('The content of the screenplay to be analyzed.'),
});
export type AnalyzeScriptStructureInput = z.infer<
  typeof AnalyzeScriptStructureInputSchema
>;

const MetricSchema = z.object({
    score: z.number().min(1).max(10).describe('A score from 1 to 10 for the metric.'),
    analysis: z.string().describe('A contextual analysis of the score.'),
    suggestions: z.string().optional().describe('Suggestions for improvement if the score is 7 or less.'),
});
export type Metric = z.infer<typeof MetricSchema>;

const DramaticElementSchema = z.object({
    name: z.string().describe('The name of the dramatic element (e.g., "Evento Desencadeador").'),
    identifiedExcerpt: z.string().describe('The excerpt from the script that represents this element.'),
    effectivenessAnalysis: z.string().describe('A critical analysis of the function and impact of this element.'),
});
export type DramaticElement = z.infer<typeof DramaticElementSchema>;


const AnalyzeScriptStructureOutputSchema = z.object({
  plotSummary: z.string().describe("A brief summary of the plot."),
  mainMetrics: z.object({
    narrativeStructure: MetricSchema.describe("Evaluation of the narrative structure's overall quality, averaging scores from specific criteria."),
    characterDevelopment: MetricSchema.describe("Evaluation of the main characters' depth and arc."),
    commercialPotential: MetricSchema.describe("Estimation based on genre, originality, and market trends."),
    originality: MetricSchema.describe("Assessment of the premise and execution's uniqueness compared to existing works."),
  }),
  dramaticElements: z.array(DramaticElementSchema).describe("Identification and analysis of central dramatic elements."),
  structureCriteria: z.object({
    balance: MetricSchema.describe("Assesses the distribution of attention and development across the story's parts."),
    tension: MetricSchema.describe("Analyzes the script's ability to generate and maintain audience interest and expectation."),
    unity: MetricSchema.describe("Checks the narrative's cohesion and integrity, ensuring all elements contribute to the main story."),
    contrast: MetricSchema.describe("Examines the presence of contrasting elements (characters, situations, emotions) that enrich the narrative."),
    directionality: MetricSchema.describe("Evaluates the clarity of the story's goal and the plot's progression towards it."),
  }),
});
export type AnalyzeScriptStructureOutput = z.infer<
  typeof AnalyzeScriptStructureOutputSchema
>;

export async function analyzeScriptStructure(
  input: AnalyzeScriptStructureInput
): Promise<AnalyzeScriptStructureOutput> {
  return analyzeScriptStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptStructurePrompt',
  input: {schema: AnalyzeScriptStructureInputSchema},
  output: {schema: AnalyzeScriptStructureOutputSchema},
  prompt: `You are an expert script analyst. Analyze the provided script and generate a detailed dashboard analysis.

Follow these instructions precisely:
1.  **Plot Summary**: Write a concise summary of the plot.
2.  **Main Metrics**: Provide a score (1-10), a contextual analysis for that score, and suggestions for improvement if the score is 7 or less for each of the following:
    - **Narrative Structure**: The average of the five structure criteria below.
    - **Character Development**: Depth and arc of main characters.
    - **Commercial Potential**: Based on genre, originality, and market trends.
    - **Originality**: Uniqueness of premise and execution.
3.  **Dramatic Elements**: For each of the following elements, identify the corresponding excerpt from the script and provide a critical analysis of its effectiveness and impact:
    - Evento Desencadeador (Triggering Event)
    - Questão Dramática (Dramatic Question)
    - Objetivo do Protagonista (Protagonist's Goal)
    - Obstáculos (Obstacles)
    - Clímax (Climax)
    - Resolução (Resolution)
    - Tema Central (Central Theme)
4.  **Structure Criteria**: For each of the following criteria, provide a score (1-10), a contextual analysis of the script based on this criterion, and concrete suggestions for improvement if the score is 7 or less:
    - **Balance**: Distribution of attention between story parts.
    - **Tension**: Ability to generate and maintain interest.
    - **Unity**: Cohesion of the narrative.
    - **Contrast**: Enriching contrasting elements.
    - **Directionality**: Clarity of the story's goal and progression.

Always provide suggestions for any score of 7 or lower.

Script Content:
{{{scriptContent}}}
`,
});

const analyzeScriptStructureFlow = ai.defineFlow(
  {
    name: 'analyzeScriptStructureFlow',
    inputSchema: AnalyzeScriptStructureInputSchema,
    outputSchema: AnalyzeScriptStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
