
// src/app/(main)/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, collectionGroup, query } from "firebase/firestore";
import { UserProfile, Script } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, User, Search, Save, Users, FileText, BrainCircuit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon: Icon }: { title: string, value: number, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
)

export default function AdminPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [stats, setStats] = useState({ totalScripts: 0, totalAnalyses: 0 });

  useEffect(() => {
    if (!authLoading && !userProfile?.isAdmin) {
      toast({ title: "Acesso Negado", description: "Você não tem permissão para acessar esta página.", variant: "destructive" });
      router.push("/painel-de-roteiros");
    }
  }, [userProfile, authLoading, router, toast]);

  useEffect(() => {
    if (userProfile?.isAdmin) {
      const fetchUsersAndStats = async () => {
        try {
          // Fetch users
          const usersCollection = collection(db, "users");
          const userSnapshot = await getDocs(usersCollection);
          const usersList = userSnapshot.docs.map(doc => doc.data() as UserProfile);
          setUsers(usersList);

          // Fetch all scripts for stats
          const scriptsQuery = query(collectionGroup(db, 'scripts'));
          const scriptsSnapshot = await getDocs(scriptsQuery);
          
          let analysesCount = 0;
          scriptsSnapshot.docs.forEach(doc => {
            const script = doc.data() as Script;
            if (script.analysis) {
                analysesCount += Object.keys(script.analysis).length;
            }
          });

          setStats({
            totalScripts: scriptsSnapshot.size,
            totalAnalyses: analysesCount,
          });

        } catch (error) {
          console.error("Erro ao buscar dados do admin:", error);
          toast({ title: "Erro", description: "Não foi possível carregar os dados do painel administrativo.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };
      fetchUsersAndStats();
    }
  }, [userProfile, toast]);


  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><ShieldCheck/> Painel Administrativo</h1>
                <p className="text-muted-foreground">Gerencie os usuários e veja as estatísticas da plataforma.</p>
            </header>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
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
        <p className="text-muted-foreground">Gerencie os usuários e veja as estatísticas da plataforma.</p>
      </header>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Usuários Cadastrados" value={users.length} icon={Users} />
            <StatCard title="Roteiros Enviados" value={stats.totalScripts} icon={FileText} />
            <StatCard title="Análises Realizadas" value={stats.totalAnalyses} icon={BrainCircuit} />
       </div>
      
      <Card>
          <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Visualize os usuários cadastrados.</CardDescription>
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
                            <TableHead>Status</TableHead>
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
                                        <span className="text-muted-foreground">Usuário</span>
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
