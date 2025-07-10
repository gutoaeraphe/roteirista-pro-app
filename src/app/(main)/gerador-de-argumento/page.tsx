
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";


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
  tones: z.array(z.string()),
  customTone: z.string(),
  genres: z.array(z.string()),
  customGenre: z.string(),
  conflicts: z.array(z.string()),
  customConflict: z.string(),
  narrativeStyles: z.array(z.string()),
  customNarrativeStyle: z.string(),
  universes: z.array(z.string()),
  customUniverse: z.string(),
});
type ArgumentFormData = z.infer<typeof argumentSchema>;

const OptionsSelector = ({ name, options, label, control }: { name: string, options: {name: string, description: string}[], label: string, control: any }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
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
                                    className="flex flex-col p-4 border rounded-lg space-y-2"
                                >
                                    <div className="flex flex-row items-center space-x-3">
                                        <FormControl>
                                            <Checkbox
                                            checked={field.value?.includes(item.name)}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                ? field.onChange([...(field.value || []), item.name])
                                                : field.onChange(
                                                    field.value?.filter(
                                                        (value: string) => value !== item.name
                                                    )
                                                    );
                                            }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-semibold text-sm">
                                            {item.name}
                                        </FormLabel>
                                    </div>
                                    <FormDescription className="text-xs ml-7">
                                        {item.description}
                                    </FormDescription>
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

export default function GeradorDeArgumentoPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ArgumentFormData>({
    resolver: zodResolver(argumentSchema),
    defaultValues: {
      tones: [], customTone: '',
      genres: [], customGenre: '',
      conflicts: [], customConflict: '',
      narrativeStyles: [], customNarrativeStyle: '',
      universes: [], customUniverse: '',
    },
  });

  const onSubmit = async (data: ArgumentFormData) => {
    // Logic will be implemented in the next steps
    console.log(data);
    toast({ title: "Argumento Compilado (em breve)", description: "A lógica de compilação será implementada a seguir." });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Gerador de Argumento</h1>
        <p className="text-muted-foreground">Um guia estruturado para auxiliar você na criação da base de sua história.</p>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="tone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-4">
                <TabsTrigger value="tone">Tom</TabsTrigger>
                <TabsTrigger value="genre">Gênero</TabsTrigger>
                <TabsTrigger value="conflict">Conflito</TabsTrigger>
                <TabsTrigger value="style">Estilo</TabsTrigger>
                <TabsTrigger value="universe">Universo</TabsTrigger>
              </TabsList>
              
              <Card>
                <CardContent className="pt-6">
                   <TabsContent value="tone">
                        <OptionsSelector name="tones" options={tones} label="Qual é o Sentimento da História?" control={form.control} />
                        <Separator className="my-6" />
                        <FormField control={form.control} name="customTone" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio tom:</FormLabel><FormControl><Input placeholder="Ex: Absurdista e Filosófico" {...field} /></FormControl></FormItem>)} />
                   </TabsContent>

                   <TabsContent value="genre">
                       <OptionsSelector name="genres" options={genres} label="Qual é a Categoria da História?" control={form.control} />
                        <Separator className="my-6" />
                        <FormField control={form.control} name="customGenre" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio gênero:</FormLabel><FormControl><Input placeholder="Ex: Comédia de Terror Espacial" {...field} /></FormControl></FormItem>)} />
                   </TabsContent>

                   <TabsContent value="conflict">
                       <OptionsSelector name="conflicts" options={conflicts} label="Qual é o Motor da História?" control={form.control} />
                        <Separator className="my-6" />
                        <FormField control={form.control} name="customConflict" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio conflito:</FormLabel><FormControl><Input placeholder="Ex: O peso da imortalidade" {...field} /></FormControl></FormItem>)} />
                   </TabsContent>

                   <TabsContent value="style">
                       <OptionsSelector name="narrativeStyles" options={narrativeStyles} label="Qual é a Estrutura da História?" control={form.control} />
                        <Separator className="my-6" />
                        <FormField control={form.control} name="customNarrativeStyle" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio estilo:</FormLabel><FormControl><Input placeholder="Ex: Narrativa em primeira pessoa não confiável" {...field} /></FormControl></FormItem>)} />
                   </TabsContent>
                   
                   <TabsContent value="universe">
                       <OptionsSelector name="universes" options={universes} label="Onde a História Acontece?" control={form.control} />
                        <Separator className="my-6" />
                        <FormField control={form.control} name="customUniverse" render={({ field }) => (<FormItem><FormLabel>Ou adicione seu próprio universo:</FormLabel><FormControl><Input placeholder="Ex: Uma biblioteca que contém todos os livros já escritos" {...field} /></FormControl></FormItem>)} />
                   </TabsContent>
                </CardContent>
              </Card>
            </Tabs>

            <div className="flex justify-end">
                <Button type="submit" disabled={true}>
                    Compilar Argumento
                    <Sparkles className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
}
