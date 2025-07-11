// src/components/layout/no-credits-placeholder.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface NoCreditsPlaceholderProps {
  title: string;
}

export function NoCreditsPlaceholder({ title }: NoCreditsPlaceholderProps) {
  const { userProfile } = useAuth();

  if (userProfile?.isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    <AlertCircle className="w-6 h-6 text-amber-500"/>
                    <span>Créditos Insuficientes</span>
                </CardTitle>
                <CardDescription>
                    Para usar a ferramenta "{title}", você precisa de créditos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">
                    Você não possui créditos suficientes para realizar esta ação. Por favor, adquira mais créditos para continuar.
                </p>
                <Link href="/comprar-creditos">
                    <Button>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Comprar Créditos
                    </Button>
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}
