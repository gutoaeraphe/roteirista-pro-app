"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScript } from "@/context/script-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Script } from "@/lib/types";
import { FilePlus2, Trash2, CheckCircle } from "lucide-react";

const scriptSchema = z.object({
  name: z.string().min(1, "O nome do roteiro é obrigatório."),
  format: z.enum(['Longa-metragem', 'Curta-metragem', 'Série', 'Outro'], {
    required_error: "O formato é obrigatório."
  }),
  genre: z.string().min(1, "O gênero é obrigatório."),
  content: z.string().min(1, "O conteúdo do roteiro não pode estar vazio."),
});

type ScriptFormData = z.infer<typeof scriptSchema>;

export default function PainelDeRoteirosPage() {
  const { scripts, addScript, activeScript, setActiveScript, deleteScript, loading } = useScript();

  const form = useForm<ScriptFormData>({
    resolver: zodResolver(scriptSchema),
    defaultValues: {
      name: "",
      format: undefined,
      genre: "",
      content: "",
    },
  });

  const onSubmit = (data: ScriptFormData) => {
    addScript(data);
    form.reset();
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Painel de Roteiros</h1>
        <p className="text-muted-foreground">Adicione e gerencie seus roteiros para análise.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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
                            <p className="text-sm text-muted-foreground">Use o formulário ao lado para começar.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FilePlus2/> Adicionar Novo Roteiro</CardTitle>
            </CardHeader>
            <CardContent>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o formato" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Longa-metragem">Longa-metragem</SelectItem>
                                <SelectItem value="Curta-metragem">Curta-metragem</SelectItem>
                                <SelectItem value="Série">Série</SelectItem>
                                <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
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
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo do Roteiro</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Cole o conteúdo completo do seu roteiro aqui."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Adicionar Roteiro</Button>
              </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
