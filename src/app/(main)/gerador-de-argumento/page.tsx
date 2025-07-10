"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { generateStoryArgument } from "@/ai/flows/generate-story-argument";
import { Sparkles, PenSquare, BookOpen, Users, Bot, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { GenerateStoryArgumentOutput } from "@/ai/flows/generate-story-argument";

const argumentSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  genre: z.string().min(1, "O gênero é obrigatório."),
  numberOfActs: z.coerce.number().min(1, "O número de atos deve ser pelo menos 1.").max(10),
});
type ArgumentFormData = z.infer<typeof argumentSchema>;

export default function GeradorDeArgumentoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateStoryArgumentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ArgumentFormData>({
    resolver: zodResolver(argumentSchema),
    defaultValues: { title: "", genre: "", numberOfActs: 3 },
  });

  const onSubmit = async (data: ArgumentFormData) => {
    setLoading(true);
    setResult(null);
    try {
      const generatedResult = await generateStoryArgument(data);
      setResult(generatedResult);
      toast({ title: "Argumento Gerado!", description: "Sua nova história foi criada com sucesso." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na Geração", description: "Não foi possível gerar o argumento. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Gerador de Argumento</h1>
        <p className="text-muted-foreground">Crie a base de uma nova história com a ajuda da IA.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PenSquare /> Detalhes da História</CardTitle>
          <CardDescription>Forneça as informações iniciais para a IA gerar seu argumento.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl><Input placeholder="Ex: O Último Amanhecer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gênero</FormLabel>
                    <FormControl><Input placeholder="Ex: Aventura, Suspense" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfActs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Atos</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Gerando..." : "Gerar Argumento"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {loading && <Skeleton className="w-full h-96" />}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Argumento Gerado para: {form.getValues("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="argument" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="argument"><FileText className="mr-2"/> Argumento</TabsTrigger>
                <TabsTrigger value="theme"><BookOpen className="mr-2"/> Tema</TabsTrigger>
                <TabsTrigger value="characters"><Users className="mr-2"/> Personagens</TabsTrigger>
                <TabsTrigger value="structure">Estrutura Narrativa</TabsTrigger>
              </TabsList>
              <TabsContent value="argument" className="mt-4 p-4 border rounded-lg bg-muted/50">
                 <p className="whitespace-pre-wrap">{result.argument}</p>
              </TabsContent>
              <TabsContent value="theme" className="mt-4 p-4 border rounded-lg">
                <p className="whitespace-pre-wrap">{result.theme}</p>
              </TabsContent>
              <TabsContent value="characters" className="mt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Users/> Protagonista</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{result.protagonistProfile}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Bot/> Antagonista</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{result.antagonistProfile}</p></CardContent>
                    </Card>
                 </div>
              </TabsContent>
              <TabsContent value="structure" className="mt-4 p-4 border rounded-lg">
                <p className="whitespace-pre-wrap">{result.narrativeStructure}</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
