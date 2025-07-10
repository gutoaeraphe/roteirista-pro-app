
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
  marketingAndSalesPotential: z
    .string()
    .describe(
      'Análise de como marcas e patrocinadores poderiam ser inseridos no contexto do filme (product placement).'
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

export async function analyzeScriptMarket(
  input: AnalyzeScriptMarketInput
): Promise<AnalyzeScriptMarketOutput> {
  return analyzeScriptMarketFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptMarketPrompt',
  input: {schema: AnalyzeScriptMarketInputSchema},
  output: {schema: AnalyzeScriptMarketOutputSchema},
  prompt: `Você é um analista de mercado e estrategista de conteúdo para um grande estúdio de cinema, com foco especial no mercado audiovisual brasileiro. Sua análise deve ser pragmática, crítica e orientada a negócios. A meta é avaliar a viabilidade comercial do projeto, identificando riscos e oportunidades de forma direta. Responda inteiramente em português.

**Gênero:** {{{genre}}}
**Resumo do Roteiro:** {{{scriptSummary}}}

**Sua Tarefa:**
Analise o projeto e gere insights estratégicos para cada um dos seguintes campos. Seja realista e não hesite em apontar pontos fracos.

1.  **commercialPotential**: Avalie o potencial comercial de forma realista. Forneça uma 'description' que justifique a nota e os riscos, e atribua um 'score' de 1 a 10.
2.  **targetAudience**: Descreva o público-alvo principal e secundário. Seja específico sobre nichos e o tamanho potencial desses públicos. Avalie o quão fácil ou difícil será atingi-los.
3.  **marketPotential**: Avalie o potencial no mercado brasileiro. O tema tem apelo local? Há barreiras culturais? Sugira adaptações necessárias para aumentar a viabilidade no Brasil.
4.  **contentTrends**: O projeto surfa uma onda ou vai na contramão das tendências? Analise os prós e contras da abordagem em relação ao momento atual do mercado.
5.  **originalityAndDifferentiation**: Avalie a originalidade de forma crítica. É genuinamente original ou uma mistura de conceitos existentes? Quais são seus diferenciais competitivos REAIS contra outros conteúdos?
6.  **marketingAndSalesPotential**: Descreva oportunidades de marketing e product placement. As inserções de marcas seriam orgânicas ou forçadas? Qual o apelo para patrocinadores?
7.  **complementaryProducts**: Sugira produtos derivados com real potencial de mercado, não apenas ideias genéricas. Há uma base de fãs potencial que consumiria esses produtos?
8.  **referenceWorks**: Liste obras de referência (filmes, séries) e use-as para fazer uma análise comparativa honesta (benchmarking). A comparação é favorável? O que se pode aprender com o sucesso ou fracasso delas?
9.  **distributionChannels**: Recomende os canais de distribuição mais adequados e justifique com base em custos, alcance e perfil do público. Seja realista sobre as chances de uma janela de cinema, por exemplo.

Seu tom é o de um executivo experiente apresentando uma análise interna. A clareza e a honestidade são mais importantes do que o otimismo.`,
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
