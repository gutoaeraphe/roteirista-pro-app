
'use server';

/**
 * @fileOverview Analisa um roteiro da perspectiva de uma persona de público-alvo.
 *
 * - analyzeScriptFromPersona - Realiza a análise do roteiro.
 * - AnalyzeScriptFromPersonaInput - O tipo de entrada para a função.
 * - AnalyzeScriptFromPersonaOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptFromPersonaInputSchema = z.object({
  scriptContent: z.string().describe('O conteúdo do roteiro a ser analisado.'),
  persona: z.string().describe('Uma string JSON representando o objeto da persona gerada.'),
});
export type AnalyzeScriptFromPersonaInput = z.infer<
  typeof AnalyzeScriptFromPersonaInputSchema
>;

const AnalyzeScriptFromPersonaOutputSchema = z.object({
  plotAndStructure: z.string().describe("Análise da trama e estrutura narrativa sob a perspectiva da persona, respondendo às perguntas-chave (engajamento, ritmo, originalidade, clareza, tensão)."),
  characters: z.string().describe("Análise dos personagens, focando na identificação, profundidade, motivações e arcos, sempre do ponto de vista da persona."),
  dialogues: z.string().describe("Avaliação dos diálogos quanto à naturalidade, função e subtexto, conforme a percepção da persona."),
  thematicAndMessage: z.string().describe("Análise do tema e da mensagem, considerando a relevância e o impacto emocional/intelectual para a persona."),
  finalVerdict: z.string().describe("Um veredito final da persona, resumindo sua experiência geral e se ela recomendaria a história, justificando sua opinião com base em suas expectativas e perfil."),
});
export type AnalyzeScriptFromPersonaOutput = z.infer<
  typeof AnalyzeScriptFromPersonaOutputSchema
>;

export async function analyzeScriptFromPersona(
  input: AnalyzeScriptFromPersonaInput
): Promise<AnalyzeScriptFromPersonaOutput> {
  return analyzeScriptFromPersonaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptFromPersonaPrompt',
  input: {schema: AnalyzeScriptFromPersonaInputSchema},
  output: {schema: AnalyzeScriptFromPersonaOutputSchema},
  prompt: `Você é um crítico de cinema e analista de público. Sua tarefa é incorporar COMPLETAMENTE a persona fornecida e analisar o roteiro a partir do ponto de vista DELA. Pense e escreva como se você fosse essa pessoa. Suas respostas devem refletir as expectativas, gostos e o comportamento descritos no perfil da persona. Responda inteiramente em português e use a primeira pessoa ("Eu senti que...", "Para mim...").

**Perfil da Persona para Incorporar:**
{{{persona}}}

**Roteiro para Análise:**
{{{scriptContent}}}

**Instruções de Análise (Responda a TUDO como se fosse a persona):**

1.  **Trama e Estrutura Narrativa (plotAndStructure)**:
    *   A história me prendeu desde o começo? Os primeiros 10 minutos me deixaram curioso?
    *   O ritmo foi bom ou teve partes chatas?
    *   A trama foi original ou previsível? Teve reviravoltas que me surpreenderam?
    *   Eu entendi o que estava acontecendo? As regras do universo fizeram sentido para mim?
    *   Os desafios foram interessantes? Senti que havia algo importante em jogo?

2.  **Personagens (characters)**:
    *   Eu me importei com o protagonista? Consegui torcer por ele?
    *   Os personagens pareceram pessoas reais ou eram superficiais?
    *   Ficou claro o que cada personagem queria e por quê?
    *   O protagonista mudou ao longo da história? Ele aprendeu alguma coisa?

3.  **Diálogos (dialogues)**:
    *   As conversas soaram naturais ou falsas?
    *   Os diálogos ajudaram a história a avançar ou foram só para encher linguiça?
    *   Senti que havia mais coisas sendo ditas nas entrelinhas?

4.  **Temática e Mensagem (thematicAndMessage)**:
    *   O tema principal me interessou? Me fez pensar?
    *   A abordagem do tema foi profunda ou superficial?
    *   Como me senti depois de 'assistir' a essa história? (inspirado, triste, etc.). A história ficou na minha cabeça?

5.  **Veredito Final (finalVerdict)**:
    *   Com base em tudo, qual é minha opinião geral? Essa história atendeu às minhas expectativas (descritas no meu perfil de persona)? Eu assistiria a este filme/série? Eu o recomendaria para pessoas como eu? Justifique.`,
});

const analyzeScriptFromPersonaFlow = ai.defineFlow(
  {
    name: 'analyzeScriptFromPersonaFlow',
    inputSchema: AnalyzeScriptFromPersonaInputSchema,
    outputSchema: AnalyzeScriptFromPersonaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
