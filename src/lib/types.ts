import type {
  AnalyzeScriptNarrativeOutput,
} from '@/ai/flows/analyze-script-narrative';
import type {
  AnalyzeScriptHeroJourneyOutput,
} from '@/ai/flows/analyze-script-hero-journey';
import type {
  AnalyzeScriptCharactersOutput,
} from '@/ai/flows/analyze-script-characters';
import type {
  AnalyzeScriptRepresentationOutput,
} from '@/ai/flows/analyze-script-representation';
import type {
  AnalyzeScriptMarketOutput,
} from '@/ai/flows/analyze-script-market';
import type {
  GeneratePitchingDocumentOutput
} from '@/ai/flows/generate-pitching-document';


export type Script = {
  id: string;
  name: string;
  format: 'Longa-metragem' | 'Curta-metragem' | 'Série' | 'Outro';
  genre: string;
  content: string;
  analysis: {
    narrative?: AnalyzeScriptNarrativeOutput;
    heroJourney?: AnalyzeScriptHeroJourneyOutput;
    characters?: AnalyzeScriptCharactersOutput;
    representation?: AnalyzeScriptRepresentationOutput;
    market?: AnalyzeScriptMarketOutput;
    pitchingDocument?: GeneratePitchingDocumentOutput;
  };
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
