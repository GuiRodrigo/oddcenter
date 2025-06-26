"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { useOdds } from "@/components/odds/OddsContext";
import type { OddsEvent, OddsBookmaker } from "@/types/game";
import { format } from "date-fns";

type OddsGamesListProps = {
  sportKey: string;
  onGameSelect?: (game: OddsEvent) => void;
};

// Função para identificar esportes que não têm empate
const sportHasDraw = (sportKey: string): boolean => {
  const noDrawSports = [
    "basketball",
    "tennis",
    "baseball",
    "americanfootball_nfl",
    "americanfootball_ncaaf",
    "icehockey_nhl",
    "mma",
    "boxing",
  ];

  return !noDrawSports.some((sport) => sportKey.toLowerCase().includes(sport));
};

// Função para obter nome amigável do mercado
const getMarketDisplayName = (marketKey: string): string => {
  const marketNames: Record<string, string> = {
    h2h: "Resultado Final",
    spreads: "Handicap",
    totals: "Total de Pontos",
    outrights: "Vencedor",
  };

  return marketNames[marketKey] || marketKey.toUpperCase();
};

// Função para obter nome amigável do resultado
const getOutcomeDisplayName = (
  outcomeName: string,
  homeTeam: string,
  awayTeam: string,
  hasDraw: boolean
): string => {
  if (outcomeName === homeTeam) return "Casa";
  if (outcomeName === awayTeam) return "Fora";
  if (outcomeName === "Draw" && hasDraw) return "Empate";
  return outcomeName;
};

// Tipos auxiliares para odds de bookmakers
interface BookmakerOutcome {
  name: string;
  displayName: string;
  price: number;
}

interface BookmakerOdds {
  bookmaker: string;
  outcomes: BookmakerOutcome[];
}

interface BestOddsComparison {
  outcome: string;
  bestPrice: number;
  bestBookmaker: string;
  allPrices: { bookmaker: string; price: number }[];
}

export function OddsGamesList({ sportKey, onGameSelect }: OddsGamesListProps) {
  const { fetchOdds } = useOdds();
  const [games, setGames] = useState<OddsEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sportKey) return;

    const loadGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOdds(sportKey);
        setGames(data);
      } catch (err) {
        setError("Erro ao carregar jogos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [sportKey, fetchOdds]);

  const formatGameTime = (commenceTime: string) => {
    const date = new Date(commenceTime);
    return {
      date: format(date, "dd/MM"),
      time: format(date, "HH:mm"),
    };
  };

  const getBookmakersOdds = (game: OddsEvent) => {
    if (!game.bookmakers.length) return null;

    const hasDraw = sportHasDraw(game.sport_key);

    // Pegar até 3 bookmakers
    const selectedBookmakers = game.bookmakers.slice(0, 3);

    const bookmakerOdds = selectedBookmakers
      .map((bookmaker: OddsBookmaker) => {
        const h2hMarket = bookmaker.markets.find((m) => m.key === "h2h");
        if (!h2hMarket) return null;

        // Filtrar outcomes baseado se o esporte tem empate
        let outcomes = h2hMarket.outcomes;
        if (!hasDraw) {
          outcomes = outcomes.filter(
            (outcome) =>
              outcome.name === game.home_team || outcome.name === game.away_team
          );
        }

        return {
          bookmaker: bookmaker.title,
          outcomes: outcomes.map((outcome) => ({
            name: outcome.name,
            displayName: getOutcomeDisplayName(
              outcome.name,
              game.home_team,
              game.away_team,
              hasDraw
            ),
            price: outcome.price,
          })),
        };
      })
      .filter((bm): bm is BookmakerOdds => bm !== null);

    return {
      marketName: getMarketDisplayName("h2h"),
      bookmakers: bookmakerOdds,
      hasDraw,
    };
  };

  // Função para encontrar a melhor odd de cada resultado
  const getBestOddsComparison = (
    bookmakerOdds: BookmakerOdds[]
  ): BestOddsComparison[] => {
    if (!bookmakerOdds.length) return [];

    const allOutcomes = bookmakerOdds[0].outcomes.map(
      (outcome) => outcome.displayName
    );

    return allOutcomes
      .map((outcomeName) => {
        const oddsForOutcome = bookmakerOdds
          .map((bm) => {
            const outcome = bm.outcomes.find(
              (o) => o.displayName === outcomeName
            );
            return outcome
              ? { bookmaker: bm.bookmaker, price: outcome.price }
              : null;
          })
          .filter(
            (item): item is { bookmaker: string; price: number } =>
              item !== null
          );

        if (!oddsForOutcome.length) return null;
        const bestOdd = oddsForOutcome.reduce((best, current) =>
          current.price > best.price ? current : best
        );

        return {
          outcome: outcomeName,
          bestPrice: bestOdd.price,
          bestBookmaker: bestOdd.bookmaker,
          allPrices: oddsForOutcome,
        };
      })
      .filter((item): item is BestOddsComparison => item !== null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!games.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum jogo encontrado para este esporte.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Jogos Disponíveis</h2>
        <Badge variant="secondary">{games.length} jogos</Badge>
      </div>

      <div className="grid gap-4">
        {games.map((game) => {
          const { date, time } = formatGameTime(game.commence_time);
          const oddsData = getBookmakersOdds(game);

          if (!oddsData) return null;

          const bestOddsComparison = getBestOddsComparison(oddsData.bookmakers);

          return (
            <Card
              key={game.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onGameSelect?.(game)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {game.sport_title}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {oddsData.marketName}
                    </Badge>
                  </div>
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

                <CardTitle className="text-lg mb-4">
                  {game.home_team} vs {game.away_team}
                </CardTitle>

                {/* Melhores Odds */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Melhores Odds
                  </h4>
                  <div className="flex gap-3">
                    {bestOddsComparison.map((comparison, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          {comparison.outcome}
                        </p>
                        <Badge variant="default" className="font-mono text-sm">
                          {comparison.bestPrice.toFixed(2)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {comparison.bestBookmaker}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparação entre Bookmakers */}
                {oddsData.bookmakers.length > 1 ? (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Comparação de Bookmakers
                    </h4>
                    <div className="space-y-2">
                      {oddsData.bookmakers.map(
                        (bookmaker: BookmakerOdds, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-medium text-xs">
                              {bookmaker.bookmaker}
                            </span>
                            <div className="flex gap-2">
                              {bookmaker.outcomes.map(
                                (
                                  outcome: BookmakerOutcome,
                                  outcomeIndex: number
                                ) => (
                                  <div
                                    key={outcomeIndex}
                                    className="text-center"
                                  >
                                    <Badge
                                      variant="outline"
                                      className="font-mono text-xs"
                                    >
                                      {outcome.price.toFixed(2)}
                                    </Badge>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
