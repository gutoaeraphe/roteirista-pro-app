
'use server';

/**
 * @fileOverview Realiza uma análise SWOT dramatúrgica completa de um roteiro, avaliando
 * forças, fraquezas, oportunidades e ameaças.
 *
 * - analyzeScriptSwot - Uma função que lida com o processo de análise SWOT do roteiro.
 * - AnalyzeScriptSwotInput - O tipo de entrada para a função analyzeScriptSwot.
 * - AnalyzeScriptSwotOutput - O tipo de retorno para a função analyzeScriptSwot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptSwotInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('O conteúdo do roteiro a ser analisado.'),
});
export type AnalyzeScriptSwotInput = z.infer<
  typeof AnalyzeScriptSwotInputSchema
>;

const AnalyzeScriptSwotOutputSchema = z.object({
    strengths: z.string().describe('Análise das forças internas do roteiro, formatada em Markdown.'),
    weaknesses: z.string().describe('Análise das fraquezas internas do roteiro, formatada em Markdown.'),
    opportunities: z.string().describe('Análise das oportunidades de mercado externas, formatada em Markdown.'),
    threats: z.string().describe('Análise das ameaças de mercado externas, formatada em Markdown.'),
    summary: z.string().describe('Um parágrafo de resumo que consolida os pontos principais e sugere os próximos passos.'),
});
export type AnalyzeScriptSwotOutput = z.infer<
  typeof AnalyzeScriptSwotOutputSchema
>;

export async function analyzeScriptSwot(
  input: AnalyzeScriptSwotInput
): Promise<AnalyzeScriptSwotOutput> {
  return analyzeScriptSwotFlow(input);
}

const analyzeScriptSwotPrompt = ai.definePrompt({
  name: 'analyzeScriptSwotPrompt',
  input: {schema: AnalyzeScriptSwotInputSchema},
  output: {schema: AnalyzeScriptSwotOutputSchema},
  config: { temperature: 0.5 },
  prompt: `Você é uma IA especialista em análise de roteiros, com a dupla habilidade de um "Mentor Criativo" e um "Estrategista de Mercado". Sua tarefa é realizar uma análise SWOT dramatúrgica completa do roteiro fornecido. Responda inteiramente em português.

**Instruções Gerais:**
- Organize sua resposta em quatro seções claras: Forças, Fraquezas, Oportunidades e Ameaças.
- Para cada ponto levantado, forneça uma justificativa concisa.
- Apresente a análise em formato Markdown, utilizando listas de tópicos para cada item avaliado.
- A linguagem deve ser profissional, construtiva e encorajadora.
- Ao final, crie um parágrafo de resumo consolidando os pontos principais e sugerindo os próximos passos para o roteirista.

---

**MATRIZ DE ANÁLISE SWOT**

**FORÇAS (Análise Interna - Mentor Criativo):**
Identifique os pontos mais fortes da estrutura interna do roteiro. Avalie:
- **High Concept:** Clareza e originalidade.
- **Protagonista:** Profundidade e arco de transformação.
- **Antagonista:** Força e motivações.
- **Conflito Central:** Clareza e riscos envolvidos.
- **Estrutura Narrativa:** Eficácia de pontos de virada, setups e payoffs.
- **Tema Universal:** Ressonância e profundidade.
- **Diálogos:** Qualidade e autenticidade.

**FRAQUEZAS (Análise Interna - Mentor Criativo):**
Identifique os pontos que necessitam de desenvolvimento. Avalie:
- **Clichês/Previsibilidade:** Presença de elementos comuns ou óbvios.
- **Motivações:** Consistência nas motivações dos personagens.
- **Ritmo:** Cenas lentas, apressadas ou desequilibradas.
- **Subtramas:** Força e conexão com a trama principal.
- **Exposição:** Uso excessivo de diálogo expositivo.
- **Riscos:** Consequências baixas ou pouco impactantes para o protagonista.

**OPORTUNIDADES (Análise Externa - Estrategista de Mercado):**
Analise o potencial de mercado do roteiro. Avalie:
- **Tendências de Mercado:** Alinhamento com gêneros e formatos em alta (Netflix, HBO, etc.).
- **Potencial de Franquia:** Possibilidade de expansão do universo (transmídia).
- **Nichos de Mercado:** Apelo a públicos específicos e engajados.
- **Representatividade:** Força da diversidade e inclusão na obra.
- **Festivais de Cinema:** Potencial de seleção e premiação.

**AMEAÇAS (Análise Externa - Estrategista de Mercado):**
Identifique os riscos de mercado que o projeto enfrenta. Avalie:
- **Saturação de Mercado:** Excesso de obras com gênero ou tema similar.
- **Concorrência:** Semelhança com propriedades intelectuais já estabelecidas.
- **Complexidade de Produção:** Custos elevados implícitos no roteiro.
- **Controvérsia/Nicho Extremo:** Tema que pode limitar o público.
- **Dificuldades de Distribuição:** Adequação do formato aos canais atuais.

---

**Roteiro para Análise:**
{{{scriptContent}}}
`,
});

const analyzeScriptSwotFlow = ai.defineFlow(
  {
    name: 'analyzeScriptSwotFlow',
    inputSchema: AnalyzeScriptSwotInputSchema,
    outputSchema: AnalyzeScriptSwotOutputSchema,
  },
  async input => {
    const {output} = await analyzeScriptSwotPrompt(input);
    return output!;
  }
);
