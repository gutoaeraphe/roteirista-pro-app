
// src/app/(main)/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { UserProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, User, Search, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [creditsToUpdate, setCreditsToUpdate] = useState<{ [uid: string]: number | string }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !userProfile?.isAdmin) {
      toast({ title: "Acesso Negado", description: "Você não tem permissão para acessar esta página.", variant: "destructive" });
      router.push("/painel-de-roteiros");
    }
  }, [userProfile, authLoading, router, toast]);

  useEffect(() => {
    if (userProfile?.isAdmin) {
      const fetchUsers = async () => {
        try {
          const usersCollection = collection(db, "users");
          const userSnapshot = await getDocs(usersCollection);
          const usersList = userSnapshot.docs.map(doc => doc.data() as UserProfile);
          setUsers(usersList);
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
          toast({ title: "Erro", description: "Não foi possível carregar a lista de usuários.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [userProfile, toast]);

  const handleCreditChange = (uid: string, value: string) => {
    const numericValue = value === '' ? '' : parseInt(value, 10);
    if (!isNaN(numericValue) || value === '') {
        setCreditsToUpdate(prev => ({ ...prev, [uid]: numericValue }));
    }
  };

  const handleUpdateCredits = async (uid: string) => {
    const newCredits = creditsToUpdate[uid];
    if (typeof newCredits !== 'number' || newCredits < 0) {
      toast({ title: "Valor Inválido", description: "Por favor, insira um número de créditos válido.", variant: "destructive" });
      return;
    }
    
    try {
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, { credits: newCredits });
      setUsers(users.map(u => u.uid === uid ? { ...u, credits: newCredits } : u));
      setCreditsToUpdate(prev => {
        const newState = { ...prev };
        delete newState[uid];
        return newState;
      });
      toast({ title: "Sucesso!", description: "Créditos atualizados." });
    } catch (error) {
      console.error("Erro ao atualizar créditos:", error);
      toast({ title: "Erro", description: "Não foi possível atualizar os créditos.", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><ShieldCheck/> Painel Administrativo</h1>
                <p className="text-muted-foreground">Gerencie os créditos dos usuários da plataforma.</p>
            </header>
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  if (!userProfile?.isAdmin) {
    return null; // ou um placeholder de acesso negado
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><ShieldCheck/> Painel Administrativo</h1>
        <p className="text-muted-foreground">Gerencie os créditos dos usuários da plataforma.</p>
      </header>
      
      <Card>
          <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Visualize e edite os créditos de cada usuário.</CardDescription>
              <div className="relative pt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground mt-2" />
                  <Input 
                      placeholder="Pesquisar por e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                  />
              </div>
          </CardHeader>
          <CardContent>
              <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead className="w-[150px]">Créditos</TableHead>
                            <TableHead className="w-[120px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>
                                    <div className="font-medium">{user.name || "Sem nome"}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                    {user.isAdmin ? (
                                        <span className="text-primary font-semibold">Admin</span>
                                    ) : (
                                        <Input 
                                            type="number" 
                                            value={creditsToUpdate[user.uid] ?? user.credits} 
                                            onChange={(e) => handleCreditChange(user.uid, e.target.value)}
                                            className="h-8 w-24"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {!user.isAdmin && (
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleUpdateCredits(user.uid)} 
                                            disabled={creditsToUpdate[user.uid] === undefined}
                                        >
                                            <Save className="mr-2 h-4 w-4"/>
                                            Salvar
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
