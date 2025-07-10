"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Clapperboard, Mail, KeyRound, UserPlus } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});
type LoginFormData = z.infer<typeof loginSchema>;


export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [authLoading, setAuthLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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
    } catch (error: any) {
      console.error("Erro ao fazer login com e-mail:", error);
      toast({ title: "Erro no Login", description: "Credenciais inválidas. Verifique seu e-mail e senha.", variant: "destructive" });
    } finally {
        setAuthLoading(false);
    }
  };
  
  const handleEmailSignUp = async (data: LoginFormData) => {
    setAuthLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Conta criada com sucesso!", description: "Você já pode fazer o login." });
      form.reset();
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
    <svg viewBox="0 0 48 48" {...props}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Clapperboard className="w-10 h-10 text-primary" />
                <h1 className="text-3xl font-headline font-semibold text-primary">
                    Roteiro Pro
                </h1>
            </div>
          <CardTitle>Bem-vindo!</CardTitle>
          <CardDescription>Faça login ou crie uma conta para continuar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={handleGoogleSignIn} disabled={loading || authLoading}>
            <GoogleIcon className="mr-2 h-5 w-5" />
            Entrar com o Google
          </Button>
          
          <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OU</span>
            <Separator className="flex-1" />
          </div>

        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>
            <Form {...form}>
            <TabsContent value="login">
                <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4 mt-4">
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Email</FormLabel>
                            <FormControl>
                                <Input placeholder="seu@email.com" {...field} icon={Mail} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                             <FormLabel className="sr-only">Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Sua senha" {...field} icon={KeyRound}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={loading || authLoading}>
                        <Mail className="mr-2"/> Entrar com E-mail
                    </Button>
                </form>
            </TabsContent>
            <TabsContent value="signup">
                 <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-4 mt-4">
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Email</FormLabel>
                            <FormControl>
                                <Input placeholder="seu@email.com" {...field} icon={Mail} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                             <FormLabel className="sr-only">Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Crie uma senha" {...field} icon={KeyRound}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={loading || authLoading}>
                        <UserPlus className="mr-2"/> Criar Conta com E-mail
                    </Button>
                </form>
            </TabsContent>
             </Form>
        </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}
