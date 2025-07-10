
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { generateStoryArgument } from "@/ai/flows/generate-story-argument";
import { Sparkles, PenSquare, FileText, Check, PlusCircle, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const tones = [
    "Sombrio", "Leve", "Épico", "Íntimo", "Cômico", "Trágico", "Sarcástico/Irônico",
    "Cínico", "Melancólico", "Inspirador/Otimista", "Tenso/Apreensivo", "Misterioso",
    "Absurdo/Surreal", "Poético/Lírico", "Realista/Naturalista", "Nostálgico",
    "Aventureiro", "Aterrador", "Farsesco", "Grotesco"
];
const genres = [
    "Ficção Científica", "Fantasia", "Terror", "Suspense (Thriller)", "Ação", "Aventura",
    "Comédia", "Drama", "Romance", "Policial/Crime", "Mistério", "Faroeste (Western)",
    "Musical", "Guerra", "Histórico/Épico", "Biografia (Biopic)", "Comédia Romântica",
    "Thriller Psicológico", "Super-herói", "Falso Documentário (Mockumentary)"
];
const conflicts = [
    "Redenção", "Sobrevivência", "Vingança", "Poder", "Amor Proibido", "Justiça",
    "Liberdade", "Ganância/Dinheiro", "Fé vs. Dúvida", "Tradição vs. Mudança",
    "Busca por Identidade", "Dever vs. Desejo", "Perda e Luto", "Segredos e Mentiras",
    "Ambição Cega", "Natureza vs. Criação", "Isolamento vs. Comunidade", "Sacrifício Pessoal",
    "Humanidade vs. Tecnologia", "Ordem vs. Caos"
];
const narrativeStyles = [
    "Jornada Clássica do Herói", "Estrutura de Três Atos", "Kishōtenketsu", "Dorama",
    "Narrativa Não-Linear", "Narrativa Paralela", "Narrativa em Mosaico", "Rashomon",
    "In Media Res", "Narrativa em Círculo", "Slice of Life (Retrato do Cotidiano)",
    "Foreshadowing (Prefiguração)", "Ironia Dramática", "Red Herring", "Efeito MacGuffin"
];
const universes = [
    "Futuro Tecnológico Avançado", "Reino de Fantasia", "Pequena Cidade ou Vilarejo",
    "Mundo Pós-Catástrofe", "Jornada Espacial de Longa Duração", "Passado Histórico Relevante",
    "Ambiente de Crime e Conspiração", "Instituição de Ensino ou Treinamento",
    "Mundo Digital ou Virtual", "Terra Selvagem e Inexplorada", "Plano Mental ou Espiritual",
    "Microcosmo Isolado", "Organização Secreta e Poderosa", "Mundo Baseado em Mitologia",
    "Centro de Poder e Intriga Política", "Mundo Alienígena Desconhecido", "Linha do Tempo Alternativa",
    "Lugar Abandonado ou Esquecido", "Comunidade Nômade ou Itinerante", "Zona de Guerra ou Grande Conflito"
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

const OptionsSelector = ({ name, options, label, control }: { name: string, options: string[], label: string, control: any }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <div className="mb-4">
                    <FormLabel className="text-base font-semibold">{label}</FormLabel>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {options.map((item) => (
                        <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item])
                                            : field.onChange(field.value?.filter((value: string) => value !== item));
                                    }}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
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
