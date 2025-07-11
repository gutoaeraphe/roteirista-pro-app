import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Info } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                    <Info className="w-6 h-6 text-primary"/>
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">
                    {description}
                </p>
                <Link href="/painel-de-roteiros">
                    <Button>
                        <FileUp className="mr-2 h-4 w-4" />
                        Selecionar ou Adicionar Roteiro
                    </Button>
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}
