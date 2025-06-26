"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export type Game = {
  id: number;
  category: string;
  teams: string;
  time: string;
  date: string;
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  status: "live" | "upcoming" | "finished";
  bestOdd?: boolean;
  league?: string;
};

type GameCardProps = {
  game: Game;
  onViewDetails?: (gameId: number) => void;
  variant?: "default" | "featured";
};

export function GameCard({
  game,
  onViewDetails,
  variant = "default",
}: GameCardProps) {
  const isFeatured = variant === "featured" || game.bestOdd;

  const getStatusColor = (status: Game["status"]) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "finished":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: Game["status"]) => {
    switch (status) {
      case "live":
        return "AO VIVO";
      case "upcoming":
        return "PRÓXIMO";
      case "finished":
        return "FINALIZADO";
      default:
        return "AGENDADO";
    }
  };

  const getBestOddValue = () => {
    const odds = [game.odds.home, game.odds.draw, game.odds.away].filter(
      (v): v is number => typeof v === "number"
    );
    return Math.max(...odds);
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer",
        isFeatured && "border-primary bg-primary/5"
      )}
      onClick={() => onViewDetails?.(game.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {game.category}
            </Badge>
            <Badge className={cn("text-xs", getStatusColor(game.status))}>
              {getStatusText(game.status)}
            </Badge>
            {game.bestOdd && (
              <Badge variant="default" className="text-xs bg-green-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                MELHOR ODD
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <CardTitle className="text-lg leading-tight">{game.teams}</CardTitle>
          {game.league && (
            <CardDescription className="text-sm text-muted-foreground">
              {game.league}
            </CardDescription>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {game.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {game.time}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Odds:</span>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs font-mono">
                {game.odds.home}
              </Badge>
              {game.odds.draw && (
                <Badge variant="outline" className="text-xs font-mono">
                  {game.odds.draw}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs font-mono">
                {game.odds.away}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isFeatured && (
              <span className="text-sm font-bold text-primary">
                Até {getBestOddValue()}
              </span>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
