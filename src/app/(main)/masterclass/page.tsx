import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Youtube } from "lucide-react";

const videos = [
    {
        id: "Wk6hIe2trII",
        title: "COMO ESCREVER UM ROTEIRO DE CINEMA (passo a passo)",
        description: "Um guia completo para iniciantes sobre como estruturar e escrever seu primeiro roteiro de cinema, cobrindo desde a ideia inicial até a formatação final.",
    },
    {
        id: "9T69p4t4OW4",
        title: "A JORNADA DO HERÓI em ROTEIROS DE CINEMA",
        description: "Explore a estrutura clássica da Jornada do Herói de Joseph Campbell e veja como aplicá-la para criar histórias cativantes e personagens memoráveis.",
    },
    {
        id: "C-4T5yGk2Yk",
        title: "O que é um PLOT TWIST? (Exemplos no cinema)",
        description: "Descubra o que faz um plot twist ser eficaz. Este vídeo analisa exemplos famosos do cinema para ensinar como surpreender e engajar sua audiência.",
    },
    {
        id: "lJdAYxYc2tI",
        title: "Como criar PERSONAGENS (para roteiros de cinema)",
        description: "Aprenda técnicas para desenvolver personagens complexos e realistas, com profundidade psicológica, motivações claras e arcos de transformação impactantes.",
    }
];


export default function MasterclassPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-headline font-bold">Masterclass</h1>
        <p className="text-muted-foreground">Aprenda com especialistas e aprimore suas habilidades de roteiro.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {videos.map(video => (
            <Card key={video.id}>
                <CardContent className="p-0">
                    <div className="aspect-video">
                        <iframe
                            className="w-full h-full rounded-t-lg"
                            src={`https://www.youtube.com/embed/${video.id}?si=Vgrz1z8V9g2N34gS&amp;showinfo=0&amp;rel=0`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </CardContent>
                <CardHeader>
                    <CardTitle className="font-headline">{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                </CardHeader>
            </Card>
        ))}
      </div>

    </div>
  );
}
