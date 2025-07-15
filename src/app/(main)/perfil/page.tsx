
// src/app/(main)/perfil/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, Trash2, Save, Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { doc, deleteDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function PerfilPage() {
  const { user, userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [name, setName] = useState(userProfile?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmationPassword, setDeleteConfirmationPassword] = useState("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [requiresReauth, setRequiresReauth] = useState(false);
  
  const handleNameUpdate = async () => {
    if (!user || name === userProfile?.name) return;
    setLoading(prev => ({ ...prev, name: true }));
    try {
      await updateUserProfile({ name });
      toast({ title: "Sucesso!", description: "Seu nome foi atualizado." });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar o nome.", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, name: false }));
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (newPassword !== confirmPassword) {
      toast({ title: "Erro", description: "As novas senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
        toast({ title: "Erro", description: "A nova senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
        return;
    }

    setLoading(prev => ({ ...prev, password: true }));
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast({ title: "Sucesso!", description: "Sua senha foi alterada." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
        let description = "Não foi possível alterar a senha. Tente novamente mais tarde.";
        if (error.code === 'auth/wrong-password') {
            description = "A senha atual está incorreta.";
        }
        console.error("Erro ao alterar senha:", error);
        toast({ title: "Erro na alteração de senha", description, variant: "destructive" });
    } finally {
        setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const performDeletion = async () => {
     if (!user) return;
     setLoading(prev => ({ ...prev, delete: true }));
     try {
        // Excluir subcoleção de roteiros
        const scriptsCollectionRef = collection(db, "users", user.uid, "scripts");
        const scriptsSnapshot = await getDocs(scriptsCollectionRef);
        const batch = writeBatch(db);
        scriptsSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Excluir documento do usuário no Firestore
        await deleteDoc(doc(db, "users", user.uid));

        // Excluir usuário do Auth
        await deleteUser(user);

        toast({ title: "Conta Excluída", description: "Sua conta e todos os seus dados foram removidos." });
        router.push('/');

    } catch (error: any) {
        console.error("Erro ao excluir conta:", error);
        if (error.code === 'auth/requires-recent-login') {
            setRequiresReauth(true);
            toast({ title: "Sessão Expirada", description: "Para sua segurança, por favor, insira sua senha para confirmar a exclusão da conta.", variant: "destructive" });
        } else {
             toast({ title: "Erro", description: "Não foi possível excluir sua conta. Faça login novamente e tente de novo.", variant: "destructive" });
        }
        setLoading(prev => ({ ...prev, delete: false }));
    }
  }

  const handleReauthenticateAndDelete = async () => {
    if (!user || !user.email || !deleteConfirmationPassword) {
      toast({ title: "Erro", description: "Por favor, insira sua senha.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, delete: true }));
    try {
      const credential = EmailAuthProvider.credential(user.email, deleteConfirmationPassword);
      await reauthenticateWithCredential(user, credential);
      // Após reautenticação bem-sucedida, tente a exclusão novamente.
      await performDeletion();
    } catch (error: any) {
      console.error("Erro na reautenticação:", error);
      toast({ title: "Senha Incorreta", description: "A senha fornecida está incorreta. Tente novamente.", variant: "destructive" });
      setLoading(prev => ({ ...prev, delete: false }));
    }
  }


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie as informações da sua conta e segurança.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>Altere seu nome de exibição.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="displayName">Nome</Label>
            <div className="flex gap-2">
                <Input id="displayName" value={name} onChange={(e) => setName(e.target.value)} icon={User} />
                <Button onClick={handleNameUpdate} disabled={loading.name || name === userProfile?.name}>
                    {loading.name ? <Loader2 className="animate-spin" /> : <Save />}
                    <span className="ml-2 hidden sm:inline">Salvar</span>
                </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" value={userProfile?.email || ""} readOnly disabled />
          </div>
        </CardContent>
      </Card>

        {user?.providerData.some(p => p.providerId === 'password') && (
            <Card>
                <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>Para sua segurança, você precisa fornecer sua senha atual.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Senha Atual</Label>
                            <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required icon={KeyRound}/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="new-password">Nova Senha</Label>
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required icon={KeyRound}/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required icon={KeyRound}/>
                        </div>
                        <Button type="submit" disabled={loading.password}>
                            {loading.password ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            Alterar Senha
                        </Button>
                    </form>
                </CardContent>
            </Card>
        )}

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Área de Perigo</CardTitle>
           <CardDescription>Esta ação é irreversível. Por favor, tenha certeza absoluta.</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog onOpenChange={() => setRequiresReauth(false)}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading.delete}>
                    {loading.delete ? <Loader2 className="animate-spin mr-2" /> : <Trash2 className="mr-2" />}
                    Excluir minha conta
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription>
                   {requiresReauth
                    ? "Sua sessão de login é muito antiga. Para confirmar que é realmente você, por favor, insira sua senha para prosseguir com a exclusão da conta."
                    : "Esta ação não pode ser desfeita. Isso irá excluir permanentemente sua conta, junto com todos os seus roteiros, análises e créditos restantes."
                    }
                </AlertDialogDescription>
                 {requiresReauth && (
                    <div className="space-y-2 pt-2">
                        <Label htmlFor="delete-password">Sua Senha</Label>
                        <Input
                            id="delete-password"
                            type="password"
                            value={deleteConfirmationPassword}
                            onChange={(e) => setDeleteConfirmationPassword(e.target.value)}
                            placeholder="Digite sua senha para confirmar"
                            icon={KeyRound}
                        />
                    </div>
                 )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmationPassword('')}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={requiresReauth ? handleReauthenticateAndDelete : performDeletion} className="bg-destructive hover:bg-destructive/90" disabled={loading.delete}>
                  {loading.delete ? <Loader2 className="animate-spin" /> : 'Sim, excluir minha conta'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
