"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Users } from "lucide-react";
import { useOdds } from "@/components/odds/OddsContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type Event = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  venue?: string;
  participants?: string[];
};

type EventsListProps = {
  sportKey: string;
  searchTerm?: string;
  showUpcoming?: boolean;
};

export function EventsList({
  sportKey,
  searchTerm,
  showUpcoming = true,
}: EventsListProps) {
  const { fetchEvents } = useOdds();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sportKey) return;

    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEvents(sportKey);
        setEvents(data);
      } catch (err) {
        setError("Erro ao carregar eventos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [sportKey, fetchEvents]);

  const formatGameTime = (commenceTime: string) => {
    const date = new Date(commenceTime);
    const now = new Date();
    const timeUntilGame = date.getTime() - now.getTime();
    const daysUntilGame = Math.floor(timeUntilGame / (1000 * 60 * 60 * 24));
    const hoursUntilGame = Math.floor(timeUntilGame / (1000 * 60 * 60));

    return {
      date: format(date, "dd/MM"),
      time: format(date, "HH:mm"),
      relative:
        daysUntilGame > 0
          ? `em ${daysUntilGame} dia${daysUntilGame > 1 ? "s" : ""}`
          : hoursUntilGame > 0
            ? `em ${hoursUntilGame}h`
            : "hoje",
    };
  };

  const getStatusColor = (commenceTime: string) => {
    const gameDate = new Date(commenceTime);
    const now = new Date();
    const timeUntilGame = gameDate.getTime() - now.getTime();
    const hoursUntilGame = timeUntilGame / (1000 * 60 * 60);

    if (hoursUntilGame < 0) return "bg-red-500"; // Passado
    if (hoursUntilGame < 24) return "bg-orange-500"; // Próximo
    return "bg-blue-500"; // Futuro
  };

  const getStatusText = (commenceTime: string) => {
    const gameDate = new Date(commenceTime);
    const now = new Date();
    const timeUntilGame = gameDate.getTime() - now.getTime();
    const hoursUntilGame = timeUntilGame / (1000 * 60 * 60);

    if (hoursUntilGame < 0) return "PASSADO";
    if (hoursUntilGame < 24) return "PRÓXIMO";
    return "FUTURO";
  };

  // Filtrar eventos
  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchTerm
      ? event.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.sport_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      : true;

    const gameDate = new Date(event.commence_time);
    const now = new Date();
    const isUpcoming = gameDate > now;

    const matchesUpcoming = showUpcoming ? isUpcoming : !isUpcoming;

    return matchesSearch && matchesUpcoming;
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
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!filteredEvents.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum evento encontrado para este esporte.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Eventos {showUpcoming ? "Futuros" : "Passados"}
        </h2>
        <Badge variant="secondary">{filteredEvents.length} eventos</Badge>
      </div>

      <div className="grid gap-4">
        {filteredEvents.map((event) => {
          const { date, time, relative } = formatGameTime(event.commence_time);

          return (
            <Card
              key={event.id}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {event.sport_title}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-xs",
                        getStatusColor(event.commence_time),
                      )}
                    >
                      {getStatusText(event.commence_time)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <CardTitle className="text-lg leading-tight">
                    {event.home_team} vs {event.away_team}
                  </CardTitle>
                  {event.venue && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {event.venue}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {time} • {relative}
                    </div>
                  </div>
                </div>

                {event.participants && event.participants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Participantes:</span>
                    <div className="flex gap-1 flex-wrap">
                      {event.participants
                        .slice(0, 3)
                        .map((participant, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {participant}
                          </Badge>
                        ))}
                      {event.participants.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{event.participants.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
