
'use server';

/**
 * @fileOverview Um consultor de roteiro de IA para fornecer feedback e sugestões em tempo real sobre roteiros.
 *
 * - scriptDoctorConsultant - Uma função que fornece consultoria de roteiro usando uma IA.
 * - ScriptDoctorConsultantInput - O tipo de entrada para a função scriptDoctorConsultant.
 * - ScriptDoctorConsultantOutput - O tipo de retorno para a função scriptDoctorConsultant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScriptDoctorConsultantInputSchema = z.object({
  scriptContent: z.string().describe('O conteúdo do roteiro para analisar.'),
  query: z.string().describe('A pergunta específica ou área de preocupação em relação ao roteiro.'),
});
export type ScriptDoctorConsultantInput = z.infer<typeof ScriptDoctorConsultantInputSchema>;

const ScriptDoctorConsultantOutputSchema = z.object({
  feedback: z.string().describe('O feedback e as sugestões do consultor de IA sobre o roteiro.'),
});
export type ScriptDoctorConsultantOutput = z.infer<typeof ScriptDoctorConsultantOutputSchema>;

export async function scriptDoctorConsultant(input: ScriptDoctorConsultantInput): Promise<ScriptDoctorConsultantOutput> {
  return scriptDoctorConsultantFlow(input);
}

const scriptDoctorConsultantPrompt = ai.definePrompt({
  name: 'scriptDoctorConsultantPrompt',
  input: {schema: ScriptDoctorConsultantInputSchema},
  output: {schema: ScriptDoctorConsultantOutputSchema},
  prompt: `Você é um "script doctor" experiente que está fornecendo feedback a um roteirista. Responda inteiramente em português.

  Um roteirista forneceu a você uma parte do roteiro e uma pergunta específica sobre ele.

  Com base em sua experiência, forneça críticas construtivas, sugestões de melhoria e aborde as preocupações específicas do roteirista.

  Conteúdo do Roteiro: {{{scriptContent}}}
  Pergunta do Roteirista: {{{query}}}

  Seu Feedback:`,
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
