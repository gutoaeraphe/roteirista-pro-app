
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const recoverySchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
});

type RecoveryFormData = z.infer<typeof recoverySchema>;

export default function RecuperarSenhaPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: RecoveryFormData) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setEmailSentTo(data.email);
      setSubmitted(true);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
             // Ainda mostramos sucesso para não revelar se um e-mail existe no sistema
            setEmailSentTo(data.email);
            setSubmitted(true);
        } else {
            console.error('Erro ao enviar e-mail de recuperação:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.',
                variant: 'destructive',
            });
        }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <CardTitle className="mt-4">Verifique seu E-mail</CardTitle>
            <CardDescription>
              Se uma conta com o e-mail <span className="font-bold text-primary">{emailSentTo}</span> existir, um link para redefinir sua senha foi enviado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              Siga as instruções no e-mail para criar uma nova senha. O link pode levar alguns minutos para chegar. Não se esqueça de verificar sua caixa de spam.
            </p>
            <Button onClick={() => router.push('/')} className="w-full mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Login
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar Senha</CardTitle>
          <CardDescription>
            Digite seu e-mail e enviaremos um link para você voltar a acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        {...field}
                        icon={Mail}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="text-center p-6 pt-0">
            <Button variant="link" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Login
                </Link>
            </Button>
        </div>
      </Card>
    </main>
  );
}
