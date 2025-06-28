"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { useOdds } from "@/components/odds/OddsContext";
import type { OddsEvent, OddsBookmaker } from "@/types/game";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { translateOutcome, translateBookmaker } from "@/lib/utils";
import { motion } from "framer-motion";
import orderBy from "lodash/orderBy";

type OddsGamesListProps = {
  sportKey: string;
  searchTerm?: string;
  sortOrder?: "asc" | "desc";
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
    outrights: "Vencedor da Competição",
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
  // Para esportes individuais, retornar o nome do jogador/participante
  if (outcomeName === homeTeam) return "Casa";
  if (outcomeName === awayTeam) return "Fora";
  if (outcomeName === "Draw" && hasDraw) return "Empate";

  // Para outros casos (como golf), retornar o nome traduzido ou original
  return translateOutcome(outcomeName);
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

export function OddsGamesList({
  sportKey,
  searchTerm,
  sortOrder = "asc",
}: OddsGamesListProps) {
  const router = useRouter();
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
        localStorage.setItem("cachedGames", JSON.stringify(data));
      } catch (err) {
        if ((err as { status?: number }).status === 429) {
          setError(
            "Limite de requisições da API atingido. Aguarde alguns minutos e tente novamente."
          );
        } else {
          setError(
            (err as Error).message ||
              "Erro ao carregar jogos. Tente novamente mais tarde."
          );
        }
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

    // Para esportes como golf, procurar por outrights em vez de h2h
    const isIndividualSport = ["golf", "tennis", "mma", "boxing"].some(
      (sport) => game.sport_key.toLowerCase().includes(sport)
    );

    // Pegar até 3 bookmakers
    const selectedBookmakers = game.bookmakers.slice(0, 3);

    const bookmakerOdds = selectedBookmakers
      .map((bookmaker: OddsBookmaker) => {
        const marketKey = isIndividualSport ? "outrights" : "h2h";
        const market = bookmaker.markets.find((m) => m.key === marketKey);

        if (!market) return null;

        // Filtrar outcomes baseado se o esporte tem empate (apenas para h2h)
        let outcomes = market.outcomes;
        if (marketKey === "h2h" && !hasDraw) {
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
      marketName: getMarketDisplayName(isIndividualSport ? "outrights" : "h2h"),
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
          bestBookmaker: translateBookmaker(bestOdd.bookmaker),
          allPrices: oddsForOutcome,
        };
      })
      .filter((item): item is BestOddsComparison => item !== null);
  };

  // Filtrar jogos pelo termo de busca
  const filteredGames = searchTerm
    ? games.filter(
        (game) =>
          game.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.sport_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : games;

  // Ordenar jogos apenas por data
  const sortedGames = orderBy(
    filteredGames,
    (game) => new Date(game.commence_time).getTime(),
    [sortOrder]
  );

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
          <TrendingUp className="h-12 w-12 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-lg font-semibold mb-2">
            {error.includes("Limite")
              ? "Limite de Requisições Atingido"
              : "Erro ao carregar jogos"}
          </h3>
          <p className="text-muted-foreground">{error}</p>
          {error.includes("Limite") && (
            <p className="text-sm text-muted-foreground mt-2">
              Isso acontece quando há muitas requisições em pouco tempo. Por
              favor, aguarde alguns minutos e tente novamente.
              <br />
              Caso o problema persista, entre em contato com o suporte.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!sortedGames.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum jogo encontrado para {sportKey}. Pode ser que não haja
            eventos ativos ou odds disponíveis para este esporte no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Jogos Disponíveis</h2>
        <Badge variant="secondary">{sortedGames.length} jogos</Badge>
      </div>

      <div className="grid gap-4">
        {sortedGames.map((game, i) => {
          const { date, time } = formatGameTime(game.commence_time);
          const oddsData = getBookmakersOdds(game);

          if (!oddsData) return null;

          const bestOddsComparison = getBestOddsComparison(oddsData.bookmakers);

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/game/${game.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs truncate">
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
                            {translateOutcome(comparison.outcome)}
                          </p>
                          <Badge
                            variant="default"
                            className="font-mono text-sm"
                          >
                            {comparison.bestPrice.toFixed(2)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {comparison.bestBookmaker}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comparação entre Casas de Apostas */}
                  {oddsData.bookmakers.length > 1 ? (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Comparação de Casas de Apostas
                      </h4>
                      <div className="space-y-2">
                        {oddsData.bookmakers.map(
                          (bookmaker: BookmakerOdds, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="font-medium text-xs">
                                {translateBookmaker(bookmaker.bookmaker)}
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
                                      <div className="text-xs text-muted-foreground mb-1">
                                        {translateOutcome(outcome.displayName)}
                                      </div>
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
