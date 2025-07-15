

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, handleEmailSignUp } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Clapperboard, Mail, KeyRound, User, UserPlus, BrainCircuit, GitCommitHorizontal, BarChart3, Scale, Lightbulb, Presentation, Stethoscope, PenSquare, Youtube, CheckCircle, Star, Sparkles, Building, School, Rocket } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from 'next/image';
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});
type LoginFormData = z.infer<typeof loginSchema>;

const signupSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e a política para continuar.",
  }),
});
type SignupFormData = z.infer<typeof signupSchema>;

const advantages = [
    { title: "Gerador de Argumento", icon: PenSquare, description: "Construa a base de uma nova história do zero, passo a passo." },
    { title: "Estrutura de Roteiro", icon: BarChart3, description: "Diagnóstico completo da trama, personagens e originalidade." },
    { title: "Jornada do Herói", icon: GitCommitHorizontal, description: "Mapeie os 12 passos da jornada e a intensidade dramática." },
    { title: "Análise de Personagens", icon: BrainCircuit, description: "Aprofunde o perfil psicológico de protagonistas e antagonistas." },
    { title: "Teste de Representatividade", icon: Scale, description: "Avalie a diversidade com os testes de Bechdel, Vito Russo e DuVernay." },
    { title: "Análise de Mercado", icon: Lightbulb, description: "Receba insights comerciais sobre público-alvo e tendências." },
    { title: "Gerador de Pitching", icon: Presentation, description: "Crie um documento de venda profissional para seu projeto." },
    { title: "Script Doctor", icon: Stethoscope, description: "Consulte uma IA especialista para refinar seu roteiro em tempo real." },
    { title: "Dicas e Tutoriais", icon: Youtube, description: "Aprenda com videoaulas e masterclasses diretamente na plataforma." },
];

const faqItems = [
    {
        question: "Como funciona o sistema de créditos?",
        answer: "É simples: 1 crédito equivale a 1 análise completa (Estrutura, Jornada do Herói, Personagens, etc.). Para o Script Doctor, 1 crédito desbloqueia um pacote de 20 mensagens para você usar no chat com a IA. Você pode comprar pacotes de créditos para usar como precisar."
    },
    {
        question: "Preciso pagar para testar a plataforma?",
        answer: "Não! Ao criar sua conta, você ganha 3 créditos gratuitos para testar todas as funcionalidades da plataforma imediatamente. Queremos que você experimente o poder do Roteirista Pro sem nenhum compromisso inicial."
    },
    {
        question: "Meus roteiros e ideias estão seguros?",
        answer: "Sim, a segurança e a confidencialidade do seu trabalho são nossa prioridade máxima. Seus roteiros são armazenados de forma privada e criptografada, acessíveis apenas por você. Jamais utilizamos seu conteúdo para treinar nossos modelos de IA ou para qualquer outra finalidade."
    },
    {
        question: "O Roteirista Pro substitui um roteirista humano?",
        answer: "De forma alguma. O Roteirista Pro é o seu copiloto criativo. Ele foi projetado para potencializar seu talento, automatizar análises complexas, gerar insights e ajudar a superar bloqueios, mas a genialidade, a emoção e a voz da história serão sempre suas."
    }
];

const creditPackages = [
    {
        name: "Pacote Básico",
        credits: 10,
        price: "19,90",
        description: "Ideal para análises pontuais em seus projetos.",
        features: ["10 créditos de análise", "Acesso a todas as ferramentas"],
    },
    {
        name: "Pacote Creator",
        credits: 25,
        price: "39,90",
        description: "O mais popular para roteiristas ativos.",
        features: ["25 créditos de análise", "Melhor custo-benefício", "Acesso a todas as ferramentas"],
        isPopular: true,
    },
    {
        name: "Pacote Pro",
        credits: 50,
        price: "69,90",
        description: "Perfeito para uso intensivo e múltiplos projetos.",
        features: ["50 créditos de análise", "O menor preço por crédito", "Acesso a todas as ferramentas"],
    },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [authLoading, setAuthLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", acceptTerms: false },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/painel-de-roteiros');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({ title: "Login bem-sucedido!" });
      router.push('/painel-de-roteiros');
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
      toast({ title: "Erro no Login", description: "Não foi possível entrar com o Google.", variant: "destructive" });
    } finally {
        setAuthLoading(false);
    }
  };

  const handleEmailSignIn = async (data: LoginFormData) => {
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Login bem-sucedido!" });
      router.push('/painel-de-roteiros');
    } catch (error: any) {
      console.error("Erro ao fazer login com e-mail:", error);
      toast({ title: "Erro no Login", description: "Credenciais inválidas. Verifique seu e-mail e senha.", variant: "destructive" });
    } finally {
        setAuthLoading(false);
    }
  };
  
  const onEmailSignUp = async (data: SignupFormData) => {
    setAuthLoading(true);
    try {
      await handleEmailSignUp(data.name, data.email, data.password);
      toast({ title: "Conta criada com sucesso!", description: "Você já pode fazer o login." });
      signupForm.reset();
    } catch (error: any) {
      console.error("Erro ao criar conta com e-mail:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast({ title: "Erro ao criar conta", description: "Este e-mail já está em uso.", variant: "destructive" });
      } else {
        toast({ title: "Erro ao criar conta", description: "Não foi possível criar sua conta.", variant: "destructive" });
      }
    } finally {
        setAuthLoading(false);
    }
  };

  const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" {...props}><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
  );

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-32" id="inicio">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Image src="/logo.png" alt="Roteirista Pro" width={400} height={100} className="w-64 md:w-96 h-auto" />
            <p className="text-xl md:text-2xl text-muted-foreground font-body">Sua sala de roteiristas com inteligência artificial.</p>
            <p className="font-body">Sua história tem potencial. Nossa IA tem as ferramentas. Obtenha análises instantâneas de estrutura, mercado e personagens para transformar sua visão em um roteiro pronto para produção. **Comece gratuitamente e receba 3 créditos para destravar seu próximo grande projeto.**</p>
          </div>
          <div>
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Acesse sua Conta</CardTitle>
                <CardDescription>Faça login ou crie uma nova conta para começar. É grátis!</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={handleGoogleSignIn} disabled={loading || authLoading}><GoogleIcon className="mr-2 h-5 w-5" /> Entrar com o Google</Button>
                <div className="flex items-center my-4 space-x-2"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">OU</span><Separator className="flex-1" /></div>
                <Tabs defaultValue="signup" className="w-full">
                    <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">Entrar</TabsTrigger><TabsTrigger value="signup">Criar Conta</TabsTrigger></TabsList>
                    <TabsContent value="login" className="pt-4">
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(handleEmailSignIn)} className="space-y-4">
                              <FormField control={loginForm.control} name="email" render={({ field }) => (<FormItem><FormLabel className="sr-only">Email</FormLabel><FormControl><Input placeholder="seu@email.com" {...field} icon={Mail} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={loginForm.control} name="password" render={({ field }) => (<FormItem><FormLabel className="sr-only">Senha</FormLabel><FormControl><Input type="password" placeholder="Sua senha" {...field} icon={KeyRound}/></FormControl><FormMessage /></FormItem>)} />
                              <Button type="submit" className="w-full" disabled={loading || authLoading}><Mail className="mr-2 h-4 w-4"/> Entrar com E-mail</Button>
                          </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="signup" className="pt-4">
                        <Form {...signupForm}>
                          <form onSubmit={signupForm.handleSubmit(onEmailSignUp)} className="space-y-4">
                              <FormField control={signupForm.control} name="name" render={({ field }) => (<FormItem><FormLabel className="sr-only">Nome</FormLabel><FormControl><Input placeholder="Seu nome" {...field} icon={User} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={signupForm.control} name="email" render={({ field }) => (<FormItem><FormLabel className="sr-only">Email</FormLabel><FormControl><Input placeholder="seu@email.com" {...field} icon={Mail} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={signupForm.control} name="password" render={({ field }) => (<FormItem><FormLabel className="sr-only">Senha</FormLabel><FormControl><Input type="password" placeholder="Crie uma senha" {...field} icon={KeyRound}/></FormControl><FormMessage /></FormItem>)} />
                              <FormField
                                control={signupForm.control}
                                name="acceptTerms"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-normal">
                                        Eu li e aceito os{' '}
                                        <Link href="/termos-de-uso" className="underline hover:text-primary" target="_blank">
                                          Termos de Uso
                                        </Link>{' '}
                                        e a{' '}
                                        <Link href="/politica-de-privacidade" className="underline hover:text-primary" target="_blank">
                                          Política de Privacidade
                                        </Link>
                                        .
                                      </FormLabel>
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" className="w-full" disabled={loading || authLoading}><UserPlus className="mr-2 h-4 w-4"/> Criar Conta Gratuita</Button>
                          </form>
                        </Form>
                    </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="vantagens" className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">Um Ecossistema Completo para Sua História</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">Do conceito à análise de mercado, o Roteirista Pro oferece todas as ferramentas para desenvolver e validar seus projetos audiovisuais.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {advantages.map((advantage) => (
                    <Card key={advantage.title} className="text-left hover:shadow-lg hover:border-primary/50 transition-all">
                        <CardHeader>
                            <advantage.icon className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="font-headline">{advantage.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{advantage.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-teste-gratis" className="py-20 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <Rocket className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-headline mb-4">Pronto para Elevar seu Roteiro?</h2>
          <p className="text-lg text-accent-foreground/80 mb-8 max-w-3xl mx-auto">
            Chega de incertezas. Valide suas ideias, aprimore sua estrutura e ganhe a confiança para levar seu projeto ao próximo nível. 
            **Cadastre-se agora e ganhe 3 créditos gratuitos** para testar todas as nossas ferramentas de IA.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <a href="#inicio">Criar Minha Conta Gratuita</a>
          </Button>
        </div>
      </section>

      {/* Creator Section */}
      <section id="criador" className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[4/5] md:aspect-auto md:h-full w-full rounded-lg overflow-hidden shadow-lg min-h-[400px]">
                    <Image src="/guto.png" alt="Foto de Guto Aeraphe" layout="fill" objectFit="cover" />
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-headline">Criado por Quem Vive o Cinema na Prática</h2>
                    <p className="text-muted-foreground">Guto Aeraphe não é apenas um teórico. Com mais de 25 anos de experiência como cineasta, roteirista e produtor audiovisual, ele coleciona prêmios em festivais internacionais como os de Los Angeles e Marseille, e é membro da prestigiada Academia Brasileira de Cinema e Artes Visuais. Fundador da CMK Filmes, Guto também dedicou anos à formação de novos talentos como professor universitário. O método Lean Film Design é fruto dessa trajetória: uma solução prática e inovadora que nasceu da necessidade de unir a paixão pela arte de contar histórias com a inteligência estratégica que o mercado audiovisual moderno exige. Ele é o autor que vai te guiar nesta jornada, transformando sua visão em um projeto de sucesso.</p>
                    <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground">
                    “Eu passei anos no set dirigindo, escrevendo roteiros e na sala de aula, e vi de perto o potencial incrível de tantos criadores ser desperdiçado pela falta de um método. O Lean Film Design nasceu do meu desejo de criar uma ponte entre a alma de uma história e a lógica do mercado. Este aplicativo não substitui o seu talento; ele o potencializa. É o seu assistente criativo 24 horas por dia, uma bússola para organizar o caos da criação e transformar suas ideias mais ousadas em realidade.”
                    <footer className="mt-2 not-italic font-semibold text-foreground">— Guto Aeraphe, Cineasta e Criador do Lean Film Design.</footer>
                    </blockquote>
                </div>
            </div>
        </div>
      </section>

      {/* Pricing Section */}
       <section id="precos" className="py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">Planos Simples e Flexíveis</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
                Use seus créditos como quiser. Cada análise completa custa 1 crédito. Para o Script Doctor, 1 crédito libera 20 mensagens no chat. Sem mensalidades, sem compromisso.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {creditPackages.map(pkg => (
                    <Card key={pkg.name} className={`flex flex-col ${pkg.isPopular ? 'border-primary ring-2 ring-primary' : ''}`}>
                         {pkg.isPopular && <div className="absolute top-0 right-4 -mt-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><Star className="w-4 h-4" /> Mais Popular</div>}
                        <CardHeader>
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
                            <Button className="w-full" onClick={() => router.push('/comprar-creditos')} variant={pkg.isPopular ? 'default' : 'secondary'}>
                                Comprar Agora
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             <Card className="mt-12 max-w-4xl mx-auto text-center border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-3"><Building/><School/> Pacotes para Produtoras e Escolas</CardTitle>
                    <CardDescription>Precisa de um volume maior de créditos ou uma solução personalizada para sua equipe?</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Oferecemos planos corporativos flexíveis para produtoras, emissoras, escolas de cinema e grandes equipes. Entre em contato para uma proposta personalizada de acordo com a sua necessidade.</p>
                    <a href="mailto:atendimento@cmkfilmes.com">
                        <Button variant="outline">
                            <Mail className="mr-2 h-4 w-4"/> Fale Conosco
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
      </section>

      {/* Book Section */}
      <section id="livro" className="py-20">
        <div className="container mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-headline">Inspirado em um Manual de Sucesso, Agora na Palma da Sua Mão</h2>
                    <p className="text-muted-foreground">Este aplicativo é a evolução digital e interativa do conhecimento consolidado no livro "Manual Prático de Criação para Diretores, Roteiristas e Produtores Modernos: Ou como desenvolver projetos e roteiros audiovisuais com ajuda de I.A. e Design Thinking para qualquer tela", de Guto Aeraphe. Enquanto o livro oferece a base teórica e a profundidade conceitual, nosso aplicativo coloca o método Lean Film Design em ação. Transformamos as planilhas, os cards e as técnicas de gamificação em uma ferramenta intuitiva para que você possa:</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Prototipar histórias em minutos.</li>
                        <li>Organizar seus projetos de forma visual.</li>
                        <li>Testar suas ideias com agilidade.</li>
                        <li>Levar sua criatividade para onde você for.</li>
                    </ul>
                    <p className="font-semibold">É o workshop criativo do livro, disponível 24 horas por dia no seu bolso.</p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button asChild size="lg"><a href="https://www.amazon.com.br/Pr%C3%A1tico-Diretores-Roteiristas-Produtores-Modernos-ebook/dp/B0F9QYD9ZD/ref=sr_1_1?dib=eyJ2IjoiMSJ9.KNgB5p-CJmMLkfPFGz_x0F5cbZpgrmWwK1hmm7OeRhySaxz-o00FPNhOBIyM0UZsi2WP98Gopl4CEGNiPCMzXKbAgDfFtZsRpcnzcKbffR4SvDbTbSWmo7p_tou9mhWujVWJgBJHlyqcxnTpP0tCCVUzVyWrHXOZKGTBCX_zZrmln5XfEkhIK2PTI5E6Dr7S07kAZz5X-YB2T1Qh0_jii1ci8CxE0cA0vBaIF6IVDKez5qNmWK76N0_B-tKOIR9RpeM_JfOHtpfpkedbbCg_GhxK5ZHbXxLtog0DXmtMyz8.B6-RE0blOV4I1ZKzxGifAWgKWgHTH0yLeb8mEVFpLGY&dib_tag=se&keywords=guto+aeraphe&qid=1750340163&sr=8-1" target="_blank" rel="noopener noreferrer">Comprar Ebook</a></Button>
                        <Button asChild size="lg" variant="secondary"><a href="https://loja.uiclap.com/titulo/ua97438/" target="_blank" rel="noopener noreferrer">Comprar Livro Físico</a></Button>
                    </div>
                </div>
                 <div className="order-1 md:order-2 relative aspect-[3/4] w-full max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
                    <Image src="/livro.png" alt="Capa do livro Manual Prático de Criação" layout="fill" objectFit="cover" />
                </div>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 max-w-4xl">
             <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-headline mb-4">Perguntas Frequentes</h2>
                <p className="text-lg text-muted-foreground mb-12">Tudo o que você precisa saber sobre o Roteirista Pro.</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-left text-lg">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">{item.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <Image src="/empresa.png" alt="Cinemarketing Conteúdo e Entretenimento" width={150} height={40} />
            <div className="flex gap-4 mt-4 sm:mt-0">
                <Link href="/termos-de-uso" className="hover:text-primary transition-colors">Termos de Uso</Link>
                <Link href="/politica-de-privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
