'use server';

/**
 * @fileOverview Generates a story argument including theme, characters, and narrative structure.
 *
 * - generateStoryArgument - A function that generates the story argument.
 * - GenerateStoryArgumentInput - The input type for the generateStoryArgument function.
 * - GenerateStoryArgumentOutput - The return type for the generateStoryArgument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryArgumentInputSchema = z.object({
  genre: z.string().describe('The genre of the story.'),
  title: z.string().describe('The title of the story.'),
  numberOfActs: z.number().describe('The desired number of acts in the story.'),
});
export type GenerateStoryArgumentInput = z.infer<typeof GenerateStoryArgumentInputSchema>;

const GenerateStoryArgumentOutputSchema = z.object({
  theme: z.string().describe('The central theme of the story.'),
  protagonistProfile: z.string().describe('A detailed profile of the protagonist.'),
  antagonistProfile: z.string().describe('A detailed profile of the antagonist.'),
  narrativeStructure: z.string().describe('A structured narrative outline of the story.'),
  argument: z.string().describe('A cohesive argument summarizing the story.'),
});
export type GenerateStoryArgumentOutput = z.infer<typeof GenerateStoryArgumentOutputSchema>;

export async function generateStoryArgument(input: GenerateStoryArgumentInput): Promise<GenerateStoryArgumentOutput> {
  return generateStoryArgumentFlow(input);
}

const generateStoryArgumentPrompt = ai.definePrompt({
  name: 'generateStoryArgumentPrompt',
  input: {schema: GenerateStoryArgumentInputSchema},
  output: {schema: GenerateStoryArgumentOutputSchema},
  prompt: `You are an experienced screenwriter and producer. Generate a comprehensive story argument based on the provided information.

Genre: {{{genre}}}
Title: {{{title}}}
Number of Acts: {{{numberOfActs}}}

Instructions:
1.  Define a compelling theme that resonates with the story's genre and title.
2.  Develop detailed profiles for both the protagonist and antagonist, including their motivations, backstories, and arcs.
3.  Structure the narrative into {{{numberOfActs}}} acts, outlining key plot points, conflicts, and resolutions.
4.  Compile all the above elements into a cohesive and persuasive argument that encapsulates the essence of the story, highlighting its potential for audience engagement and commercial success.

Output should be a complete argument ready to be used in a pitch deck.

Theme: {{theme}}
Protagonist Profile: {{protagonistProfile}}
Antagonist Profile: {{antagonistProfile}}
Narrative Structure: {{narrativeStructure}}
Argument: {{argument}}`,
});

const generateStoryArgumentFlow = ai.defineFlow(
  {
    name: 'generateStoryArgumentFlow',
    inputSchema: GenerateStoryArgumentInputSchema,
    outputSchema: GenerateStoryArgumentOutputSchema,
  },
  async input => {
    const {output} = await generateStoryArgumentPrompt(input);
    return output!;
  }
);
