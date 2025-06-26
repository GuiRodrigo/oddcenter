"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOdds } from "@/components/odds/OddsContext";
import type { OddsSport } from "@/types/game";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Star as StarIcon } from "lucide-react";

type SidebarProps = {
  selectedSport?: string;
  onSportSelect: (sportKey: string) => void;
  className?: string;
};

// Mapeamento de tradução de grupos para pt-BR
const GROUP_TRANSLATIONS: Record<string, string> = {
  Soccer: "Futebol",
  "American Football": "Futebol Americano",
  Basketball: "Basquete",
  Tennis: "Tênis",
  Baseball: "Beisebol",
  "Ice Hockey": "Hóquei no Gelo",
  "Mixed Martial Arts": "Artes Marciais Mistas",
  Boxing: "Boxe",
  Golf: "Golfe",
  "Aussie Rules": "Futebol Australiano",
  "Rugby League": "Rugby League",
  "Rugby Union": "Rugby Union",
  Cricket: "Críquete",
  Lacrosse: "Lacrosse",
  Politics: "Política",
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

  // Favoritos com persistência local
  const [favoriteSports, setFavoriteSports] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favoriteSports");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("favoriteSports", JSON.stringify(favoriteSports));
  }, [favoriteSports]);

  // Drag and drop setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // só ativa drag se mover 8px
      },
    })
  );
  const [activeDrag, setActiveDrag] = useState<string | null>(null);

  // Função para drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);
    if (!over) return;
    if (over && active.id !== over.id) {
      setFavoriteSports((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Função para alternar favorito
  const toggleFavorite = (sportKey: string) => {
    setFavoriteSports((prev) =>
      prev.includes(sportKey)
        ? prev.filter((key) => key !== sportKey)
        : [...prev, sportKey]
    );
  };

  // Esportes favoritos (detalhes)
  const favoriteSportsDetails = favoriteSports
    .map((key) => sports.find((s) => s.key === key))
    .filter(Boolean);

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
        <div className="pr-4 pl-2 py-4 space-y-6">
          {/* Seção Favoritos com Drag and Drop */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              FAVORITOS
            </h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={(e) => setActiveDrag(e.active.id as string)}
            >
              <SortableContext
                items={favoriteSportsDetails.map((s) => s?.key ?? "") ?? []}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1 min-h-[40px]">
                  {favoriteSportsDetails.length === 0 && (
                    <div className="text-xs text-muted-foreground px-2 py-1">
                      Nenhum favorito ainda.
                    </div>
                  )}
                  {favoriteSportsDetails.map((sport) => (
                    <DraggableFavorite
                      key={sport!.key}
                      sport={sport!}
                      selectedSport={selectedSport}
                      onSportSelect={onSportSelect}
                      onToggleFavorite={toggleFavorite}
                      isDragging={activeDrag === sport!.key}
                    />
                  ))}
                </div>
              </SortableContext>
              {/* Overlay do item sendo arrastado */}
              <DragOverlay>
                {activeDrag && (
                  <div className="opacity-80">
                    {(() => {
                      const sport = favoriteSportsDetails.find(
                        (s) => s?.key === activeDrag
                      );
                      if (!sport) return null;
                      return (
                        <div className="flex items-center w-50 flex-1 justify-start gap-2 h-8 text-sm bg-background border rounded shadow px-2">
                          <span className="truncate">{sport.title}</span>
                          <StarIcon
                            className="h-4 w-4 text-yellow-400 ml-auto"
                            fill="currentColor"
                          />
                        </div>
                      );
                    })()}
                  </div>
                )}
              </DragOverlay>
            </DndContext>
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
                        <span>{GROUP_TRANSLATIONS[group] || group}</span>
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
                  <CollapsibleContent className="space-y-1 ml-4 mt-1 ">
                    {sportsInGroup.map((sport) => (
                      <div
                        key={sport.key}
                        className="flex items-center w-full gap-1"
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-44 flex-1 justify-start h-7 text-xs text-muted-foreground hover:text-foreground",
                            selectedSport === sport.key &&
                              "bg-primary/10 text-primary"
                          )}
                          onClick={() => onSportSelect(sport.key)}
                        >
                          <span className="truncate">{sport.title}</span>
                        </Button>
                        <button
                          type="button"
                          className="ml-1"
                          tabIndex={0}
                          aria-label={
                            favoriteSports.includes(sport.key)
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(sport.key);
                          }}
                        >
                          <StarIcon
                            className={cn(
                              "h-4 w-4 cursor-pointer",
                              favoriteSports.includes(sport.key)
                                ? "text-yellow-400"
                                : "text-muted-foreground"
                            )}
                            fill={
                              favoriteSports.includes(sport.key)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      </div>
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

// COMPONENTE DRAGGABLE FAVORITE
function DraggableFavorite({
  sport,
  selectedSport,
  onSportSelect,
  onToggleFavorite,
  isDragging,
}: {
  sport: OddsSport;
  selectedSport?: string;
  onSportSelect: (sportKey: string) => void;
  onToggleFavorite: (sportKey: string) => void;
  isDragging: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging: sortableDragging,
    transform,
    transition,
  } = useSortable({ id: sport.key });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center justify-between w-50 gap-1 cursor-grab",
        isDragging || sortableDragging ? "opacity-60 bg-muted" : ""
      )}
      style={{
        zIndex: isDragging || sortableDragging ? 50 : undefined,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
    >
      <Button
        id={sport.key}
        variant="ghost"
        className={cn(
          "w-50 flex-1 justify-start gap-2 h-8 text-sm",
          selectedSport === sport.key && "bg-primary/10 text-primary"
        )}
        onClick={() => onSportSelect(sport.key)}
      >
        <span className="truncate">{sport.title}</span>
      </Button>
      <button
        type="button"
        className="ml-1"
        tabIndex={0}
        aria-label={"Remover dos favoritos"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(sport.key);
        }}
      >
        <StarIcon
          className="h-4 w-4 cursor-pointer text-yellow-400"
          fill="currentColor"
        />
      </button>
    </div>
  );
}
