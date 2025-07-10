// src/ai/flows/script-doctor-consultant.ts
'use server';

/**
 * @fileOverview An AI script consultant for providing real-time feedback and suggestions on screenplays.
 *
 * - scriptDoctorConsultant - A function that provides script consultation using an AI.
 * - ScriptDoctorConsultantInput - The input type for the scriptDoctorConsultant function.
 * - ScriptDoctorConsultantOutput - The return type for the scriptDoctorConsultant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScriptDoctorConsultantInputSchema = z.object({
  scriptContent: z.string().describe('The content of the screenplay to analyze.'),
  query: z.string().describe('The specific question or area of concern regarding the script.'),
});
export type ScriptDoctorConsultantInput = z.infer<typeof ScriptDoctorConsultantInputSchema>;

const ScriptDoctorConsultantOutputSchema = z.object({
  feedback: z.string().describe('The AI consultant’s feedback and suggestions on the screenplay.'),
});
export type ScriptDoctorConsultantOutput = z.infer<typeof ScriptDoctorConsultantOutputSchema>;

export async function scriptDoctorConsultant(input: ScriptDoctorConsultantInput): Promise<ScriptDoctorConsultantOutput> {
  return scriptDoctorConsultantFlow(input);
}

const scriptDoctorConsultantPrompt = ai.definePrompt({
  name: 'scriptDoctorConsultantPrompt',
  input: {schema: ScriptDoctorConsultantInputSchema},
  output: {schema: ScriptDoctorConsultantOutputSchema},
  prompt: `You are an experienced script doctor providing feedback to screenwriters.

  A screenwriter has provided you with a portion of their script and a specific question regarding it.

  Based on your expertise, provide constructive criticism, suggestions for improvement, and address the screenwriter's specific concerns.

  Script Content: {{{scriptContent}}}
  Screenwriter's Question: {{{query}}}

  Your Feedback:`,
});

const scriptDoctorConsultantFlow = ai.defineFlow(
  {
    name: 'scriptDoctorConsultantFlow',
    inputSchema: ScriptDoctorConsultantInputSchema,
    outputSchema: ScriptDoctorConsultantOutputSchema,
  },
  async input => {
    const {output} = await scriptDoctorConsultantPrompt(input);
    return output!;
  }
);
