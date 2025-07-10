
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FilePlus2, Trash2, CheckCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
      
      <Card>
          <CardHeader>
              <CardTitle>Seus Roteiros</CardTitle>
              <CardDescription>
                  Selecione um roteiro para torná-lo ativo para análise ou exclua os que não são mais necessários.
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
                              className={`cursor-pointer ${activeScript?.id === script.id ? 'bg-primary/10' : ''}`}
                              onClick={() => setActiveScript(script)}
                          >
                          <TableCell className="font-medium flex items-center gap-2">
                              {activeScript?.id === script.id && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {script.name}
                          </TableCell>
                          <TableCell>{script.format}</TableCell>
                          <TableCell>{script.genre}</TableCell>
                          <TableCell className="text-right">
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
