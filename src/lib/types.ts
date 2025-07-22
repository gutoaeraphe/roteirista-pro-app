
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
import type {
  GenerateAudiencePersonaOutput
} from '@/ai/flows/generate-audience-persona';
import type {
    AnalyzeScriptFromPersonaOutput
} from '@/ai/flows/analyze-script-from-persona';
import type {
    AnalyzeScriptSwotOutput
} from '@/ai/flows/analyze-script-swot';
import type {
    AnalyzeScriptTchekhovOutput
} from '@/ai/flows/analyze-script-tchekhov';
import type {
    AnalyzeReceptionAndEngagementOutput
} from '@/ai/flows/analyze-reception-engagement';
import type {
    AnalyzeScriptConflictsOutput
} from '@/ai/flows/analyze-script-conflicts';


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
    audienceTest?: {
        persona: GenerateAudiencePersonaOutput;
        analysis: AnalyzeScriptFromPersonaOutput;
    };
    swot?: AnalyzeScriptSwotOutput;
    tchekhov?: AnalyzeScriptTchekhovOutput;
    receptionAndEngagement?: AnalyzeReceptionAndEngagementOutput;
    conflicts?: AnalyzeScriptConflictsOutput;
  };
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
