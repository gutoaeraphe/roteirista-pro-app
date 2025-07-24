
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FilePlus2, Trash2, CheckCircle, Upload, ShieldAlert, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

const scriptSchema = z.object({
  name: z.string().min(1, "O nome do roteiro é obrigatório."),
  format: z.string().min(1, "O formato é obrigatório."),
  genre: z.string().min(1, "O gênero é obrigatório."),
  file: z.instanceof(File).refine(file => file.size > 0, "É necessário selecionar um arquivo de roteiro."),
});

type ScriptFormData = z.infer<typeof scriptSchema>;

export default function PainelDeRoteirosPage() {
  const { scripts, addScript, activeScript, setActiveScript, deleteScript, loading } = useScript();
  const { toast } = useToast();
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ScriptFormData>({
    resolver: zodResolver(scriptSchema),
    defaultValues: {
      name: "",
      format: "",
      genre: "",
    },
  });

  const handleRowClick = (script: (typeof scripts)[0]) => {
      setActiveScript(script);
      if (script.format === 'Argumento') {
          router.push(`/argumento-gerado?id=${script.id}`);
      }
  };

  const onSubmit = async (data: ScriptFormData) => {
    try {
      const content = await data.file.text();
      const scriptData = {
        name: data.name,
        format: data.format,
        genre: data.genre,
        content: content,
      };
      addScript(scriptData);
      form.reset();
      setFileName("");
      setIsDialogOpen(false);
      toast({ title: "Sucesso!", description: "Roteiro adicionado." });
    } catch (error) {
        toast({ title: "Erro", description: "Não foi possível ler o arquivo do roteiro.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold">Painel de Roteiros</h1>
            <p className="text-muted-foreground">Adicione e gerencie seus roteiros para análise.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <FilePlus2 className="mr-2 h-4 w-4"/> Adicionar Roteiro
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Roteiro</DialogTitle>
                    <DialogDescription>
                        Preencha as informações e faça o upload do arquivo de texto (.txt) do seu roteiro.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nome do Roteiro</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: A Vingança Silenciosa" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="format"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Formato</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Longa-metragem" {...field} />
                                </FormControl>
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
                                <FormControl>
                                    <Input placeholder="Ex: Ficção Científica" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Arquivo do Roteiro</FormLabel>
                                    <FormControl>
                                    <label htmlFor="file-upload" className="flex items-center justify-center w-full h-10 px-3 py-2 text-sm border rounded-md cursor-pointer border-input bg-background hover:bg-accent hover:text-accent-foreground">
                                        <Upload className="mr-2 h-4 w-4" />
                                        <span>{fileName || "Selecione o arquivo (.txt)"}</span>
                                        <Input 
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".txt"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                            field.onChange(file);
                                            setFileName(file.name);
                                            }
                                        }}
                                        />
                                    </label>
                                    </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Adicionar Roteiro</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </header>

       <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
            <AccordionTrigger className="text-base font-semibold flex items-center gap-2 text-amber-500 hover:no-underline">
                <ShieldAlert /> Aviso Legal sobre o Uso de Inteligência Artificial (IA)
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                <h4 className="font-semibold text-foreground/90">1. Transparência no Uso da Tecnologia:</h4>
                <p>Para proporcionar uma experiência mais dinâmica e interativa, informamos que algumas das funcionalidades deste site/aplicativo, incluindo, mas não se limitando a, geração de respostas, análises e interações, são assistidas por sistemas de Inteligência Artificial.</p>
                <h4 className="font-semibold text-foreground/90">2. Natureza e Limitações da IA:</h4>
                <p>A Inteligência Artificial é uma tecnologia em desenvolvimento que, apesar de seus avanços, pode apresentar falhas e gerar conteúdos imprecisos, incompletos ou inconsistentes. As respostas fornecidas são baseadas em padrões de dados e algoritmos, e não substituem o discernimento, a análise crítica e a validação de um ser humano.</p>
                <h4 className="font-semibold text-foreground/90">3. Necessidade de Revisão Humana:</h4>
                <p>É imprescindível que todo e qualquer conteúdo, resposta ou interação gerada pela IA seja tratado como preliminar e sujeito a uma rigorosa revisão humana. Antes de tomar qualquer decisão ou ação com base nas informações fornecidas, o usuário deve validá-las de forma independente.</p>
                <h4 className="font-semibold text-foreground/90">4. Isenção de Responsabilidade:</h4>
                <p>Ao utilizar as funcionalidades de IA desta plataforma, o USUÁRIO reconhece e concorda que o faz por sua conta e risco. Isentamo-nos de qualquer responsabilidade por danos diretos ou indiretos, perdas ou inconvenientes que possam surgir do uso de informações geradas pela IA que não tenham sido devidamente verificadas por um humano. A responsabilidade final pelo uso do conteúdo gerado é integralmente do usuário.</p>
                <h4 className="font-semibold text-foreground/90">5. Conformidade e Legislação:</h4>
                <p>Este aviso está em conformidade com os princípios de transparência e informação, em linha com as discussões atuais sobre a regulamentação da Inteligência Artificial no Brasil e com o Código de Defesa do Consumidor, que preza pela clareza na prestação de serviços.</p>
            </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Card>
          <CardHeader>
              <CardTitle>Seus Roteiros</CardTitle>
              <CardDescription>
                  Selecione um roteiro para torná-lo ativo para análise. Roteiros do tipo "Argumento" serão abertos no editor.
              </CardDescription>
          </CardHeader>
          <CardContent>
              {loading ? (
                  <p>Carregando roteiros...</p>
              ) : scripts.length > 0 ? (
                  <div className="border rounded-lg">
                  <Table>
                      <TableHeader>
                      <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Formato</TableHead>
                          <TableHead>Gênero</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                      </TableHeader>
                      <TableBody>
                      {scripts.map((script) => (
                          <TableRow 
                              key={script.id} 
                              className={`cursor-pointer ${activeScript?.id === script.id && script.format !== 'Argumento' ? 'bg-primary/10' : ''}`}
                              onClick={() => handleRowClick(script)}
                          >
                          <TableCell className="font-medium flex items-center gap-2">
                              {activeScript?.id === script.id && script.format !== 'Argumento' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {script.name}
                          </TableCell>
                          <TableCell>{script.format}</TableCell>
                          <TableCell>{script.genre}</TableCell>
                          <TableCell className="text-right">
                              {script.format === 'Argumento' && (
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  deleteScript(script.id);
                              }}
                              >
                              <Trash2 className="h-4 w-4" />
                              </Button>
                          </TableCell>
                          </TableRow>
                      ))}
                      </TableBody>
                  </Table>
                  </div>
              ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground">Nenhum roteiro adicionado ainda.</p>
                      <p className="text-sm text-muted-foreground">Use o botão "Adicionar Roteiro" acima para começar.</p>
                  </div>
              )}
          </CardContent>
      </Card>
    </div>
  );
}
