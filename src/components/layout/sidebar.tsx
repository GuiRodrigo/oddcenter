"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Trophy,
  Star,
  Target,
  Zap,
  Globe,
  Gamepad2,
  Car,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOdds } from "@/components/odds/OddsContext";
import type { OddsSport } from "@/types/game";

type SidebarProps = {
  selectedSport?: string;
  onSportSelect: (sportKey: string) => void;
  className?: string;
};

// Mapeamento de ícones por grupo de esporte
const getSportGroupIcon = (group: string) => {
  const groupLower = group.toLowerCase();
  if (groupLower.includes("soccer") || groupLower.includes("football"))
    return <Trophy className="h-4 w-4" />;
  if (groupLower.includes("basketball")) return <Target className="h-4 w-4" />;
  if (groupLower.includes("tennis")) return <Zap className="h-4 w-4" />;
  if (groupLower.includes("american football"))
    return <Globe className="h-4 w-4" />;
  if (groupLower.includes("baseball")) return <Waves className="h-4 w-4" />;
  if (groupLower.includes("esports")) return <Gamepad2 className="h-4 w-4" />;
  if (groupLower.includes("motor")) return <Car className="h-4 w-4" />;
  return <Trophy className="h-4 w-4" />;
};

// Função para agrupar esportes por categoria
const groupSportsByCategory = (sports: OddsSport[]) => {
  const grouped = sports.reduce((acc, sport) => {
    const group = sport.group || "Outros";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(sport);
    return acc;
  }, {} as Record<string, OddsSport[]>);

  // Ordenar grupos por prioridade
  const priorityOrder = [
    "Soccer",
    "American Football",
    "Basketball",
    "Tennis",
    "Baseball",
    "Ice Hockey",
    "Mixed Martial Arts",
    "Boxing",
    "Golf",
    "Aussie Rules",
    "Rugby League",
    "Rugby Union",
  ];

  const sortedGroups: Record<string, OddsSport[]> = {};

  // Adicionar grupos prioritários primeiro
  priorityOrder.forEach((group) => {
    if (grouped[group]) {
      sortedGroups[group] = grouped[group].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }
  });

  // Adicionar grupos restantes
  Object.keys(grouped)
    .filter((group) => !priorityOrder.includes(group))
    .sort()
    .forEach((group) => {
      sortedGroups[group] = grouped[group].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    });

  return sortedGroups;
};

export function Sidebar({
  selectedSport,
  onSportSelect,
  className,
}: SidebarProps) {
  const { sports, loading } = useOdds();
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(["Soccer", "Basketball"])
  );

  const toggleGroup = (group: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(group)) {
      newOpenGroups.delete(group);
    } else {
      newOpenGroups.add(group);
    }
    setOpenGroups(newOpenGroups);
  };

  const groupedSports = groupSportsByCategory(
    sports.filter((sport) => sport.active)
  );

  // Esportes populares (hardcoded para demonstração)
  const popularSports = [
    {
      key: "soccer_brazil_campeonato",
      title: "Campeonato Brasileiro",
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      key: "soccer_uefa_champs_league",
      title: "Champions League",
      icon: <Star className="h-4 w-4" />,
    },
    {
      key: "americanfootball_nfl",
      title: "NFL",
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: "basketball_nba",
      title: "NBA",
      icon: <Target className="h-4 w-4" />,
    },
  ];

  if (loading) {
    return (
      <div className={cn("w-64 border-r bg-muted/30", className)}>
        <div className="p-4">
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-64 border-r bg-background", className)}>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Seção Populares */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              POPULARES
            </h3>
            <div className="space-y-1">
              {popularSports.map((sport) => (
                <Button
                  key={sport.key}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 h-8 text-sm",
                    selectedSport === sport.key && "bg-primary/10 text-primary"
                  )}
                  onClick={() => onSportSelect(sport.key)}
                >
                  {sport.icon}
                  {sport.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Seção Esportes */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              ESPORTES
            </h3>
            <div className="space-y-1">
              {Object.entries(groupedSports).map(([group, sportsInGroup]) => (
                <Collapsible
                  key={group}
                  open={openGroups.has(group)}
                  onOpenChange={() => toggleGroup(group)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between h-8 text-sm hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        {getSportGroupIcon(group)}
                        <span>{group}</span>
                        <Badge variant="secondary" className="text-xs">
                          {sportsInGroup.length}
                        </Badge>
                      </div>
                      {openGroups.has(group) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 ml-6 mt-1 ">
                    {sportsInGroup.map((sport) => (
                      <Button
                        key={sport.key}
                        variant="ghost"
                        className={cn(
                          "w-50 justify-start h-7 text-xs text-muted-foreground hover:text-foreground",
                          selectedSport === sport.key &&
                            "bg-primary/10 text-primary"
                        )}
                        onClick={() => onSportSelect(sport.key)}
                      >
                        <span className="truncate">{sport.title}</span>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
