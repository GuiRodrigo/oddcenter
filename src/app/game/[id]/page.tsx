"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Thermometer,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  AlertTriangle,
} from "lucide-react";
import type { GameDetail } from "@/types/game";

// Dados mockados para demonstração
const getGameDetails = (id: string): GameDetail | null => {
  const games: Record<string, GameDetail> = {
    "1": {
      id: 1,
      category: "Futebol",
      homeTeam: {
        name: "Real Madrid",
        form: ["W", "W", "D", "W", "L"],
        position: 2,
        points: 45,
        goalsFor: 32,
        goalsAgainst: 15,
      },
      awayTeam: {
        name: "Barcelona",
        form: ["W", "L", "W", "W", "D"],
        position: 1,
        points: 48,
        goalsFor: 35,
        goalsAgainst: 12,
      },
      time: "20:00",
      date: "2024-01-15",
      status: "upcoming",
      league: "La Liga",
      venue: "Santiago Bernabéu",
      referee: "Antonio Mateu Lahoz",
      temperature: "18°C",
      weather: "Céu limpo",
      markets: [
        {
          id: "match-result",
          name: "Resultado Final",
          odds: [
            { option: "Real Madrid", value: 2.1, change: -0.05 },
            { option: "Empate", value: 3.4, change: 0.1 },
            { option: "Barcelona", value: 3.2, change: 0.02 },
          ],
        },
        {
          id: "both-teams-score",
          name: "Ambos Marcam",
          odds: [
            { option: "Sim", value: 1.65, change: -0.02 },
            { option: "Não", value: 2.25, change: 0.05 },
          ],
        },
        {
          id: "total-goals",
          name: "Total de Gols",
          odds: [
            { option: "Menos de 2.5", value: 2.8, change: 0.15 },
            { option: "Mais de 2.5", value: 1.45, change: -0.08 },
            { option: "Mais de 3.5", value: 2.6, change: -0.1 },
          ],
        },
        {
          id: "handicap",
          name: "Handicap Asiático",
          odds: [
            { option: "Real Madrid (-0.5)", value: 1.95, change: -0.03 },
            { option: "Barcelona (+0.5)", value: 1.85, change: 0.04 },
          ],
        },
      ],
      headToHead: {
        homeWins: 12,
        awayWins: 8,
        draws: 5,
        lastMeetings: [
          {
            date: "2023-10-28",
            result: "Barcelona 2-1 Real Madrid",
            score: "2-1",
          },
          {
            date: "2023-04-05",
            result: "Real Madrid 4-0 Barcelona",
            score: "4-0",
          },
          {
            date: "2023-01-15",
            result: "Barcelona 3-1 Real Madrid",
            score: "3-1",
          },
        ],
      },
    },
    "2": {
      id: 2,
      category: "Basquete",
      homeTeam: {
        name: "Lakers",
        form: ["W", "W", "L", "W", "W"],
        position: 3,
        points: 0,
      },
      awayTeam: {
        name: "Celtics",
        form: ["L", "W", "W", "W", "L"],
        position: 1,
        points: 0,
      },
      time: "22:00",
      date: "2024-01-15",
      status: "live",
      league: "NBA",
      venue: "Crypto.com Arena",
      markets: [
        {
          id: "match-winner",
          name: "Vencedor da Partida",
          odds: [
            { option: "Lakers", value: 1.85, change: 0.05 },
            { option: "Celtics", value: 1.95, change: -0.03 },
          ],
        },
        {
          id: "total-points",
          name: "Total de Pontos",
          odds: [
            { option: "Menos de 220.5", value: 1.9, change: 0.02 },
            { option: "Mais de 220.5", value: 1.9, change: -0.02 },
          ],
        },
      ],
      liveStats: {
        possession: { home: 52, away: 48 },
        shots: { home: 45, away: 42 },
        corners: { home: 0, away: 0 },
        yellowCards: { home: 0, away: 0 },
        redCards: { home: 0, away: 0 },
      },
    },
  };

  return games[id] || null;
};

function GameDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-48 w-full" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const gameData = getGameDetails(params.id as string);
      setGame(gameData);
      setLoading(false);
    }
  }, [params.id]);

  if (status === "loading" || loading) {
    return <GameDetailSkeleton />;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  if (!game) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container py-8 px-4 md:px-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Jogo não encontrado</h1>
            <p className="text-muted-foreground">
              O jogo que você está procurando não existe.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const getStatusColor = (status: GameDetail["status"]) => {
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

  const getStatusText = (status: GameDetail["status"]) => {
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

  const getFormIcon = (result: string) => {
    switch (result) {
      case "W":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "L":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case "D":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const getOddChangeIcon = (change?: number) => {
    if (!change) return <Minus className="h-3 w-3 text-muted-foreground" />;
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    return <TrendingDown className="h-3 w-3 text-red-500" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-6">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {/* Cabeçalho do Jogo */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{game.category}</Badge>
                  <Badge className={getStatusColor(game.status)}>
                    {getStatusText(game.status)}
                  </Badge>
                </div>
                <Badge variant="outline">{game.league}</Badge>
              </div>

              <CardTitle className="text-2xl text-center mb-4">
                {game.homeTeam.name} vs {game.awayTeam.name}
              </CardTitle>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time da Casa */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">
                    {game.homeTeam.name}
                  </h3>
                  {game.homeTeam.position && (
                    <p className="text-sm text-muted-foreground">
                      {game.homeTeam.position}º lugar • {game.homeTeam.points}{" "}
                      pts
                    </p>
                  )}
                  <div className="flex justify-center gap-1">
                    {game.homeTeam.form.map((result, i) => (
                      <div key={i} className="flex items-center justify-center">
                        {getFormIcon(result)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Visitante */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">
                    {game.awayTeam.name}
                  </h3>
                  {game.awayTeam.position && (
                    <p className="text-sm text-muted-foreground">
                      {game.awayTeam.position}º lugar • {game.awayTeam.points}{" "}
                      pts
                    </p>
                  )}
                  <div className="flex justify-center gap-1">
                    {game.awayTeam.form.map((result, i) => (
                      <div key={i} className="flex items-center justify-center">
                        {getFormIcon(result)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{game.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{game.time}</span>
                </div>
                {game.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{game.venue}</span>
                  </div>
                )}
                {game.temperature && (
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span>{game.temperature}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs para diferentes seções */}
          <Tabs defaultValue="odds" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="odds">Odds</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="h2h">Histórico</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
            </TabsList>

            {/* Odds */}
            <TabsContent value="odds" className="space-y-4">
              {game.markets.map((market) => (
                <Card key={market.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{market.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {market.odds.map((odd, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <span className="font-medium">{odd.option}</span>
                          <div className="flex items-center gap-2">
                            {getOddChangeIcon(odd.change)}
                            <Badge
                              variant="outline"
                              className="font-mono text-lg"
                            >
                              {odd.value.toFixed(2)}
                            </Badge>
                            {odd.change && (
                              <span
                                className={`text-xs ${
                                  odd.change > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {odd.change > 0 ? "+" : ""}
                                {odd.change.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Estatísticas */}
            <TabsContent value="stats" className="space-y-4">
              {game.liveStats ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas ao Vivo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Posse de Bola</span>
                          <span>
                            {game.liveStats.possession.home}% -{" "}
                            {game.liveStats.possession.away}%
                          </span>
                        </div>
                        <Progress
                          value={game.liveStats.possession.home}
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">
                            {game.liveStats.shots.home}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Chutes
                          </p>
                        </div>
                        <div className="flex items-center justify-center">
                          <Target className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {game.liveStats.shots.away}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Chutes
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas dos Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold">{game.homeTeam.name}</h4>
                        {game.homeTeam.goalsFor && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Gols Marcados
                            </p>
                            <p className="text-xl font-bold">
                              {game.homeTeam.goalsFor}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold">{game.awayTeam.name}</h4>
                        {game.awayTeam.goalsFor && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Gols Marcados
                            </p>
                            <p className="text-xl font-bold">
                              {game.awayTeam.goalsFor}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Histórico */}
            <TabsContent value="h2h" className="space-y-4">
              {game.headToHead && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Confronto Direto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-500">
                            {game.headToHead.homeWins}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Vitórias {game.homeTeam.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-500">
                            {game.headToHead.draws}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Empates
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-500">
                            {game.headToHead.awayWins}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Vitórias {game.awayTeam.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Últimos Confrontos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {game.headToHead.lastMeetings.map((meeting, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{meeting.result}</p>
                              <p className="text-sm text-muted-foreground">
                                {meeting.date}
                              </p>
                            </div>
                            <Badge variant="outline">{meeting.score}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Informações */}
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Partida</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {game.referee && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>Árbitro:</strong> {game.referee}
                        </span>
                      </div>
                    )}
                    {game.weather && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>Clima:</strong> {game.weather}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
