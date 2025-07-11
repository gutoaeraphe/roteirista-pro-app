
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function CompraFalhouPage() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full mb-4">
                        <AlertTriangle className="w-12 h-12 text-amber-500" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Ops! Algo deu errado.</CardTitle>
                    <CardDescription>
                        Não foi possível concluir seu pagamento ou a operação foi cancelada.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                       Não se preocupe, nenhum valor foi cobrado. Você pode tentar novamente ou, se o problema persistir, entre em contato com nosso suporte.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/comprar-creditos">
                        <Button>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Tentar Novamente
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
