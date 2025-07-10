// src/app/(main)/masterclass/page.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Film } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MasterclassPlayer } from "@/components/masterclass-player";

type YouTubePlaylistItem = {
    id: string;
    snippet: {
        title: string;
        description: string;
        resourceId: {
            videoId: string;
        };
        thumbnails: {
            medium: {
                url: string;
            };
        };
    };
};

type YouTubePlaylistResponse = {
    items: YouTubePlaylistItem[];
    error?: {
        message: string;
    };
};

async function getPlaylistVideos(playlistId: string, apiKey: string) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=50`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalida a cada hora
        const data: YouTubePlaylistResponse = await response.json();

        if (!response.ok || data.error) {
            console.error("YouTube API Error:", data.error?.message);
            throw new Error(data.error?.message || "Failed to fetch playlist");
        }
        
        return data.items.map(item => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.medium.url,
        }));

    } catch (error) {
        console.error("Error fetching playlist:", error);
        return [];
    }
}

function MasterclassSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
            <div className="lg:col-span-1">
                 <Skeleton className="h-[500px] w-full" />
            </div>
        </div>
    );
}


export default async function MasterclassPage({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const PLAYLIST_ID = "PLdUIXdl_CuSaEo9C59b1Kee3ROXIOSFYi";

    if (!YOUTUBE_API_KEY) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro de Configuração</AlertTitle>
                <AlertDescription>
                    A chave da API do YouTube não está configurada no servidor.
                </AlertDescription>
            </Alert>
        );
    }

    const videos = await getPlaylistVideos(PLAYLIST_ID, YOUTUBE_API_KEY);

    if (videos.length === 0) {
        return (
             <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nenhum vídeo encontrado</AlertTitle>
                <AlertDescription>
                   Não foi possível carregar os vídeos da playlist. Verifique a chave da API e o ID da playlist.
                </AlertDescription>
            </Alert>
        );
    }

    const currentVideoId = searchParams?.v || videos[0].id;
    const currentVideo = videos.find(v => v.id === currentVideoId) || videos[0];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-headline font-bold">Masterclass</h1>
                <p className="text-muted-foreground">Aprenda com especialistas e aprimore suas habilidades de roteiro.</p>
            </header>

            <Suspense fallback={<MasterclassSkeleton />}>
                <MasterclassPlayer
                    videos={videos}
                    currentVideo={currentVideo}
                />
            </Suspense>
        </div>
    );
}