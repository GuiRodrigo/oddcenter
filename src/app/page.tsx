"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { OddsGamesList } from "@/components/games/OddsGamesList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { OddsEvent } from "@/types/game";

function HomePageSkeleton() {
  const [selectedSport, setSelectedSport] = useState<string>(
    "soccer_brazil_campeonato"
  );
  return (
    <MainLayout
      selectedSport={selectedSport}
      setSelectedSport={setSelectedSport}
    >
      <div className="container py-8 px-4 md:px-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [selectedSport, setSelectedSport] = useState<string>(
    "soccer_brazil_campeonato"
  );

  const handleGameSelect = (game: OddsEvent) => {
    console.log("Jogo selecionado:", game);
    // Aqui você pode navegar para a página de detalhes
    // router.push(`/game/${game.id}`)
  };

  if (status === "loading") {
    return <HomePageSkeleton />;
  }

  return (
    <MainLayout
      selectedSport={selectedSport}
      setSelectedSport={setSelectedSport}
    >
      <div className="container py-8 px-4 md:px-6">
        <div className="space-y-6">
          {/* Boas-vindas */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              Bem-vindo{session ? `, ${session.user?.name}` : ""}!
            </h1>
            <p className="text-muted-foreground">
              Explore as melhores odds de apostas esportivas em tempo real.
            </p>
          </div>

          {/* Lista de jogos */}
          {selectedSport ? (
            <OddsGamesList
              sportKey={selectedSport}
              onGameSelect={handleGameSelect}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Selecione um esporte no menu lateral para ver os jogos
                  disponíveis.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
