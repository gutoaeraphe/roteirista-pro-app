
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Política de Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>A CINEMARKETING CONTEÚDO E ENTRETENIMENTO LTDA, desenvolvedora do aplicativo "Roteirista PRO", está comprometida em proteger a privacidade e os dados pessoais de seus usuários, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018) do Brasil.</p>

            <h2 className="text-xl font-semibold text-foreground">1. DADOS COLETADOS</h2>
            <p>Coletamos os seguintes tipos de dados:</p>
            <ul className="list-disc pl-5">
              <li><strong>a. Dados de Cadastro:</strong> Informações fornecidas por Você ao criar sua conta, como nome, e-mail e senha.</li>
              <li><strong>b. Conteúdo do Usuário:</strong> Roteiros, ideias, projetos e outros textos que Você insere no Aplicativo para análise e utilização das funcionalidades.</li>
              <li><strong>c. Dados de Uso:</strong> Informações sobre como Você utiliza o Aplicativo, como funcionalidades acessadas, frequência de uso e interações, de forma anonimizada e agregada para melhorias internas do serviço.</li>
              <li><strong>d. Cookies e Tecnologias de Rastreamento:</strong> Informações coletadas automaticamente para garantir o funcionamento do site e melhorar sua experiência. Veja a seção específica sobre cookies abaixo.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">2. FINALIDADE DO TRATAMENTO DOS DADOS</h2>
            <p>Seus dados são tratados para as seguintes finalidades:</p>
            <ul className="list-disc pl-5">
                <li>a. Permitir o acesso e uso das funcionalidades do Aplicativo "Roteirista PRO".</li>
                <li>b. Processar e analisar o Conteúdo do Usuário para fornecer os insights e resultados baseados na metodologia Lean Film Design e IA, conforme solicitado por Você.</li>
                <li>c. Gerenciar sua conta e fornecer suporte técnico.</li>
                <li>d. Comunicar sobre atualizações, novos recursos ou informações importantes sobre o Aplicativo.</li>
                <li>e. Melhorar a experiência do Usuário e a qualidade do Aplicativo, através da análise de dados de uso agregados e anonimizados.</li>
                <li>f. Cumprir obrigações legais e regulatórias.</li>
            </ul>
            <p><strong>Importante:</strong> Conforme estabelecido em nosso Termo de Aceite, seu Conteúdo do Usuário e seus dados pessoais não serão utilizados para treinar, alimentar ou aprimorar modelos de Inteligência Artificial externos ou para quaisquer finalidades alheias à prestação dos serviços do Aplicativo sem seu consentimento explícito.</p>

            <h2 className="text-xl font-semibold text-foreground">3. COOKIES E TECNOLOGIAS DE RASTREAMENTO</h2>
            <p>Utilizamos cookies para oferecer uma experiência de navegação mais fluida e segura. Ao utilizar nosso site, você concorda com o uso de cookies de acordo com esta política.</p>
             <ul className="list-disc pl-5">
                <li><strong>O que são cookies:</strong> Pequenos arquivos de texto armazenados no seu dispositivo para lembrar informações sobre sua visita.</li>
                <li><strong>Tipos de Cookies que Utilizamos:</strong>
                    <ul>
                        <li><strong>Cookies Estritamente Necessários:</strong> Essenciais para o funcionamento do site. Eles permitem que você navegue e utilize funcionalidades básicas, como o login na sua conta e o gerenciamento do consentimento de cookies. Para estes, não é necessário o seu consentimento prévio.</li>
                        <li><strong>Cookies de Funcionalidade:</strong> Usados para lembrar as escolhas que você faz (como o roteiro ativo selecionado) para proporcionar uma experiência mais personalizada.</li>
                    </ul>
                </li>
                 <li><strong>Finalidades:</strong> Usamos cookies para:
                    <ul>
                        <li>Manter sua sessão de login ativa.</li>
                        <li>Lembrar suas preferências, como o consentimento de cookies.</li>
                        <li>Garantir a segurança e o funcionamento adequado da plataforma.</li>
                    </ul>
                </li>
                <li><strong>Terceiros:</strong> Atualmente, utilizamos cookies primários, ou seja, definidos por nosso próprio domínio. O Firebase, nosso provedor de autenticação e banco de dados, pode utilizar cookies necessários para o funcionamento de seus serviços integrados.</li>
                <li><strong>Retenção de Dados:</strong> O cookie que armazena seu consentimento tem uma validade longa para não perguntarmos novamente em cada visita. Outros cookies de sessão são excluídos quando você fecha o navegador.</li>
                <li><strong>Gerenciamento de Cookies:</strong> Você pode gerenciar ou excluir cookies através das configurações do seu navegador. No entanto, a desativação de cookies estritamente necessários pode afetar a funcionalidade do site.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">4. COMPARTILHAMENTO DE DADOS</h2>
            <p>a. Não compartilhamos seus dados pessoais ou Conteúdo do Usuário com terceiros, exceto:</p>
            <ul className="list-disc pl-5">
                <li>i. Com provedores de serviços estritamente necessários para a operação do Aplicativo (ex: serviços de hospedagem em nuvem e autenticação do Firebase), que estarão contratualmente obrigados a manter a confidencialidade e segurança dos dados.</li>
                <li>ii. Por obrigação legal ou ordem judicial.</li>
            </ul>
            <p>b. Em nenhuma hipótese seus dados pessoais ou Conteúdo do Usuário serão comercializados.</p>

            <h2 className="text-xl font-semibold text-foreground">5. SEGURANÇA DOS DADOS</h2>
            <p>Adotamos medidas técnicas e administrativas para proteger seus dados pessoais e Conteúdo do Usuário contra acessos não autorizados, perda, alteração, destruição ou qualquer forma de tratamento inadequado ou ilícito. No entanto, nenhum sistema é completamente seguro, e envidamos nossos melhores esforços para garantir a proteção de suas informações.</p>

            <h2 className="text-xl font-semibold text-foreground">6. DIREITOS DOS TITULARES DOS DADOS</h2>
            <p>Você, como titular dos dados, possui os seguintes direitos, conforme a LGPD:</p>
             <ul className="list-disc pl-5">
                <li>a. Confirmação da existência de tratamento.</li>
                <li>b. Acesso aos dados.</li>
                <li>c. Correção de dados incompletos, inexatos ou desatualizados.</li>
                <li>d. Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</li>
                <li>e. Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa.</li>
                <li>f. Eliminação dos dados pessoais tratados com o seu consentimento, exceto nas hipóteses de conservação legalmente previstas.</li>
                <li>g. Informação sobre as entidades públicas e privadas com as quais realizamos uso compartilhado de dados.</li>
                <li>h. Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa.</li>
                <li>i. Revogação do consentimento.</li>
            </ul>
            <p>Para exercer seus direitos, entre em contato conosco através do e-mail: atendimento@cmkfilmes.com.</p>

            <h2 className="text-xl font-semibold text-foreground">7. RETENÇÃO DOS DADOS</h2>
            <p>Seus dados pessoais e Conteúdo do Usuário serão mantidos apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados, para o cumprimento de obrigações legais ou regulatórias, ou até que Você solicite a exclusão de sua conta e dados, observadas as exceções legais.</p>

            <h2 className="text-xl font-semibold text-foreground">8. ATUALIZAÇÕES DESTA POLÍTICA DE PRIVACIDADE</h2>
            <p>Esta Política de Privacidade poderá ser atualizada periodicamente. Notificaremos Você sobre alterações significativas através do Aplicativo ou por e-mail. Recomendamos que Você revise esta política regularmente.</p>

            <h2 className="text-xl font-semibold text-foreground">9. CONTATO</h2>
            <p>Em caso de dúvidas ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de seus dados pessoais, entre em contato com:</p>
            <p>
              CINEMARKETING CONTEÚDO E ENTRETENIMENTO LTDA<br/>
              E-mail: atendimento@cmkfilmes.com
            </p>
          </CardContent>
        </Card>
        <div className="mt-8 text-center">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2" />
                    Voltar à página principal
                </Link>
            </Button>
        </div>
      </div>
    </main>
  );
}
