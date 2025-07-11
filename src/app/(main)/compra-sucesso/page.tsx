
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CompraSucessoPage() {
    const { toast } = useToast();

    useEffect(() => {
        toast({
            title: "Compra realizada com sucesso!",
            description: "Seus créditos foram adicionados. Obrigado!",
        });
    }, [toast]);

    return (
        <div className="flex flex-col items-center justify-center text-center py-16">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full mb-4">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Pagamento Aprovado!</CardTitle>
                    <CardDescription>
                        Sua compra foi concluída com sucesso e seus créditos já foram adicionados à sua conta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Agradecemos por sua confiança! Agora você pode continuar aprimorando seus roteiros com todas as nossas ferramentas de IA.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/painel-de-roteiros">
                        <Button>
                            <Rocket className="mr-2 h-4 w-4" />
                            Ir para o Painel de Roteiros
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
