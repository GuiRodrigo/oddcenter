"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameCard, type Game } from "./GameCard";
import { Search, SortAsc, SortDesc } from "lucide-react";

type GamesSectionProps = {
  games: Game[];
  title: string;
  icon: React.ReactNode;
  showFilters?: boolean;
  onViewDetails?: (gameId: number) => void;
};

export function GamesSection({
  games,
  title,
  icon,
  showFilters = true,
  onViewDetails,
}: GamesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"odds" | "time" | "category">("odds");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(games.map((game) => game.category)));
    return cats.sort();
  }, [games]);

  const filteredAndSortedGames = useMemo(() => {
    const filtered = games.filter((game) => {
      const matchesSearch =
        game.teams.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.league?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);

      const matchesCategory =
        selectedCategory === "all" || game.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || game.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "odds":
          const aMaxOdd = Math.max(a.odds.home, a.odds.draw || 0, a.odds.away);
          const bMaxOdd = Math.max(b.odds.home, b.odds.draw || 0, b.odds.away);
          comparison = aMaxOdd - bMaxOdd;
          break;
        case "time":
          comparison =
            new Date(a.date + " " + a.time).getTime() -
            new Date(b.date + " " + b.time).getTime();
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [games, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {icon}
          {title}
          <Badge variant="secondary" className="ml-2">
            {filteredAndSortedGames.length}
          </Badge>
        </h2>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar jogos, times ou ligas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="live">Ao Vivo</SelectItem>
              <SelectItem value="upcoming">Próximos</SelectItem>
              <SelectItem value="finished">Finalizados</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: "odds" | "time" | "category") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="odds">Melhores Odds</SelectItem>
                <SelectItem value="time">Horário</SelectItem>
                <SelectItem value="category">Categoria</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortOrder}
              className="shrink-0"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {filteredAndSortedGames.length > 0 ? (
          filteredAndSortedGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onViewDetails={onViewDetails}
              variant={game.bestOdd ? "featured" : "default"}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum jogo encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </section>
  );
}
