
import type {
  AnalyzeScriptStructureOutput,
} from '@/ai/flows/analyze-script-structure';
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

export type UserProfile = {
    uid: string;
    email: string | null;
    name: string | null;
    photoURL?: string;
    isAdmin: boolean;
};

export type Script = {
  id: string;
  name: string;
  format: string;
  genre: string;
  content: string;
  analysis: {
    structure?: AnalyzeScriptStructureOutput;
    heroJourney?: AnalyzeScriptHeroJourneyOutput;
    characters?: AnalyzeScriptCharactersOutput;
    representation?: AnalyzeScriptRepresentationOutput;
    market?: AnalyzeScriptMarketOutput;
    pitchingDocument?: GeneratePitchingDocumentOutput;
    scriptDoctor?: ChatMessage[];
  };
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
