"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Calendar, Clock } from "lucide-react";
import { useOdds } from "@/components/odds/OddsContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type ScoreEvent = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  scores?: number[];
  last_update?: string;
  completed?: boolean;
};

type ScoresListProps = {
  sportKey: string;
  searchTerm?: string;
  showCompleted?: boolean;
};

export function ScoresList({
  sportKey,
  searchTerm,
  showCompleted = true,
}: ScoresListProps) {
  const { fetchScores } = useOdds();
  const [scores, setScores] = useState<ScoreEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sportKey) return;

    const loadScores = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchScores(sportKey);
        setScores(data);
      } catch (err) {
        setError("Erro ao carregar scores");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadScores();
  }, [sportKey, fetchScores]);

  const formatGameTime = (commenceTime: string) => {
    const date = new Date(commenceTime);
    return {
      date: format(date, "dd/MM"),
      time: format(date, "HH:mm"),
    };
  };

  const getStatusColor = (completed?: boolean) => {
    return completed ? "bg-green-500" : "bg-blue-500";
  };

  const getStatusText = (completed?: boolean) => {
    return completed ? "FINALIZADO" : "EM ANDAMENTO";
  };

  const formatScore = (scores?: number[]) => {
    if (!scores || scores.length < 2) return "N/A";
    return `${scores[0]} - ${scores[1]}`;
  };

  // Filtrar scores
  const filteredScores = scores.filter((score) => {
    const matchesSearch = searchTerm
      ? score.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        score.away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        score.sport_title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesCompletion = showCompleted ? true : !score.completed;

    return matchesSearch && matchesCompletion;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Erro ao carregar scores
          </h3>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Verifique se o esporte selecionado tem jogos com scores disponíveis.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!filteredScores.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhum score encontrado
          </h3>
          <p className="text-muted-foreground">
            Não há scores ou resultados disponíveis para{" "}
            {sportKey.replace(/_/g, " ")} no momento.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Tente selecionar outro esporte ou verificar mais tarde.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Scores e Resultados
        </h2>
        <Badge variant="secondary">{filteredScores.length} jogos</Badge>
      </div>

      <div className="grid gap-4">
        {filteredScores.map((score) => {
          const { date, time } = formatGameTime(score.commence_time);

          return (
            <Card
              key={score.id}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {score.sport_title}
                    </Badge>
                    <Badge
                      className={cn("text-xs", getStatusColor(score.completed))}
                    >
                      {getStatusText(score.completed)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <CardTitle className="text-lg leading-tight">
                    {score.home_team} vs {score.away_team}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Resultado:</span>
                    <Badge variant="outline" className="text-sm font-mono">
                      {formatScore(score.scores)}
                    </Badge>
                  </div>
                  {score.last_update && (
                    <div className="text-xs text-muted-foreground">
                      Atualizado: {format(new Date(score.last_update), "HH:mm")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
