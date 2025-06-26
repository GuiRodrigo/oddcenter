"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  PlusCircle,
  ChevronRight,
  Trophy,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Importar o componente Skeleton do shadcn/ui

// Componente Skeleton para a página Home usando shadcn/ui Skeleton
function HomePageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-lg" /> {/* Logo placeholder */}
            <Skeleton className="h-6 w-24 rounded" /> {/* Título placeholder */}
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />{" "}
          {/* Avatar placeholder */}
        </div>
      </header>
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-8">
          {/* Boas-vindas e Busca Skeleton */}
          <section className="text-center space-y-2">
            <Skeleton className="h-8 w-64 mx-auto rounded" />
            <Skeleton className="h-5 w-80 mx-auto rounded" />
            <div className="max-w-md mx-auto flex gap-2 mt-4">
              <Skeleton className="flex-1 h-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </section>

          {/* Categorias Favoritas Skeleton */}
          <section>
            <Skeleton className="h-6 w-48 rounded mb-4" />
            <Card className="bg-card p-4">
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-0">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="flex flex-col items-center justify-center p-4 border rounded-lg h-[100px]"
                  />
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Todas as Categorias Skeleton */}
          <section>
            <Skeleton className="h-6 w-40 rounded mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex flex-col items-center justify-center p-4 h-[100px]"
                />
              ))}
            </div>
          </section>

          {/* Jogos Recentes e Futuros Skeleton */}
          <section>
            <Skeleton className="h-6 w-56 rounded mb-4" />
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex items-center justify-between p-4 h-[80px]"
                />
              ))}
            </div>
          </section>

          {/* Melhores Odds Skeleton */}
          <section>
            <Skeleton className="h-6 w-36 rounded mb-4" />
            <div className="grid gap-4">
              <Skeleton className="flex items-center justify-between p-4 h-[80px]" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  if (status === "loading") {
    return <HomePageSkeleton />; // Exibe o skeleton durante o carregamento
  }

  const categories = [
    { name: "Futebol", icon: <Trophy className="h-5 w-5" /> },
    { name: "Basquete", icon: <Trophy className="h-5 w-5" /> },
    { name: "Tênis", icon: <Trophy className="h-5 w-5" /> },
    { name: "eSports", icon: <Trophy className="h-5 w-5" /> },
    { name: "Fórmula 1", icon: <Trophy className="h-5 w-5" /> },
  ];

  const favoriteCategories = [
    { name: "Futebol", icon: <Trophy className="h-5 w-5" /> },
    { name: "Basquete", icon: <Trophy className="h-5 w-5" /> },
  ];

  const games = [
    {
      id: 1,
      category: "Futebol",
      teams: "Real Madrid vs Barcelona",
      time: "Hoje, 20:00",
      odds: "1.80 / 3.50 / 4.20",
    },
    {
      id: 2,
      category: "Basquete",
      teams: "Lakers vs Celtics",
      time: "Amanhã, 22:00",
      odds: "1.50 / 2.80",
    },
    {
      id: 3,
      category: "Tênis",
      teams: "Djokovic vs Nadal",
      time: "Amanhã, 14:00",
      odds: "1.90 / 1.90",
    },
  ];

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

          {/* Categorias Favoritas (Drag & Drop Placeholder) */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Minhas Categorias Favoritas
            </h2>
            <Card className="bg-card p-4">
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-0">
                {favoriteCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-grab"
                  >
                    {category.icon}
                    <span className="mt-2 text-sm font-medium">
                      {category.name}
                    </span>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center p-4 h-auto min-h-[100px] border-dashed border-2"
                >
                  <PlusCircle className="h-6 w-6 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">
                    Adicionar
                  </span>
                </Button>
              </CardContent>
              <CardDescription className="mt-4 text-center">
                Arraste e solte para organizar suas categorias favoritas.
              </CardDescription>
            </Card>
          </section>

          {/* Todas as Categorias */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Todas as Categorias
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className="flex flex-col items-center justify-center p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <CardContent className="p-0 flex flex-col items-center">
                    {category.icon}
                    <span className="mt-2 text-sm font-medium">
                      {category.name}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Jogos Recentes e Futuros */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Jogos Recentes e Futuros
            </h2>
            <div className="grid gap-4">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{game.teams}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {game.category} - {game.time}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-primary">
                      {game.odds}
                    </span>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Melhores Odds */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Melhores Odds
            </h2>
            <div className="grid gap-4">
              {/* Placeholder para melhores odds, similar aos jogos */}
              {games.slice(0, 1).map((game) => (
                <Card
                  key={`best-odd-${game.id}`}
                  className="flex items-center justify-between p-4 bg-primary/10 border-primary"
                >
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{game.teams}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {game.category} - {game.time}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary text-lg">
                      {game.odds}
                    </span>
                    <Button variant="default" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
