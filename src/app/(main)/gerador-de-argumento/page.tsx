

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, RefreshCcw, ThumbsUp, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import TextareaAutosize from 'react-textarea-autosize';
import { useRouter } from "next/navigation";

import { refineTheme } from '@/ai/flows/refine-theme-flow';
import { generateThemeSuggestions } from '@/ai/flows/generate-theme-suggestions-flow';
import { refineCharacterProfile } from '@/ai/flows/refine-character-profile-flow';
import { generateNarrativeDetails } from '@/ai/flows/generate-narrative-details-flow';
import { compileStoryArgument } from '@/ai/flows/compile-story-argument-flow';

const tones = [
    { name: "Sombrio", description: "Pesado, sério, com elementos perturbadores." },
    { name: "Leve", description: "Despreocupado, otimista e fácil de assistir." },
    { name: "Épico", description: "Grandioso, de grande escala, com temas heroicos." },
    { name: "Íntimo", description: "Focado em poucos personagens e em seus conflitos internos." },
    { name: "Cômico", description: "Engraçado, com o objetivo de fazer rir." },
    { name: "Trágico", description: "Termina em desastre para o protagonista; inspira pena e medo." },
    { name: "Sarcástico/Irônico", description: "Usa o humor ácido e a zombaria para criticar." },
    { name: "Cínico", description: "Descrente da bondade e das motivações humanas." },
    { name: "Melancólico", description: "Triste, nostálgico e pensativo." },
    { name: "Inspirador/Otimista", description: "Eleva o espírito e celebra o potencial humano." },
    { name: "Tenso/Apreensivo", description: "Cria uma sensação constante de suspense e perigo." },
    { name: "Misterioso", description: "Enigmático, cheio de segredos a serem revelados." },
    { name: "Absurdo/Surreal", description: "Desafia a lógica e a realidade de forma cômica ou filosófica." },
    { name: "Poético/Lírico", description: "Focado na beleza da linguagem e das imagens." },
    { name: "Realista/Naturalista", description: "Retrata a vida como ela é, sem filtros ou exageros." },
    { name: "Nostálgico", description: "Ancorado em uma saudade de um tempo passado." },
    { name: "Aventureiro", description: "Cheio de energia, exploração e descobertas." },
    { name: "Aterrador", description: "Focado em causar medo e pavor extremo." },
    { name: "Farsesco", description: "Comédia exagerada, baseada em situações improváveis e mal-entendidos." },
    { name: "Grotesco", description: "Mistura o bizarro, o feio e o cômico de forma desconfortável." }
];
const genres = [
    { name: "Ficção Científica", description: "Explora conceitos de ciência e tecnologia futura." },
    { name: "Fantasia", description: "Elementos mágicos e sobrenaturais em um mundo imaginário." },
    { name: "Terror", description: "O objetivo principal é causar medo, choque ou repulsa." },
    { name: "Suspense (Thriller)", description: "Cria tensão, ansiedade e expectativa no público." },
    { name: "Ação", description: "Focado em sequências de combate, perseguições e feitos físicos." },
    { name: "Aventura", description: "Uma jornada perigosa em busca de um objetivo ou tesouro." },
    { name: "Comédia", description: "Leve e humorístico, geralmente com um final feliz." },
    { name: "Drama", description: "Conflitos emocionais sérios e realistas entre personagens." },
    { name: "Romance", description: "O desenvolvimento de um relacionamento amoroso é o foco central." },
    { name: "Policial/Crime", description: "Centrado na investigação de um crime por parte da lei ou dos criminosos." },
    { name: "Mistério", description: "Um quebra-cabeça a ser resolvido pelo protagonista e pelo público." },
    { name: "Faroeste (Western)", description: "Ambientado no Velho Oeste americano, com cowboys e pioneiros." },
    { name: "Musical", description: "A narrativa é contada ou interrompida por canções e danças." },
    { name: "Guerra", description: "Ambientado durante um conflito militar real ou fictício." },
    { name: "Histórico/Épico", description: "Baseado em eventos ou figuras históricas importantes." },
    { name: "Biografia (Biopic)", description: "Dramatiza a vida de uma pessoa real e notável." },
    { name: "Comédia Romântica", description: "Mistura humor leve com uma trama de amor." },
    { name: "Thriller Psicológico", description: "Suspense focado na instabilidade mental e emocional dos personagens." },
    { name: "Super-herói", description: "Centrado em personagens com habilidades sobre-humanas lutando pelo bem." },
    { name: "Falso Documentário (Mockumentary)", description: "Filma a ficção no estilo de um documentário para criar humor ou realismo." }
];
const conflicts = [
    { name: "Redenção", description: "Buscar perdão ou reparação por um erro grave do passado." },
    { name: "Sobrevivência", description: "Lutar contra a natureza, a sociedade ou a si mesmo para continuar vivo." },
    { name: "Vingança", description: "A busca por retaliação contra quem causou um mal ao protagonista." },
    { name: "Poder", description: "A luta para obter, manter ou desafiar o controle sobre outros." },
    { name: "Amor Proibido", description: "Um romance que desafia as regras sociais, familiares ou éticas." },
    { name: "Justiça", description: "O combate contra um sistema, indivíduo ou sociedade corrupta/injusta." },
    { name: "Liberdade", description: "A fuga de uma opressão física, mental, social ou política." },
    { name: "Ganância/Dinheiro", description: "A ambição desmedida por riqueza e suas trágicas consequências." },
    { name: "Fé vs. Dúvida", description: "Um conflito interno sobre crenças espirituais, filosóficas ou pessoais." },
    { name: "Tradição vs. Mudança", description: "O choque entre os valores antigos e as novas ideias." },
    { name: "Busca por Identidade", description: "A jornada de um personagem para descobrir quem ele realmente é." },
    { name: "Dever vs. Desejo", description: "O conflito entre a responsabilidade e a vontade pessoal." },
    { name: "Perda e Luto", description: "O processo de aprender a lidar com a morte ou o fim de algo importante." },
    { name: "Segredos e Mentiras", description: "As consequências de esconder ou revelar uma verdade impactante." },
    { name: "Ambição Cega", description: "A perseguição de um objetivo a qualquer custo, mesmo que antiético." },
    { name: "Natureza vs. Criação", description: "O debate sobre se somos moldados pela genética ou pelo ambiente." },
    { name: "Isolamento vs. Comunidade", description: "A tensão entre a necessidade de pertencer e o desejo de se afastar." },
    { name: "Sacrifício Pessoal", description: "Abrir mão de algo muito importante por um bem maior ou por outra pessoa." },
    { name: "Humanidade vs. Tecnologia", description: "Os perigos e dilemas morais do avanço tecnológico." },
    { name: "Ordem vs. Caos", description: "A luta para manter a estrutura e as regras em um mundo que tende à anarquia." }
];
const narrativeStyles = [
    { name: "Jornada Clássica do Herói", description: "A estrutura de 12 passos de transformação popularizada por Joseph Campbell." },
    { name: "Estrutura de Três Atos", description: "A organização mais comum: Apresentação, Confronto e Resolução." },
    { name: "Kishōtenketsu", description: "Estrutura asiática de 4 atos (Introdução, Desenvolvimento, Reviravolta, Conclusão) que não depende de conflito direto." },
    { name: "Dorama", description: "Focado em desenvolvimento emocional, relacionamentos e reviravoltas dramáticas, geralmente em episódios." },
    { name: "Narrativa Não-Linear", description: "A história é contada fora da ordem cronológica (ex: Pulp Fiction)." },
    { name: "Narrativa Paralela", description: "Duas ou mais tramas se desenvolvem simultaneamente, conectando-se no clímax." },
    { name: "Narrativa em Mosaico", description: "Várias tramas aparentemente desconexas que se conectam no final (ex: Crash)." },
    { name: "Rashomon", description: "A mesma história é contada a partir de múltiplos pontos de vista contraditórios." },
    { name: "In Media Res", description: "A história começa no meio da ação, com o passado sendo revelado aos poucos." },
    { name: "Narrativa em Círculo", description: "A história termina onde começou, mas com o protagonista transformado." },
    { name: "Slice of Life (Retrato do Cotidiano)", description: "Foco em momentos aparentemente mundanos da vida, sem uma trama grandiosa." },
    { name: "Foreshadowing (Prefiguração)", description: "Pistas sutis plantadas no início para antecipar eventos futuros." },
    { name: "Ironia Dramática", description: "O público sabe de algo crucial que os personagens não sabem." },
    { name: "Red Herring", description: "Uma pista falsa inserida deliberadamente para enganar o público." },
    { name: "Efeito MacGuffin", description: "A trama gira em torno da busca por um objeto, cuja natureza é menos importante que a jornada." }
];
const universes = [
    { name: "Futuro Tecnológico Avançado", description: "Cenários de alta tecnologia, seja em uma utopia, distopia ou cyberpunk." },
    { name: "Reino de Fantasia", description: "Um mundo com regras próprias, onde magia e mitos são comuns." },
    { name: "Pequena Cidade ou Vilarejo", description: "Um lugar isolado onde todos se conhecem, ideal para segredos e dramas." },
    { name: "Mundo Pós-Catástrofe", description: "A civilização após um colapso, onde as antigas regras não se aplicam." },
    { name: "Jornada Espacial de Longa Duração", description: "O confinamento e os desafios de uma viagem pelo cosmos." },
    { name: "Passado Histórico Relevante", description: "Uma era passada que serve de pano de fundo e influencia a trama." },
    { name: "Ambiente de Crime e Conspiração", description: "Os bastidores do submundo ou da alta sociedade." },
    { name: "Instituição de Ensino ou Treinamento", description: "Uma escola, academia ou campo militar onde o aprendizado molda os personagens." },
    { name: "Mundo Digital ou Virtual", description: "Uma realidade simulada, ciberespaço ou o interior de um game." },
    { name: "Terra Selvagem e Inexplorada", description: "Uma região de fronteira, selva ou deserto, longe da civilização." },
    { name: "Plano Mental ou Espiritual", description: "Cenários que acontecem dentro da mente, dos sonhos ou de memórias." },
    { name: "Microcosmo Isolado", description: "Um ambiente único e fechado (navio, ilha, bunker) que força interações." },
    { name: "Organização Secreta e Poderosa", description: "Os corredores de uma sociedade ou culto que manipula eventos." },
    { name: "Mundo Baseado em Mitologia", description: "Um universo regido pelas lendas e deuses de culturas antigas." },
    { name: "Centro de Poder e Intriga Política", description: "Os bastidores da realeza ou do governo, com jogos de influência." },
    { name: "Mundo Alienígena Desconhecido", description: "Um planeta com ecossistemas, espécies e culturas estranhas." },
    { name: "Linha do Tempo Alternativa", description: "Uma realidade onde a história tomou um rumo diferente." },
    { name: "Lugar Abandonado ou Esquecido", description: "As ruínas de uma cidade ou um local que guarda ecos do passado." },
    { name: "Comunidade Nômade ou Itinerante", description: "Um grupo que vive em constante movimento (um circo, uma tribo)." },
    { name: "Zona de Guerra ou Grande Conflito", description: "Um cenário dominado pela batalha, tensão e suas consequências." }
];

const argumentSchema = z.object({
  tones: z.array(z.string()).optional(),
  customTone: z.string().optional(),
  genres: z.array(z.string()).optional(),
  customGenre: z.string().optional(),
  conflicts: z.array(z.string()).optional(),
  customConflict: z.string().optional(),
  narrativeStyles: z.array(z.string()).optional(),
  customNarrativeStyle: z.string().optional(),
  universes: z.array(z.string()).optional(),
  customUniverse: z.string().optional(),
  initialTheme: z.string().optional(),
  refinedTheme: z.string().optional(),
  themeSuggestions: z.array(z.string()).optional(),
  selectedSuggestions: z.array(z.string()).optional(),
  protagonistInitialConcept: z.string().optional(),
  protagonistPsychologicalProfile: z.string().optional(),
  protagonistStrengths: z.string().optional(),
  protagonistWeaknesses: z.string().optional(),
  protagonistInternalMotivations: z.string().optional(),
  protagonistExternalMotivations: z.string().optional(),
  protagonistSocialMotivations: z.string().optional(),
  protagonistProfile: z.string().optional(),
  antagonistInitialConcept: z.string().optional(),
  antagonistPsychologicalProfile: z.string().optional(),
  antagonistStrengths: z.string().optional(),
  antagonistWeaknesses: z.string().optional(),
  antagonistInternalMotivations: z.string().optional(),
  antagonistExternalMotivations: z.string().optional(),
  antagonistSocialMotivations: z.string().optional(),
  antagonistProfile: z.string().optional(),
  narrativeFundamentalConcept: z.string().optional(),
  narrativePlotObjective: z.string().optional(),
  narrativeCharacterObjective: z.string().optional(),
  narrativePlotTwist: z.string().optional(),
  narrativeKeyObjects: z.string().optional(),
  narrativeImportantPlaces: z.string().optional(),
  narrativePredominantFeelings: z.string().optional(),
  narrativeDetails: z.string().optional(),
});
type ArgumentFormData = z.infer<typeof argumentSchema>;

const OptionsSelector = ({ name, options, label, control }: { name: keyof ArgumentFormData, options: {name: string, description: string}[], label: string, control: any }) => (
    <FormField
        control={control}
        name={name}
        render={() => (
            <FormItem>
                <div className="mb-4">
                    <FormLabel className="text-base font-semibold">{label}</FormLabel>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {options.map((item) => (
                       <FormField
                            key={item.name}
                            control={control}
                            name={name}
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.name}
                                    className="flex flex-col p-4 border rounded-lg space-y-2 bg-muted/20"
                                >
                                    <div className="flex flex-row items-center space-x-3">
                                        <FormControl>
                                            <Checkbox
                                            checked={field.value?.includes(item.name)}
                                            onCheckedChange={(checked) => {
                                                const currentValues = Array.isArray(field.value) ? field.value : [];
                                                return checked
                                                ? field.onChange([...currentValues, item.name])
                                                : field.onChange(
                                                    currentValues?.filter(
                                                        (value: string) => value !== item.name
                                                    )
                                                    );
                                            }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-semibold text-sm cursor-pointer">
                                            {item.name}
                                        </FormLabel>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-7">
                                        {item.description}
                                    </p>
                                </FormItem>
                                );
                            }}
                        />
                    ))}
                </div>
                <FormMessage />
            </FormItem>
        )}
    />
);

const SectionCard = ({ title, description, children, ...props }: { title: string, description: string, children: React.ReactNode, [key: string]: any }) => (
    <Card {...props}>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

const LabeledTextarea = ({ name, label, placeholder, control, minRows = 3 }: { name: keyof ArgumentFormData, label: string, placeholder: string, control: any, minRows?: number}) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <TextareaAutosize
                        minRows={minRows}
                        placeholder={placeholder}
                        {...field}
                        className="w-full bg-muted/50 p-2 rounded"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export default function GeradorDeArgumentoPage() {
    const [loading, setLoading] = useState<{[key:string]: boolean}>({});
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<ArgumentFormData>({
    resolver: zodResolver(argumentSchema),
    defaultValues: {
      tones: [], customTone: '',
      genres: [], customGenre: '',
      conflicts: [], customConflict: '',
      narrativeStyles: [], customNarrativeStyle: '',
      universes: [], customUniverse: '',
      initialTheme: '', refinedTheme: '', themeSuggestions: [], selectedSuggestions: [],
      protagonistInitialConcept: '', protagonistPsychologicalProfile: '', protagonistStrengths: '', protagonistWeaknesses: '', protagonistInternalMotivations: '', protagonistExternalMotivations: '', protagonistSocialMotivations: '', protagonistProfile: '',
      antagonistInitialConcept: '', antagonistPsychologicalProfile: '', antagonistStrengths: '', antagonistWeaknesses: '', antagonistInternalMotivations: '', antagonistExternalMotivations: '', antagonistSocialMotivations: '', antagonistProfile: '',
      narrativeFundamentalConcept: '', narrativePlotObjective: '', narrativeCharacterObjective: '', narrativePlotTwist: '', narrativeKeyObjects: '', narrativeImportantPlaces: '', narrativePredominantFeelings: '', narrativeDetails: '',
    },
  });

  const { watch, setValue, getValues, control } = form;

  const getStoryContext = (upTo: 'concepts' | 'theme' | 'characters' | 'all') => {
      const allData = getValues();
      const context: any = {};
      
      const concepts = {
          tones: allData.tones,
          customTone: allData.customTone,
          genres: allData.genres,
          customGenre: allData.customGenre,
          conflicts: allData.conflicts,
          customConflict: allData.customConflict,
          narrativeStyles: allData.narrativeStyles,
          customNarrativeStyle: allData.customNarrativeStyle,
          universes: allData.universes,
          customUniverse: allData.customUniverse,
      };

      if (upTo === 'concepts' || upTo === 'theme' || upTo === 'characters' || upTo === 'all') {
          context.concepts = concepts;
      }
      if (upTo === 'theme' || upTo === 'characters' || upTo === 'all') {
          context.theme = {
              initialTheme: allData.initialTheme,
              refinedTheme: allData.refinedTheme,
              selectedSuggestions: allData.selectedSuggestions,
          }
      }
      if (upTo === 'characters' || upTo === 'all') {
         context.characters = {
            protagonistProfile: allData.protagonistProfile,
            antagonistProfile: allData.antagonistProfile,
        }
      }

      return context;
  }

  const handleRefineTheme = async () => {
    const initialTheme = watch('initialTheme');
    if (!initialTheme) return;
    setLoading(prev => ({ ...prev, theme: true }));
    try {
        const storyContext = getStoryContext('concepts');
        const result = await refineTheme({ idea: initialTheme, storyContext });
        setValue('refinedTheme', result.refinedTheme);
    } catch (e) {
        toast({ title: "Erro", description: "Não foi possível aprimorar o tema."});
    } finally {
        setLoading(prev => ({ ...prev, theme: false }));
    }
  }

  const handleGenerateSuggestions = async () => {
    const mainTheme = watch('refinedTheme') || watch('initialTheme');
    if (!mainTheme) return;
    setLoading(prev => ({ ...prev, suggestions: true }));
    try {
        const storyContext = getStoryContext('concepts');
        const result = await generateThemeSuggestions({ mainTheme, count: 4, storyContext });
        setValue('themeSuggestions', result.suggestions);
    } catch (e) {
        toast({ title: "Erro", description: "Não foi possível gerar sugestões."});
    } finally {
        setLoading(prev => ({ ...prev, suggestions: false }));
    }
  }

  const handleRegenerateSuggestion = async (index: number) => {
    const mainTheme = watch('refinedTheme') || watch('initialTheme');
    if (!mainTheme) return;
    setLoading(prev => ({ ...prev, [`suggestion_${index}`]: true }));
    try {
        const storyContext = getStoryContext('concepts');
        const result = await generateThemeSuggestions({ mainTheme, count: 1, storyContext });
        const currentSuggestions = watch('themeSuggestions') || [];
        currentSuggestions[index] = result.suggestions[0];
        setValue('themeSuggestions', [...currentSuggestions]);
    } catch (e) {
        toast({ title: "Erro", description: "Não foi possível gerar a sugestão."});
    } finally {
        setLoading(prev => ({ ...prev, [`suggestion_${index}`]: false }));
    }
  }

  const handleRefineCharacter = async (type: 'protagonist' | 'antagonist') => {
      const fieldMapping = {
        protagonist: {
            concept: 'protagonistInitialConcept',
            profile: 'protagonistProfile',
            psychological: 'protagonistPsychologicalProfile',
            strengths: 'protagonistStrengths',
            weaknesses: 'protagonistWeaknesses',
            internal: 'protagonistInternalMotivations',
            external: 'protagonistExternalMotivations',
            social: 'protagonistSocialMotivations',
        },
        antagonist: {
            concept: 'antagonistInitialConcept',
            profile: 'antagonistProfile',
            psychological: 'antagonistPsychologicalProfile',
            strengths: 'antagonistStrengths',
            weaknesses: 'antagonistWeaknesses',
            internal: 'antagonistInternalMotivations',
            external: 'antagonistExternalMotivations',
            social: 'antagonistSocialMotivations',
        }
    };
    
    const fields = fieldMapping[type];
    const characterConcept = `
        Conceito: ${watch(fields.concept as keyof ArgumentFormData)}
        Perfil Psicológico: ${watch(fields.psychological as keyof ArgumentFormData)}
        Forças: ${watch(fields.strengths as keyof ArgumentFormData)}
        Fraquezas: ${watch(fields.weaknesses as keyof ArgumentFormData)}
        Motivações Internas: ${watch(fields.internal as keyof ArgumentFormData)}
        Motivações Externas: ${watch(fields.external as keyof ArgumentFormData)}
        Motivações Sociais: ${watch(fields.social as keyof ArgumentFormData)}
    `.trim();

    if (characterConcept.replace(/\s/g, '').length < 10) { 
        toast({ title: "Aviso", description: "Forneça mais detalhes sobre o personagem para gerar um perfil." });
        return;
    }
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
        const storyContext = getStoryContext('theme');
        const result = await refineCharacterProfile({ concept: characterConcept, storyContext });
        setValue(fields.profile as keyof ArgumentFormData, result.detailedProfile);
    } catch (e) {
        toast({ title: "Erro", description: `Não foi possível aprimorar o ${type}.`});
    } finally {
        setLoading(prev => ({ ...prev, [type]: false }));
    }
  }
  
  const handleGenerateNarrative = async () => {
    const narrativeConcept = `
        Conceito Fundamental: ${watch('narrativeFundamentalConcept')}
        Objetivo da Trama: ${watch('narrativePlotObjective')}
        Objetivo do Personagem: ${watch('narrativeCharacterObjective')}
        Plot Twist: ${watch('narrativePlotTwist')}
        Objetos Chave: ${watch('narrativeKeyObjects')}
        Lugares Importantes: ${watch('narrativeImportantPlaces')}
        Sentimentos Predominantes: ${watch('narrativePredominantFeelings')}
    `.trim();

    if (narrativeConcept.replace(/\s/g, '').length < 10) { 
        toast({ title: "Aviso", description: "Forneça mais detalhes sobre a narrativa para gerar uma descrição." });
        return;
    }
    
    setLoading(prev => ({ ...prev, narrative: true }));
    try {
        const storyContext = getStoryContext('characters');
        const result = await generateNarrativeDetails({ concept: narrativeConcept, storyContext });
        setValue('narrativeDetails', result.narrativeDetails);
    } catch (e) {
        toast({ title: "Erro", description: "Não foi possível gerar os detalhes da narrativa."});
    } finally {
        setLoading(prev => ({ ...prev, narrative: false }));
    }
  }

  const onSubmit = async (data: ArgumentFormData) => {
    setLoading(prev => ({ ...prev, compile: true }));
    try {
        const result = await compileStoryArgument({ storyData: JSON.stringify(data) });
        if (typeof window !== 'undefined') {
            localStorage.setItem('generatedArgument', JSON.stringify(result.finalArgument));
            router.push('/argumento-gerado');
        }
    } catch (e) {
        console.error("Erro ao compilar argumento:", e);
        toast({ title: "Erro", description: "Não foi possível compilar o argumento final."});
    } finally {
        setLoading(prev => ({ ...prev, compile: false }));
    }
  };

  const tabsWithContent = [
    { value: "tone", label: "Tom" },
    { value: "genre", label: "Gênero" },
    { value: "conflict", label: "Conflito" },
    { value: "style", label: "Estilo" },
    { value: "universe", label: "Universo" },
    { value: "theme", label: "Tema" },
    { value: "characters", label: "Personagens" },
    { value: "narrative", label: "Narrativa" },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Gerador de Argumento</h1>
        <p className="text-muted-foreground">Um guia estruturado para auxiliar você na criação da base de sua história.</p>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="tone" className="w-full">
              <div className="overflow-x-auto pb-2">
                <TabsList className="grid w-full grid-cols-4 sm:grid-cols-4 md:flex md:w-auto">
                  {tabsWithContent.map(tab => <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">{tab.label}</TabsTrigger>)}
                </TabsList>
              </div>
              
              <div className="w-full mt-6">
                <TabsContent value="tone">
                    <Card>
                        <CardContent className="pt-6">
                            <OptionsSelector name="tones" options={tones} label="Qual é o Sentimento da História?" control={form.control} />
                            <Separator className="my-6" />
                            <FormField control={form.control} name="customTone" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio tom:</FormLabel><FormControl><Input placeholder="Ex: Absurdista e Filosófico" {...field} className="bg-muted/50" /></FormControl></FormItem>)} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="genre">
                    <Card>
                        <CardContent className="pt-6">
                            <OptionsSelector name="genres" options={genres} label="Qual é a Categoria da História?" control={form.control} />
                            <Separator className="my-6" />
                            <FormField control={form.control} name="customGenre" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio gênero:</FormLabel><FormControl><Input placeholder="Ex: Comédia de Terror Espacial" {...field} className="bg-muted/50" /></FormControl></FormItem>)} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="conflict">
                    <Card>
                        <CardContent className="pt-6">
                        <OptionsSelector name="conflicts" options={conflicts} label="Qual é o Motor da História?" control={form.control} />
                            <Separator className="my-6" />
                            <FormField control={form.control} name="customConflict" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio conflito:</FormLabel><FormControl><Input placeholder="Ex: O peso da imortalidade" {...field} className="bg-muted/50" /></FormControl></FormItem>)} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="style">
                    <Card>
                        <CardContent className="pt-6">
                        <OptionsSelector name="narrativeStyles" options={narrativeStyles} label="Qual é a Estrutura da História?" control={form.control} />
                            <Separator className="my-6" />
                            <FormField control={form.control} name="customNarrativeStyle" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio estilo:</FormLabel><FormControl><Input placeholder="Ex: Narrativa em primeira pessoa não confiável" {...field} className="bg-muted/50" /></FormControl></FormItem>)} />
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="universe">
                    <Card>
                        <CardContent className="pt-6">
                        <OptionsSelector name="universes" options={universes} label="Onde a História Acontece?" control={form.control} />
                            <Separator className="my-6" />
                            <FormField control={form.control} name="customUniverse" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio universo:</FormLabel><FormControl><Input placeholder="Ex: Uma biblioteca que contém todos os livros já escritos" {...field} className="bg-muted/50" /></FormControl></FormItem>)} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="theme">
                    <div className="space-y-6">
                        <SectionCard title="1. Tema Principal" description="Insira sua ideia inicial e use a IA para aprimorá-la, com base nas suas seleções anteriores.">
                             <FormField control={form.control} name="initialTheme" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ideia para o tema</FormLabel>
                                    <FormControl>
                                        <TextareaAutosize minRows={5} placeholder="Ex: Uma história sobre perdão e as consequências de não perdoar." {...field} className="w-full bg-muted/50 p-2 rounded" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="button" onClick={handleRefineTheme} disabled={loading.theme || !watch('initialTheme')} className="mt-4">
                                {loading.theme ? 'Aprimorando...' : 'Aprimorar com IA'} <Sparkles className="ml-2"/>
                            </Button>
                            {watch('refinedTheme') && <TextareaAutosize readOnly value={watch('refinedTheme') || ''} minRows={5} className="w-full mt-4 bg-muted p-2 rounded" />}
                        </SectionCard>

                         <SectionCard title="2. Explorar Facetas" description="Gere ideias relacionadas ao seu tema principal para enriquecer a história.">
                             <Button type="button" onClick={handleGenerateSuggestions} disabled={loading.suggestions || (!watch('initialTheme') && !watch('refinedTheme'))}>
                                {loading.suggestions ? 'Gerando...' : 'Gerar Sugestões'} <Sparkles className="ml-2"/>
                            </Button>
                            <FormField control={form.control} name="selectedSuggestions" render={() => (
                                <FormItem className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {(watch('themeSuggestions') || [...Array(4)]).slice(0, 4).map((suggestion, index) => (
                                       <Card key={index} className="flex flex-col">
                                            <CardContent className="pt-4 flex-grow">
                                                <p className="text-sm text-muted-foreground">{suggestion || `Sugestão ${index + 1}`}</p>
                                            </CardContent>
                                            <CardFooter className="flex items-center justify-between mt-auto pt-4">
                                                 <FormField
                                                    control={form.control}
                                                    name="selectedSuggestions"
                                                    render={({ field }) => (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant={field.value?.includes(suggestion) ? "default" : "secondary"}
                                                            onClick={() => {
                                                                const current = field.value || [];
                                                                const newSelection = current.includes(suggestion) ? current.filter(s => s !== suggestion) : [...current, suggestion];
                                                                field.onChange(newSelection);
                                                            }}
                                                            disabled={!suggestion}
                                                        >
                                                           <ThumbsUp className="mr-2"/> Selecionar
                                                        </Button>
                                                    )}
                                                />
                                                 <Button type="button" size="icon" variant="ghost" onClick={() => handleRegenerateSuggestion(index)} disabled={loading[`suggestion_${index}`]}>
                                                    <RefreshCcw className={loading[`suggestion_${index}`] ? 'animate-spin' : ''}/>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </FormItem>
                            )}/>
                        </SectionCard>
                    </div>
                </TabsContent>

                <TabsContent value="characters">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <SectionCard title="Protagonista" description="Forneça conceitos iniciais e a IA criará um perfil detalhado, considerando todo o contexto da história.">
                            <div className="space-y-4">
                                <LabeledTextarea name="protagonistInitialConcept" label="Conceito Inicial" placeholder="Ex: Nome, profissão, idade, etnia, sexualidade, etc." control={control} minRows={5}/>
                                <LabeledTextarea name="protagonistPsychologicalProfile" label="Perfil Psicológico" placeholder="Ex: Otimista mas ingênuo, ansioso..." control={control} minRows={5}/>
                                <LabeledTextarea name="protagonistStrengths" label="Forças" placeholder="Ex: Corajoso sob pressão, mestre da dedução..." control={control} minRows={5}/>
                                <LabeledTextarea name="protagonistWeaknesses" label="Fraquezas" placeholder="Ex: Teimosia, medo de altura..." control={control} minRows={5}/>
                                <LabeledTextarea name="protagonistInternalMotivations" label="Motivações Internas" placeholder="Ex: Provar seu valor para si mesmo..." control={control} minRows={5}/>
                                <LabeledTextarea name="protagonistExternalMotivations" label="Motivações Externas" placeholder="Ex: Uma dívida a ser paga..." control={control} minRows={5}/>
                                <LabeledTextarea name="protagonistSocialMotivations" label="Motivações Sociais" placeholder="Ex: Proteger sua comunidade..." control={control} minRows={5}/>
                            </div>
                            <Button type="button" onClick={() => handleRefineCharacter('protagonist')} disabled={loading.protagonist} className="mt-4">
                                {loading.protagonist ? 'Gerando...' : 'Gerar Perfil com IA'} <Sparkles className="ml-2"/>
                            </Button>
                             {watch('protagonistProfile') && <TextareaAutosize readOnly value={watch('protagonistProfile') || ''} minRows={5} className="w-full mt-4 bg-muted p-2 rounded" />}
                         </SectionCard>
                        <SectionCard title="Antagonista" description="Forneça conceitos iniciais e a IA criará um perfil detalhado, considerando todo o contexto da história.">
                           <div className="space-y-4">
                                <LabeledTextarea name="antagonistInitialConcept" label="Conceito Inicial" placeholder="Ex: Um CEO carismático e manipulador..." control={control} minRows={5}/>
                                <LabeledTextarea name="antagonistPsychologicalProfile" label="Perfil Psicológico" placeholder="Ex: Narcisista, acredita que os fins justificam os meios..." control={control} minRows={5}/>
                                <LabeledTextarea name="antagonistStrengths" label="Forças" placeholder="Ex: Inteligência estratégica, grande fortuna..." control={control} minRows={5}/>
                                <LabeledTextarea name="antagonistWeaknesses" label="Fraquezas" placeholder="Ex: Arrogância, subestima os outros..." control={control} minRows={5}/>
                                <LabeledTextarea name="antagonistInternalMotivations" label="Motivações Internas" placeholder="Ex: Medo de ser irrelevante..." control={control} minRows={5}/>
                                <LabeledTextarea name="antagonistExternalMotivations" label="Motivações Externas" placeholder="Ex: Pressão de acionistas..." control={control} minRows={5}/>
                                <LabeledTextarea name="antagonistSocialMotivations" label="Motivações Sociais" placeholder="Ex: Manter o status e a imagem pública..." control={control} minRows={5}/>
                            </div>
                            <Button type="button" onClick={() => handleRefineCharacter('antagonist')} disabled={loading.antagonist} className="mt-4">
                                {loading.antagonist ? 'Gerando...' : 'Gerar Perfil com IA'} <Sparkles className="ml-2"/>
                            </Button>
                            {watch('antagonistProfile') && <TextareaAutosize readOnly value={watch('antagonistProfile') || ''} minRows={5} className="w-full mt-4 bg-muted p-2 rounded" />}
                        </SectionCard>
                    </div>
                </TabsContent>

                <TabsContent value="narrative">
                     <SectionCard title="Detalhes da Narrativa" description="Forneça os conceitos e a IA irá expandi-los em uma descrição coesa, usando todo o contexto da história.">
                         <div className="space-y-4">
                            <LabeledTextarea name="narrativeFundamentalConcept" label="Conceito Fundamental" placeholder="Ex: Uma cidade onde a chuva nunca para." control={control} minRows={5}/>
                            <LabeledTextarea name="narrativePlotObjective" label="Objetivo da Trama" placeholder="Ex: Descobrir a origem da chuva eterna." control={control} minRows={5}/>
                            <LabeledTextarea name="narrativeCharacterObjective" label="Objetivo do Personagem" placeholder="Ex: Encontrar sua filha desaparecida." control={control} minRows={5}/>
                            <LabeledTextarea name="narrativePlotTwist" label="Plot Twist" placeholder="Ex: A filha é quem controla a chuva." control={control} minRows={5}/>
                            <LabeledTextarea name="narrativeKeyObjects" label="Objetos Chave" placeholder="Ex: Um guarda-chuva que repele a água de forma anormal." control={control} minRows={5}/>
                            <LabeledTextarea name="narrativeImportantPlaces" label="Lugares Importantes" placeholder="Ex: Uma torre de relógio parada." control={control} minRows={5}/>
                            <LabeledTextarea name="narrativePredominantFeelings" label="Sentimentos Predominantes" placeholder="Ex: Melancolia e esperança." control={control} minRows={5}/>
                         </div>
                        <Button type="button" onClick={handleGenerateNarrative} disabled={loading.narrative} className="mt-4">
                            {loading.narrative ? 'Gerando...' : 'Gerar Detalhes com IA'} <Sparkles className="ml-2"/>
                        </Button>
                        {watch('narrativeDetails') && <TextareaAutosize readOnly value={watch('narrativeDetails') || ''} minRows={8} className="w-full mt-4 bg-muted p-2 rounded" />}
                     </SectionCard>
                </TabsContent>

              </div>
            </Tabs>

            <div className="flex justify-end pt-8 border-t">
                <Button type="submit" disabled={loading.compile}>
                    {loading.compile ? 'Compilando...' : 'Compilar Argumento Final'}
                    <FileText className="ml-2" />
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
}
