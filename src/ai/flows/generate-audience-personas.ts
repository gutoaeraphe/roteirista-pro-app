
'use server';

/**
 * @fileOverview Gera duas personas de público-alvo (primária e secundária) a partir de um roteiro.
 *
 * - generateAudiencePersonas - Gera as personas.
 * - GenerateAudiencePersonasInput - O tipo de entrada para a função.
 * - GenerateAudiencePersonasOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAudiencePersonasInputSchema = z.object({
  scriptContent: z.string().describe('O conteúdo do roteiro a ser analisado.'),
});
export type GenerateAudiencePersonasInput = z.infer<
  typeof GenerateAudiencePersonasInputSchema
>;

const PersonaProfileSchema = z.object({
    name: z.string().describe('Um nome fictício e crível para a persona (ex: "Lucas, o Explorador de Gêneros").'),
    demographics: z.string().describe("Dados demográficos básicos (idade, gênero, localização, ocupação)."),
    psychographics: z.string().describe("Análise de suas emoções, desejos, valores e 'dores' (problemas, frustrações)."),
    interactionNetworks: z.string().describe("Redes de interação e interesses compartilhados (hobbies, grupos sociais, influenciadores)."),
    audienceBehavior: z.string().describe("Como a persona descobre, escolhe e consome conteúdo audiovisual (plataformas, frequência)."),
    fanRelationship: z.string().describe("Como a persona se relaciona com o conteúdo que ama (coleciona, discute, cria teorias?)."),
    communityEngagement: z.string().describe("Como a persona interage com outros fãs e promove (ou não) o conteúdo em suas comunidades."),
});
export type PersonaProfile = z.infer<typeof PersonaProfileSchema>;

const GenerateAudiencePersonasOutputSchema = z.object({
  primaryPersona: PersonaProfileSchema.describe('A persona principal para o roteiro.'),
  secondaryPersona: PersonaProfileSchema.describe('A persona secundária ou complementar.'),
  strategicSummary: z.string().describe("Um resumo estratégico explicando por que essas personas foram escolhidas e como elas se conectam com o roteiro.")
});
export type GenerateAudiencePersonasOutput = z.infer<
  typeof GenerateAudiencePersonasOutputSchema
>;

export async function generateAudiencePersonas(
  input: GenerateAudiencePersonasInput
): Promise<GenerateAudiencePersonasOutput> {
  return generateAudiencePersonasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAudiencePersonasPrompt',
  input: {schema: GenerateAudiencePersonasInputSchema},
  output: {schema: GenerateAudiencePersonasOutputSchema},
  prompt: `Você é um analista de pesquisa de mercado sênior para um estúdio de cinema. Sua tarefa é ler o roteiro fornecido e gerar duas personas de público-alvo: uma primária e uma secundária. Responda inteiramente em português.

**Instruções de Análise:**

1.  **Leia o Roteiro:** Analise profundamente o roteiro para entender seu gênero, tom, temas, personagens e conflitos.
2.  **Identifique os Públicos:** Com base na análise, identifique os dois grupos de público mais prováveis para esta história.
3.  **Crie as Personas:** Para a persona primária e secundária, preencha DETALHADAMENTE os seguintes campos:
    *   **name:** Dê um nome fictício e memorável para a persona.
    *   **demographics:** Idade, gênero, localização, ocupação, etc.
    *   **psychographics:** Quais são suas emoções, desejos, valores e 'dores' (problemas, frustrações) que este filme poderia abordar?
    *   **interactionNetworks:** Com quem eles interagem? Quais são seus hobbies, interesses e quem os influencia?
    *   **audienceBehavior:** Como eles descobrem e assistem filmes (streaming, cinema)? Com que frequência?
    *   **fanRelationship:** Como eles se tornam fãs? Eles assistem várias vezes, compram produtos, seguem os atores nas redes sociais?
    *   **communityEngagement:** Eles participam de fóruns online (Reddit, Discord), comentam no YouTube, criam conteúdo (fan art, vídeos)? Como eles espalham a palavra?
4.  **Resumo Estratégico:** Escreva um parágrafo final explicando por que essas duas personas são as mais adequadas e como os elementos do roteiro (tema, personagem, conflito) se conectam diretamente a elas.

---

**Roteiro para Análise:**
{{{scriptContent}}}
`,
});

const generateAudiencePersonasFlow = ai.defineFlow(
  {
    name: 'generateAudiencePersonasFlow',
    inputSchema: GenerateAudiencePersonasInputSchema,
    outputSchema: GenerateAudiencePersonasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
