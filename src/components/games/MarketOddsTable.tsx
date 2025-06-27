"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import type { OddsMarket, OddsBookmaker } from "@/types/game";
import { translateOutcome, translateBookmaker } from "@/lib/utils";

interface MarketOddsTableProps {
  market: OddsMarket;
  bookmakers: OddsBookmaker[];
}

// Função para obter nome amigável do mercado
const getMarketDisplayName = (marketKey: string): string => {
  const marketNames: Record<string, string> = {
    h2h: "Resultado Final",
    spreads: "Handicap",
    totals: "Total de Pontos/Gols",
    outrights: "Vencedor da Competição",
  };
  return marketNames[marketKey] || marketKey.toUpperCase();
};

// Função para encontrar a melhor odd de cada resultado
const getBestOdds = (bookmakers: OddsBookmaker[], marketKey: string) => {
  const bestOdds: Record<string, { price: number; bookmaker: string }> = {};

  bookmakers.forEach((bookmaker) => {
    const market = bookmaker.markets.find((m) => m.key === marketKey);
    if (!market) return;

    market.outcomes.forEach((outcome) => {
      const key = outcome.name;
      if (!bestOdds[key] || outcome.price > bestOdds[key].price) {
        bestOdds[key] = {
          price: outcome.price,
          bookmaker: bookmaker.title,
        };
      }
    });
  });

  return bestOdds;
};

export function MarketOddsTable({ market, bookmakers }: MarketOddsTableProps) {
  const bestOdds = getBestOdds(bookmakers, market.key);
  const outcomes = market.outcomes;

  // Filtrar bookmakers que têm este mercado
  const relevantBookmakers = bookmakers.filter((bookmaker) =>
    bookmaker.markets.some((m) => m.key === market.key)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{getMarketDisplayName(market.key)}</span>
          <Badge variant="secondary">{relevantBookmakers.length} casas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Melhores Odds */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Melhores Odds
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {outcomes.map((outcome, index) => {
                const best = bestOdds[outcome.name];
                return (
                  <div key={index} className="text-center">
                    <p className="text-sm font-medium mb-1">
                      {translateOutcome(outcome.name)}
                    </p>
                    <Badge variant="default" className="text-lg font-mono mb-1">
                      {best?.price.toFixed(2) || "N/A"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {best?.bookmaker
                        ? translateBookmaker(best.bookmaker)
                        : "N/A"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabela de Comparação */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium">
                    Casa de Apostas
                  </th>
                  {outcomes.map((outcome, index) => (
                    <th
                      key={index}
                      className="text-center py-2 px-2 font-medium"
                    >
                      {translateOutcome(outcome.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {relevantBookmakers.map((bookmaker, bookmakerIndex) => {
                  const bookmakerMarket = bookmaker.markets.find(
                    (m) => m.key === market.key
                  );

                  return (
                    <tr
                      key={bookmakerIndex}
                      className="border-b hover:bg-muted/20"
                    >
                      <td className="py-3 px-2 font-medium text-sm">
                        {translateBookmaker(bookmaker.title)}
                      </td>
                      {outcomes.map((outcome, outcomeIndex) => {
                        const bookmakerOutcome = bookmakerMarket?.outcomes.find(
                          (o) => o.name === outcome.name
                        );
                        const isBest =
                          bestOdds[outcome.name]?.bookmaker === bookmaker.title;

                        return (
                          <td
                            key={outcomeIndex}
                            className="py-3 px-2 text-center"
                          >
                            {bookmakerOutcome ? (
                              <Button
                                variant={isBest ? "default" : "outline"}
                                size="sm"
                                className={`font-mono ${
                                  isBest
                                    ? "bg-green-500 hover:bg-green-600"
                                    : ""
                                }`}
                              >
                                {bookmakerOutcome.price.toFixed(2)}
                                {isBest && (
                                  <TrendingUp className="h-3 w-3 ml-1" />
                                )}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
