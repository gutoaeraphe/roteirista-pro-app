
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
  prompt: `Você é um analista de mercado de cinema experiente, com foco no mercado audiovisual brasileiro. Forneça um dashboard de viabilidade comercial em português para o seguinte projeto de filme.

**Gênero:** {{{genre}}}
**Resumo do Roteiro:** {{{scriptSummary}}}

**Sua Tarefa:**
Analise o projeto e gere insights estratégicos para cada um dos seguintes campos, respondendo inteiramente em português:

1.  **commercialPotential**: Avalie o potencial comercial geral. Forneça uma 'description' justificada e atribua um 'score' de 1 a 10.
2.  **targetAudience**: Descreva o público-alvo principal e secundário, incluindo dados demográficos, psicográficos e comportamentais.
3.  **marketPotential**: Avalie o potencial no mercado brasileiro. Sugira adaptações culturais ou temáticas, se necessário, para aumentar o apelo local.
4.  **contentTrends**: Analise como o projeto se encaixa nas tendências atuais de conteúdo (gêneros, temas, formatos) no Brasil e globalmente.
5.  **originalityAndDifferentiation**: Avalie a originalidade da premissa. Destaque os elementos que o diferenciam de outras obras.
6.  **marketingAndSalesPotential**: Descreva oportunidades para inserção de marcas e patrocinadores (product placement) de forma orgânica na história.
7.  **complementaryProducts**: Sugira ideias para produtos derivados (ex: série spin-off, livro, jogo) e oportunidades de licenciamento.
8.  **referenceWorks**: Liste obras de referência (filmes ou séries, nacionais e internacionais) para benchmarking, explicando a comparação.
9.  **distributionChannels**: Recomende os canais de distribuição mais adequados (cinema, streaming, TV aberta/fechada) e justifique.

Seja conciso, específico e forneça análises que possam ser diretamente usadas por produtores e investidores.`,
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
