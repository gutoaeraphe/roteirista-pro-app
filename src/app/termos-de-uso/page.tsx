
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Termos de Uso</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>Este Termo de Aceite e Uso de Software ("Termo") estabelece os termos e condições para a utilização do aplicativo "Roteirista PRO" ("Software"), desenvolvido e disponibilizado pela CINEMARKETING CONTEÚDO E ENTRETENIMENTO LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 05.350.563/0001-23, com sede em Itaúna, Minas Gerais, doravante denominada "LICENCIANTE", pelo usuário, doravante denominado "USUÁRIO".</p>
            <p>Ao clicar em "Aceito" ou ao utilizar o Software, o USUÁRIO declara ter lido, compreendido e concordado integralmente com as disposições deste Termo.</p>

            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA PRIMEIRA – DO OBJETO</h2>
            <p>1.1. O presente Termo tem por objeto regular a licença de uso, não exclusiva e intransferível, do Software pelo USUÁRIO. O Software "Roteirista Pro" utiliza a metodologia Lean Film Design, descrita no livro "Manual Prático de Criação para Diretores, Roteiristas e Produtores Modernos", para analisar roteiros e gerar insights baseados em Inteligência Artificial (IA), auxiliando o USUÁRIO no desenvolvimento de projetos audiovisuais. As funcionalidades incluem, mas não se limitam a: análise estrutural de roteiros, desenvolvimento e análise de perfis de personagens, sugestão de elementos narrativos e temáticos, otimização de diálogos e avaliação da viabilidade de projetos audiovisuais com base nos princípios da metodologia Lean Film Design.</p>

            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA SEGUNDA – DA LEI GERAL DE PROTEÇÃO DE DADOS (LGPD)</h2>
            <p>2.1. A LICENCIANTE compromete-se a tratar os dados pessoais dos USUÁRIOS em estrita conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD) e demais legislações aplicáveis.</p>
            <p>2.2. Os dados coletados serão utilizados exclusivamente para as finalidades necessárias à prestação dos serviços oferecidos pelo Software, como cadastro do USUÁRIO, personalização da experiência no aplicativo, processamento e análise dos roteiros e informações inseridas pelo USUÁRIO para fornecer os insights e funcionalidades da metodologia Lean Film Design, e comunicação sobre atualizações ou informações relevantes do Software.</p>
            <p>2.3. O USUÁRIO, ao aceitar este Termo, consente com a coleta e tratamento de seus dados pessoais para as finalidades aqui descritas.</p>
            <p>2.4. A LICENCIANTE empregará medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito.</p>
            <p>2.5. Para mais informações sobre o tratamento de dados pessoais, o USUÁRIO deverá consultar a Política de Privacidade do Software, disponibilizada juntamente com este Termo e no website oficial da LICENCIANTE.</p>

            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA TERCEIRA – DOS DIREITOS AUTORAIS E SIGILO</h2>
            <p>3.1. Todo o conteúdo inserido pelo USUÁRIO no Software, incluindo, mas não se limitando a, roteiros, ideias, projetos, textos e quaisquer outros materiais criativos ("Conteúdo do Usuário"), é de sua exclusiva titularidade e responsabilidade.</p>
            <p>3.2. A LICENCIANTE compromete-se a manter o mais absoluto sigilo sobre todo o Conteúdo do Usuário, utilizando-o estritamente para a funcionalidade do Software e para fornecer os serviços relacionados à metodologia Lean Film Design, conforme solicitado e iniciado pelo USUÁRIO.</p>
            <p>3.3. A LICENCIANTE garante que o Conteúdo do Usuário não será divulgado, compartilhado, copiado, modificado ou utilizado para quaisquer outras finalidades que não as expressamente permitidas neste Termo ou consentidas pelo USUÁRIO.</p>
            <p>3.4. Os direitos autorais inerentes ao Conteúdo do Usuário são integralmente preservados, não havendo qualquer cessão ou licença de direitos autorais à LICENCIANTE pela simples utilização do Software.</p>

            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA QUARTA – DA NÃO UTILIZAÇÃO DE DADOS PARA ALIMENTAR MODELOS DE INTELIGÊNCIA ARTIFICIAL (IA)</h2>
            <p>4.1. A LICENCIANTE declara e garante expressamente que nenhum dado pessoal do USUÁRIO e nenhum Conteúdo do Usuário inserido no Software será utilizado para treinar, alimentar, aprimorar ou desenvolver quaisquer modelos de inteligência artificial, algoritmos de aprendizado de máquina ou tecnologias similares, sejam eles proprietários da LICENCIANTE ou de terceiros, para além das funcionalidades explícitas e sob demanda do USUÁRIO dentro do Software.</p>

            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA QUINTA – DA NATUREZA DO TERMO E RESCISÃO</h2>
            <p>5.1. O aceite deste Termo configura um contrato de licença de uso de software entre a LICENCIANTE e o USUÁRIO.</p>
            <p>5.2. Este Termo vigorará por prazo indeterminado, a partir da data de seu aceite pelo USUÁRIO.</p>
            <p>5.3. Qualquer das partes poderá rescindir o presente Termo a qualquer momento, imotivadamente, mediante simples comunicação à outra parte ou através da descontinuação do uso do Software e solicitação de exclusão de conta, sem que isso gere qualquer ônus, multa ou prejuízo, ressalvadas as obrigações pendentes e o disposto nas cláusulas de sigilo e proteção de dados, que permanecerão em vigor mesmo após a rescisão.</p>
            <p>5.4. Em caso de rescisão pelo USUÁRIO, este poderá solicitar a exclusão de seus dados pessoais e Conteúdo do Usuário dos servidores da LICENCIANTE, nos termos da Política de Privacidade.</p>

            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA SEXTA – DAS OBRIGAÇÕES DO USUÁRIO</h2>
            <p>6.1. O USUÁRIO se compromete a utilizar o Software de forma lícita, em conformidade com a legislação vigente, a moral e os bons costumes.</p>
            <p>6.2. O USUÁRIO é o único responsável pela veracidade, exatidão e legalidade dos dados e do Conteúdo do Usuário inseridos no Software.</p>
            <p>6.3. O USUÁRIO se compromete a manter seus dados de acesso (login e senha) em sigilo, não os compartilhando com terceiros.</p>

            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA SÉTIMA – DAS OBRIGAÇÕES DA LICENCIANTE</h2>
            <p>7.1. A LICENCIANTE se compromete a manter o Software em funcionamento regular, envidando seus melhores esforços para corrigir eventuais falhas no menor tempo possível.</p>
            <p>7.2. A LICENCIANTE poderá realizar atualizações e modificações no Software visando à melhoria de suas funcionalidades, mediante aviso prévio ao USUÁRIO, quando aplicável.</p>
            
            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA OITAVA – DA PROPRIEDADE INTELECTUAL DO SOFTWARE</h2>
            <p>8.1. O Software "Roteirista Pro", sua estrutura, organização, código-fonte, design, metodologia subjacente, marcas, logotipos e demais elementos de propriedade intelectual são de titularidade exclusiva da LICENCIANTE ou de seus licenciadores, sendo protegidos pelas leis de propriedade intelectual.</p>
            <p>8.2. Este Termo não confere ao USUÁRIO qualquer direito de propriedade intelectual sobre o Software, mas tão somente uma licença de uso, nos termos aqui estabelecidos.</p>

            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA NONA – DAS DISPOSIÇÕES GERAIS</h2>
            <p>9.1. Este Termo poderá ser atualizado periodicamente pela LICENCIANTE para refletir alterações no Software ou na legislação aplicável. O USUÁRIO será notificado sobre alterações significativas. A continuidade do uso do Software após tais alterações implicará na aceitação dos novos termos.</p>
            <p>9.2. A tolerância de uma parte com relação ao descumprimento de qualquer obrigação prevista neste Termo pela outra parte não implicará novação ou renúncia a qualquer direito.</p>
            <p>9.3. Caso qualquer disposição deste Termo seja considerada nula, anulável, inválida ou inoperante, as demais disposições permanecerão em pleno vigor e efeito.</p>
            
            <h2 className="text-xl font-semibold text-foreground">CLÁUSULA DÉCIMA – DO FORO</h2>
            <p>10.1. Para dirimir quaisquer controvérsias oriundas do presente Termo, as partes elegem o foro da Comarca de Itaúna, Estado de Minas Gerais, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
            <p>E, por estarem assim justas e acordadas, o USUÁRIO manifesta seu aceite eletrônico a este Termo ao prosseguir com o uso do Software.</p>

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
