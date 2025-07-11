
// src/app/(main)/comprar-creditos/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle, Mail, Star, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

// Substitua pelos URLs dos seus Links de Pagamento do Stripe
const creditPackages = [
    {
        name: "Pacote Básico",
        credits: 10,
        price: "19,90",
        description: "Ideal para testar e fazer análises pontuais.",
        features: ["10 créditos de análise", "Acesso a todas as ferramentas", "Suporte por e-mail"],
        paymentLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BASICO,
    },
    {
        name: "Pacote Creator",
        credits: 25,
        price: "39,90",
        description: "O mais popular para roteiristas ativos.",
        features: ["25 créditos de análise", "Melhor custo-benefício", "Acesso a todas as ferramentas", "Suporte prioritário"],
        isPopular: true,
        paymentLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_CREATOR,
    },
    {
        name: "Pacote Pro",
        credits: 50,
        price: "69,90",
        description: "Perfeito para uso intensivo e múltiplos projetos.",
        features: ["50 créditos de análise", "O menor preço por crédito", "Acesso a todas as ferramentas", "Suporte prioritário"],
        paymentLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO,
    },
]

export default function ComprarCreditosPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [loadingLink, setLoadingLink] = useState<string | null>(null);

    const handlePurchase = (paymentLink: string | undefined) => {
        if (!paymentLink) {
            toast({
                title: "Produto não configurado",
                description: "Este pacote de créditos ainda não está pronto para venda. Verifique as variáveis de ambiente.",
                variant: "destructive",
            });
            return;
        }

        if (!user) {
            toast({
                title: "Usuário não autenticado",
                description: "Você precisa estar logado para fazer uma compra.",
                variant: "destructive",
            });
            return;
        }

        setLoadingLink(paymentLink);
        
        // Adiciona o client_reference_id na URL para identificar o usuário no webhook
        const urlComUsuario = `${paymentLink}?client_reference_id=${user.uid}`;
        
        // Redireciona o usuário para o link de pagamento
        window.location.href = urlComUsuario;
    }

    return (
        <div className="space-y-8">
            <header className="text-center">
                <h1 className="text-3xl font-headline font-bold">Adquira Créditos</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Escolha um pacote de créditos para continuar analisando seus roteiros. Cada análise consome 1 crédito.
                </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {creditPackages.map(pkg => (
                    <Card key={pkg.name} className={`flex flex-col ${pkg.isPopular ? 'border-primary ring-2 ring-primary' : ''}`}>
                         {pkg.isPopular && <div className="absolute top-0 right-4 -mt-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><Star className="w-4 h-4" /> Mais Popular</div>}
                        <CardHeader className="text-center">
                            <CardTitle>{pkg.name}</CardTitle>
                            <CardDescription>{pkg.description}</CardDescription>
                             <div className="text-4xl font-bold pt-4">R$ {pkg.price}</div>
                             <p className="text-lg text-primary font-semibold flex items-center justify-center gap-2"><Sparkles className="w-5 h-5"/> {pkg.credits} Créditos</p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-2">
                                {pkg.features.map(feature => (
                                    <li key={feature} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handlePurchase(pkg.paymentLink)}
                                disabled={loadingLink === pkg.paymentLink}
                                variant={pkg.isPopular ? 'default' : 'secondary'}
                            >
                                {loadingLink === pkg.paymentLink ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Aguarde...
                                    </>
                                ) : (
                                    "Comprar Agora"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

             <Card className="mt-12">
                <CardHeader className="text-center">
                    <CardTitle>Pacotes para Empresas e Escolas</CardTitle>
                    <CardDescription>Precisa de um volume maior de créditos ou uma solução personalizada para sua equipe?</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">Oferecemos planos corporativos flexíveis para produtoras, escolas de cinema e grandes equipes. Entre em contato para uma proposta personalizada.</p>
                    <a href="mailto:atendimento@cmkfilmes.com">
                        <Button variant="outline">
                            <Mail className="mr-2 h-4 w-4"/> Fale Conosco
                        </Button>
                    </a>
                </CardContent>
            </Card>

        </div>
    )
}
