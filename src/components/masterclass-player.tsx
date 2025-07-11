// src/components/masterclass-player.tsx
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Film } from "lucide-react";

type Video = {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
};

interface MasterclassPlayerProps {
    videos: Video[];
    currentVideo: Video;
}

export function MasterclassPlayer({ videos, currentVideo }: MasterclassPlayerProps) {
    const pathname = usePathname();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardContent className="p-0">
                         <div className="aspect-video bg-black rounded-t-lg">
                            <iframe
                                key={currentVideo.id} // Força a recriação do iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${currentVideo.id}?si=Vgrz1z8V9g2N34gS&amp;showinfo=0&amp;rel=0&amp;autoplay=1`}
                                title={currentVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </CardContent>
                    <CardHeader>
                        <CardTitle className="font-headline">{currentVideo.title}</CardTitle>
                        <CardDescription>{currentVideo.description}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Film/> Próximos Vídeos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[450px]">
                            <div className="space-y-4 pr-4">
                                {videos.map(video => {
                                    const isActive = video.id === currentVideo.id;
                                    return (
                                        <Link key={video.id} href={`${pathname}?v=${video.id}`} className="block">
                                            <div className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted/50'}`}>
                                                <Image
                                                    src={video.thumbnailUrl}
                                                    alt={video.title}
                                                    width={120}
                                                    height={68}
                                                    className="rounded-md aspect-video object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className={`font-semibold text-sm leading-tight ${isActive ? 'text-primary' : ''}`}>
                                                        {video.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}