
'use server';

/**
 * @fileOverview Fornece um dashboard de viabilidade comercial para um roteiro, incluindo público-alvo,
 * tendências, originalidade, potencial de marketing e mais, com foco no mercado brasileiro.
 *
 * - analyzeScriptMarket - Uma função que lida com o processo de análise de mercado do roteiro.
 * - AnalyzeScriptMarketInput - O tipo de entrada para a função analyzeScriptMarket.
 * - AnalyzeScriptMarketOutput - O tipo de retorno para a função analyzeScriptMarket.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptMarketInputSchema = z.object({
  scriptSummary: z
    .string()
    .describe('Um resumo do roteiro a ser analisado para insights de mercado.'),
  genre: z.string().describe('O gênero do roteiro.'),
  scriptName: z.string().describe('O nome do roteiro.'),
});
export type AnalyzeScriptMarketInput = z.infer<
  typeof AnalyzeScriptMarketInputSchema
>;

const CommercialPotentialSchema = z.object({
    description: z.string().describe('Uma descrição justificada do potencial comercial do projeto.'),
    score: z.number().min(1).max(10).describe('Uma pontuação de 1 a 10 para a viabilidade comercial.'),
});

const AnalyzeScriptMarketOutputSchema = z.object({
  commercialPotential: CommercialPotentialSchema.describe('Uma avaliação geral do potencial comercial com uma pontuação.'),
  targetAudience: z
    .string()
    .describe(
      'Análise detalhada do público-alvo potencial (dados demográficos, psicográficos e comportamentais).'
    ),
  marketPotential: z
    .string()
    .describe(
      'Avaliação do potencial mercadológico com foco no Brasil e sugestões de adaptações para o mercado local.'
    ),
  contentTrends: z
    .string()
    .describe(
      'Análise de como o roteiro se alinha com as tendências atuais de gêneros, temas e formatos em alta demanda.'
    ),
  originalityAndDifferentiation: z
    .string()
    .describe(
      'Avaliação do grau de originalidade da premissa, destacando elementos únicos e diferenciais competitivos.'
    ),
  complementaryProducts: z
    .string()
    .describe(
      'Sugestões de produtos derivados e oportunidades de licenciamento (séries, jogos, livros, etc.).'
    ),
  referenceWorks: z
    .string()
    .describe(
      'Identificação de obras semelhantes (nacionais e internacionais) para análise comparativa e posicionamento de mercado.'
    ),
  distributionChannels: z
    .string()
    .describe(
      'Recomendações sobre os canais de distribuição mais adequados (cinema, streaming, TV).'
    ),
});
export type AnalyzeScriptMarketOutput = z.infer<
  typeof AnalyzeScriptMarketOutputSchema
>;

// O schema de análise não tem sugestões diretas, então usaremos o output completo como base.
// As sugestões estão implícitas nos campos como 'marketPotential' e 'marketingAndSalesPotential'.
// Para manter a consistência, vamos criar um segundo prompt para refinar essas seções com uma temperatura mais alta.

const RefinedMarketInsightsSchema = z.object({
    marketPotential: z.string().describe('Sugestões REFINADAS e CRIATIVAS de adaptações para o mercado local.'),
    complementaryProducts: z.string().describe('Sugestões CRIATIVAS e com real potencial de mercado para produtos derivados.'),
});

export async function analyzeScriptMarket(
  input: AnalyzeScriptMarketInput
): Promise<AnalyzeScriptMarketOutput> {
  return analyzeScriptMarketFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeScriptMarketAnalysisPrompt',
  input: {schema: AnalyzeScriptMarketInputSchema},
  output: {schema: AnalyzeScriptMarketOutputSchema},
  config: { temperature: 0.2 },
  prompt: `Você é um analista de mercado e estrategista de conteúdo para um grande estúdio de cinema, com foco especial no mercado audiovisual brasileiro. Sua análise deve ser pragmática, técnica e orientada a negócios. A meta é avaliar a viabilidade comercial do projeto de forma direta. Responda inteiramente em português.

**Título do Roteiro:** {{{scriptName}}}
**Gênero:** {{{genre}}}
**Resumo do Roteiro:** {{{scriptSummary}}}

**Sua Tarefa:**
Analise o projeto e gere insights estratégicos para cada um dos seguintes campos. Seja realista e não hesite em apontar pontos fracos.

1.  **commercialPotential**: Avalie o potencial comercial de forma realista. Forneça uma 'description' que justifique a nota e os riscos, e atribua um 'score' de 1 a 10.
2.  **targetAudience**: Descreva o público-alvo principal e secundário.
3.  **marketPotential**: Avalie o potencial no mercado brasileiro e as barreiras culturais.
4.  **contentTrends**: Analise se o projeto está alinhado com as tendências atuais.
5.  **originalityAndDifferentiation**: Avalie a originalidade e os diferenciais competitivos.
6.  **complementaryProducts**: Sugira produtos derivados com potencial de mercado.
7.  **referenceWorks**: Liste obras de referência e faça uma análise comparativa (benchmarking).
8.  **distributionChannels**: Recomende os canais de distribuição mais adequados e justifique.

Seu tom é o de um executivo experiente apresentando uma análise interna. A clareza e a honestidade são mais importantes que o otimismo.`,
});

const creativeSuggestionsPrompt = ai.definePrompt({
    name: 'generateMarketSuggestionsPrompt',
    input: { schema: AnalyzeScriptMarketOutputSchema },
    output: { schema: RefinedMarketInsightsSchema },
    config: { temperature: 0.9 },
    prompt: `Você é um estrategista de marketing de conteúdo extremamente criativo. Com base na análise de mercado técnica fornecida, sua tarefa é refinar duas seções com ideias inovadoras, "fora da caixa" e específicas. **A qualidade e relevância são mais importantes que a quantidade.**

**Análise Técnica para Referência:**
\`\`\`json
{{{json this}}}
\`\`\`

**Sua Missão Criativa:**

1.  **marketPotential:** Pegue a análise de potencial de mercado e transforme-a em sugestões de adaptação *criativas* e *ousadas* para o mercado brasileiro. **Gere apenas sugestões que forem realmente interessantes e conectadas ao projeto.** Se não houver boas ideias, não force.
2.  **complementaryProducts:** Brainstorm de produtos derivados que criem um universo expandido. Pense em webséries, podcasts narrativos, jogos de realidade alternativa (ARGs) ou linhas de produtos conceituais. **Foque em uma ou duas ideias que tenham real potencial de mercado e sinergia com a obra, em vez de uma lista genérica.**

Seja inspirador e mostre o potencial oculto do projeto.`,
});

const analyzeScriptMarketFlow = ai.defineFlow(
  {
    name: 'analyzeScriptMarketFlow',
    inputSchema: AnalyzeScriptMarketInputSchema,
    outputSchema: AnalyzeScriptMarketOutputSchema,
  },
  async input => {
    // 1. Análise técnica com baixa temperatura
    const { output: analysis } = await analysisPrompt(input);
    if (!analysis) {
        throw new Error("A fase de análise de mercado falhou.");
    }

    // 2. Geração de sugestões criativas com alta temperatura
    const { output: suggestions } = await creativeSuggestionsPrompt(analysis);
    if (!suggestions) {
        throw new Error("A fase de geração de sugestões de mercado falhou.");
    }

    // 3. Combinar os resultados, substituindo os campos com as sugestões criativas
    const finalResult: AnalyzeScriptMarketOutput = {
      ...analysis,
      marketPotential: suggestions.marketPotential,
      complementaryProducts: suggestions.complementaryProducts,
    };

    return finalResult;
  }
);
