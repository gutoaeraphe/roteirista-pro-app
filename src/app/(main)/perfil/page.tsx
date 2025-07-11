// src/app/(main)/perfil/page.tsx
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Mail, KeyRound, User, CreditCard, Crown } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function PerfilPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const handlePasswordReset = async () => {
    if (!user || !user.email) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado para redefinir a senha.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para o link de redefinição de senha.",
      });
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição de senha:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o e-mail de redefinição. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
          <UserCircle className="w-8 h-8" />
          Meu Perfil
        </h1>
        <p className="text-muted-foreground">Gerencie as informações da sua conta e créditos.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>Estes são os detalhes associados à sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="displayName">Nome</Label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="displayName" value={userProfile?.name || "Não informado"} readOnly className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" value={userProfile?.email || ""} readOnly className="pl-9" />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="credits">Saldo</Label>
             <div className="relative">
                {userProfile?.isAdmin ? (
                    <>
                        <Crown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="credits" value="Acesso Ilimitado (Admin)" readOnly className="pl-9" />
                    </>
                ) : (
                    <>
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="credits" value={`${userProfile?.credits || 0} créditos | ${userProfile?.scriptDoctorMessagesRemaining || 0} mensagens no Script Doctor`} readOnly className="pl-9" />
                    </>
                )}
            </div>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Altere sua senha de acesso.</CardDescription>
        </CardHeader>
        <CardContent>
             <p className="text-sm text-muted-foreground mb-4">
               Se você faz login com e-mail e senha, pode solicitar um link para redefini-la. Este recurso não se aplica ao login com Google.
            </p>
            <Button onClick={handlePasswordReset} variant="outline" disabled={!user?.providerData.some(p => p.providerId === 'password')}>
                <KeyRound className="mr-2"/>
                Enviar e-mail para redefinir senha
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
