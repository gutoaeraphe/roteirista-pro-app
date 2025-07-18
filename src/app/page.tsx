

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, handleEmailSignUp } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, KeyRound, User, UserPlus } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});
type LoginFormData = z.infer<typeof loginSchema>;

const signupSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e a política para continuar.",
  }),
});
type SignupFormData = z.infer<typeof signupSchema>;


export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [authLoading, setAuthLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", acceptTerms: false },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/painel-de-roteiros');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({ title: "Login bem-sucedido!" });
      router.push('/painel-de-roteiros');
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
      toast({ title: "Erro no Login", description: "Não foi possível entrar com o Google.", variant: "destructive" });
    } finally {
        setAuthLoading(false);
    }
  };

  const handleEmailSignIn = async (data: LoginFormData) => {
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Login bem-sucedido!" });
      router.push('/painel-de-roteiros');
    } catch (error: any) {
      console.error("Erro ao fazer login com e-mail:", error);
      toast({ title: "Erro no Login", description: "Credenciais inválidas. Verifique seu e-mail e senha.", variant: "destructive" });
    } finally {
        setAuthLoading(false);
    }
  };
  
  const onEmailSignUp = async (data: SignupFormData) => {
    setAuthLoading(true);
    try {
      await handleEmailSignUp(data.name, data.email, data.password);
      toast({ title: "Conta criada com sucesso!", description: "Você já pode fazer o login." });
      signupForm.reset();
    } catch (error: any) {
      console.error("Erro ao criar conta com e-mail:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast({ title: "Erro ao criar conta", description: "Este e-mail já está em uso.", variant: "destructive" });
      } else {
        toast({ title: "Erro ao criar conta", description: "Não foi possível criar sua conta.", variant: "destructive" });
      }
    } finally {
        setAuthLoading(false);
    }
  };
  
  const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" {...props}><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
  );

  return (
    <main className="bg-background text-foreground min-h-screen flex items-center justify-center">
      <section className="py-20 md:py-32 w-full" id="inicio">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Image src="/logo.png" alt="Roteirista Pro" width={400} height={100} className="w-64 md:w-96 h-auto" />
            <p className="text-xl md:text-2xl text-muted-foreground font-body">Sua sala de roteiristas com inteligência artificial.</p>
            <p className="font-body">Sua história tem potencial. Nossa IA tem as ferramentas. Obtenha análises instantâneas de estrutura, mercado e personagens para transformar sua visão em um roteiro pronto para produção. **Crie sua conta e comece a usar gratuitamente.**</p>
          </div>
          <div>
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Acesse sua Conta</CardTitle>
                <CardDescription>Faça login ou crie uma nova conta para começar. É grátis!</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={handleGoogleSignIn} disabled={loading || authLoading}><GoogleIcon className="mr-2 h-5 w-5" /> Entrar com o Google</Button>
                <div className="flex items-center my-4 space-x-2"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">OU</span><Separator className="flex-1" /></div>
                <Tabs defaultValue="signup" className="w-full">
                    <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">Entrar</TabsTrigger><TabsTrigger value="signup">Criar Conta</TabsTrigger></TabsList>
                    <TabsContent value="login" className="pt-4">
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(handleEmailSignIn)} className="space-y-4">
                              <FormField control={loginForm.control} name="email" render={({ field }) => (<FormItem><FormLabel className="sr-only">Email</FormLabel><FormControl><Input placeholder="seu@email.com" {...field} icon={Mail} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={loginForm.control} name="password" render={({ field }) => (<FormItem><FormLabel className="sr-only">Senha</FormLabel><FormControl><Input type="password" placeholder="Sua senha" {...field} icon={KeyRound}/></FormControl><FormMessage /></FormItem>)} />
                              <Button type="submit" className="w-full" disabled={loading || authLoading}><Mail className="mr-2 h-4 w-4"/> Entrar com E-mail</Button>
                          </form>
                        </Form>
                         <div className="text-center mt-4">
                            <Button variant="link" asChild className="text-xs">
                                <Link href="/recuperar-senha">
                                    Esqueci minha senha
                                </Link>
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="signup" className="pt-4">
                        <Form {...signupForm}>
                          <form onSubmit={signupForm.handleSubmit(onEmailSignUp)} className="space-y-4">
                              <FormField control={signupForm.control} name="name" render={({ field }) => (<FormItem><FormLabel className="sr-only">Nome</FormLabel><FormControl><Input placeholder="Seu nome" {...field} icon={User} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={signupForm.control} name="email" render={({ field }) => (<FormItem><FormLabel className="sr-only">Email</FormLabel><FormControl><Input placeholder="seu@email.com" {...field} icon={Mail} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={signupForm.control} name="password" render={({ field }) => (<FormItem><FormLabel className="sr-only">Senha</FormLabel><FormControl><Input type="password" placeholder="Crie uma senha" {...field} icon={KeyRound}/></FormControl><FormMessage /></FormItem>)} />
                              <FormField
                                control={signupForm.control}
                                name="acceptTerms"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-normal">
                                        Eu li e aceito os{' '}
                                        <Link href="/termos-de-uso" className="underline hover:text-primary" target="_blank">
                                          Termos de Uso
                                        </Link>{' '}
                                        e a{' '}
                                        <Link href="/politica-de-privacidade" className="underline hover:text-primary" target="_blank">
                                          Política de Privacidade
                                        </Link>
                                        .
                                      </FormLabel>
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" className="w-full" disabled={loading || authLoading}><UserPlus className="mr-2 h-4 w-4"/> Criar Conta Gratuita</Button>
                          </form>
                        </Form>
                    </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
