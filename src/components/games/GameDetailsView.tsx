"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketOddsTable } from "./MarketOddsTable";
import { Calendar, Clock, Users, ArrowLeft, Share2 } from "lucide-react";
import type { OddsEvent } from "@/types/game";
import { format } from "date-fns";
import { translateBookmaker } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";

interface GameDetailsViewProps {
  game: OddsEvent;
  onBack: () => void;
}

export function GameDetailsView({ game, onBack }: GameDetailsViewProps) {
  const gameDate = new Date(game.commence_time);
  const isLive = gameDate <= new Date();
  const timeUntilGame = gameDate.getTime() - new Date().getTime();
  const hoursUntilGame = Math.floor(timeUntilGame / (1000 * 60 * 60));

  // Agrupar mercados únicos
  const availableMarkets = Array.from(
    new Set(
      game.bookmakers.flatMap((bookmaker) =>
        bookmaker.markets.map((market) => market.key),
      ),
    ),
  ).map((marketKey) => {
    const firstMarket = game.bookmakers
      .flatMap((b) => b.markets)
      .find((m) => m.key === marketKey);
    return firstMarket!;
  });

  // Estatísticas gerais
  const totalBookmakers = game.bookmakers.length;
  const totalMarkets = availableMarkets.length;

  const formatGameDateTime = (date: Date) => {
    return {
      date: format(date, "EEEE, dd 'de' MMMM"),
      time: format(date, "HH:mm"),
      relative: hoursUntilGame > 0 ? `em ${hoursUntilGame}h` : "Ao vivo",
    };
  };

  const { date, time, relative } = formatGameDateTime(gameDate);

  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    if (navigator.clipboard && shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Dialog de Compartilhamento */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar este jogo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="w-full px-3 py-2 border rounded bg-muted text-sm"
              onFocus={(e) => e.target.select()}
            />
            <Button onClick={handleCopy} className="w-full">
              {copied ? "Link copiado!" : "Copiar link"}
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-full mt-2">
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Informações do Jogo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{game.sport_title}</Badge>
              <Badge className={isLive ? "bg-red-500" : "bg-blue-500"}>
                {isLive ? "AO VIVO" : "PRÓXIMO"}
              </Badge>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{date}</p>
              <p className="font-semibold">
                {time} • {relative}
              </p>
            </div>
          </div>

          <CardTitle className="text-3xl text-center mb-6">
            {game.home_team} <span className="text-muted-foreground">vs</span>{" "}
            {game.away_team}
          </CardTitle>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {totalBookmakers}
              </p>
              <p className="text-sm text-muted-foreground">Casas de Apostas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{totalMarkets}</p>
              <p className="text-sm text-muted-foreground">Mercados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {game.bookmakers[0]?.markets[0]?.outcomes.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Opções</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {Math.max(
                  ...game.bookmakers.flatMap((b) =>
                    b.markets.flatMap((m) => m.outcomes.map((o) => o.price)),
                  ),
                ).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Melhor Odd</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs com Mercados */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">Todos os Mercados</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>

        {/* Todos os Mercados */}
        <TabsContent value="all" className="space-y-4">
          {availableMarkets.map((market, index) => (
            <MarketOddsTable
              key={index}
              market={market}
              bookmakers={game.bookmakers}
            />
          ))}
        </TabsContent>

        {/* Informações */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Data:</strong> {date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Horário:</strong> {time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Competição:</strong> {game.sport_title}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Casas de Apostas Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {game.bookmakers.slice(0, 5).map((bookmaker, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="font-medium">
                        {translateBookmaker(bookmaker.title)}
                      </span>
                      <Badge variant="secondary">
                        {bookmaker.markets.length} mercados
                      </Badge>
                    </div>
                  ))}
                  {game.bookmakers.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{game.bookmakers.length - 5} casas de apostas adicionais
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
