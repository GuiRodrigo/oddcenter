"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trophy, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteCategories } from "@/components/dnd/FavoriteCategories";
import { GamesSection } from "@/components/games/GamesSection";
import type { Game } from "@/components/games/GameCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DroppableRemoveArea } from "@/components/dnd/DroppableRemoveArea";

// Componente Skeleton para a página Home usando shadcn/ui Skeleton
function HomePageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-8">
          <section className="text-center space-y-2">
            <Skeleton className="h-8 w-64 mx-auto rounded" />
            <Skeleton className="h-5 w-80 mx-auto rounded" />
            <div className="max-w-md mx-auto flex gap-2 mt-4">
              <Skeleton className="flex-1 h-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </section>
          <section>
            <Skeleton className="h-6 w-48 rounded mb-4" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg mb-4" />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [allCategories] = useState([
    { id: "1", name: "Futebol", icon: <Trophy className="h-5 w-5" /> },
    { id: "2", name: "Basquete", icon: <Trophy className="h-5 w-5" /> },
    { id: "3", name: "Tênis", icon: <Trophy className="h-5 w-5" /> },
    { id: "4", name: "eSports", icon: <Trophy className="h-5 w-5" /> },
    { id: "5", name: "Fórmula 1", icon: <Trophy className="h-5 w-5" /> },
  ]);

  const [favoriteCategories, setFavoriteCategories] = useState(() => [
    allCategories[0],
    allCategories[1],
  ]);

  // Dados mais realistas dos jogos
  const [games] = useState<Game[]>([
    {
      id: 1,
      category: "Futebol",
      teams: "Real Madrid vs Barcelona",
      time: "20:00",
      date: "2024-01-15",
      odds: { home: 2.1, draw: 3.4, away: 3.2 },
      status: "upcoming",
      league: "La Liga",
      bestOdd: true,
    },
    {
      id: 2,
      category: "Basquete",
      teams: "Lakers vs Celtics",
      time: "22:00",
      date: "2024-01-15",
      odds: { home: 1.85, away: 1.95 },
      status: "live",
      league: "NBA",
    },
    {
      id: 3,
      category: "Tênis",
      teams: "Djokovic vs Nadal",
      time: "14:00",
      date: "2024-01-16",
      odds: { home: 1.9, away: 1.9 },
      status: "upcoming",
      league: "ATP Masters",
    },
    {
      id: 4,
      category: "Futebol",
      teams: "Manchester City vs Liverpool",
      time: "17:30",
      date: "2024-01-16",
      odds: { home: 2.25, draw: 3.1, away: 3.4 },
      status: "upcoming",
      league: "Premier League",
      bestOdd: true,
    },
    {
      id: 5,
      category: "eSports",
      teams: "Team Liquid vs FaZe Clan",
      time: "19:00",
      date: "2024-01-15",
      odds: { home: 1.75, away: 2.05 },
      status: "live",
      league: "CS2 Major",
    },
    {
      id: 6,
      category: "Basquete",
      teams: "Warriors vs Nets",
      time: "21:30",
      date: "2024-01-16",
      odds: { home: 1.65, away: 2.2 },
      status: "upcoming",
      league: "NBA",
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id === "remove-area") {
      setFavoriteCategories((items) =>
        items.filter((item) => item.id !== active.id)
      );
    } else if (over && active.id !== over.id) {
      setFavoriteCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setIsDragging(false);
  };

  const handleViewGameDetails = (gameId: number) => {
    console.log("Ver detalhes do jogo:", gameId);
    // Aqui você implementaria a navegação para a página de detalhes
  };

  if (status === "loading") {
    return <HomePageSkeleton />;
  }

  // Separar jogos por categoria
  const liveGames = games.filter((game) => game.status === "live");
  const upcomingGames = games.filter((game) => game.status === "upcoming");
  const bestOddsGames = games.filter((game) => game.bestOdd).slice(0, 3);

  // Novo: filtrar jogos pela busca
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredGames = trimmedQuery
    ? games.filter(
        (game) =>
          game.teams.toLowerCase().includes(trimmedQuery) ||
          game.category.toLowerCase().includes(trimmedQuery) ||
          (game.league?.toLowerCase().includes(trimmedQuery) ?? false)
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-8">
          {/* Boas-vindas e Busca */}
          <section className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              Bem-vindo{session ? `, ${session.user?.name}` : ""}!
            </h1>
            <p className="text-muted-foreground">
              Explore as melhores apostas esportivas.
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <Input
                type="text"
                placeholder="Buscar jogos ou categorias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </section>

          {/* Se estiver pesquisando, mostrar só os resultados filtrados */}
          {trimmedQuery ? (
            <GamesSection
              games={filteredGames}
              title={`Resultados para "${searchQuery}"`}
              icon={<Search className="h-5 w-5 text-primary" />}
              showFilters={false}
              onViewDetails={handleViewGameDetails}
            />
          ) : (
            <>
              {session ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <FavoriteCategories
                    allCategories={allCategories}
                    favoriteCategories={favoriteCategories}
                    setFavoriteCategories={setFavoriteCategories}
                  />
                  <DroppableRemoveArea isDragging={isDragging} />
                </DndContext>
              ) : null}

              {/* Melhores Odds */}
              <GamesSection
                games={bestOddsGames}
                title="Melhores Odds"
                icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                showFilters={false}
                onViewDetails={handleViewGameDetails}
              />

              {/* Jogos Ao Vivo */}
              {liveGames.length > 0 && (
                <GamesSection
                  games={liveGames}
                  title="Jogos Ao Vivo"
                  icon={
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                  }
                  showFilters={false}
                  onViewDetails={handleViewGameDetails}
                />
              )}

              {/* Próximos Jogos */}
              <GamesSection
                games={upcomingGames}
                title="Próximos Jogos"
                icon={<Clock className="h-5 w-5" />}
                showFilters={true}
                onViewDetails={handleViewGameDetails}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
