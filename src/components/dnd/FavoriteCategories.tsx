"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OddsSport } from "@/types/game";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  SensorDescriptor,
  SensorOptions,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Star as StarIcon } from "lucide-react";
import { SetStateAction } from "react";

interface FavoriteCategoriesProps {
  sensors: SensorDescriptor<SensorOptions>[];
  handleDragEnd: (event: DragEndEvent) => void;
  setActiveDrag: (value: SetStateAction<string | null>) => void;
  favoriteSportsDetails: (OddsSport | undefined)[];
  selectedSport: string | undefined;
  onSportSelect: (sportKey: string) => void;
  toggleFavorite: (sportKey: string) => void;
  activeDrag: string | null;
}

export function FavoriteCategories({
  sensors,
  handleDragEnd,
  setActiveDrag,
  favoriteSportsDetails,
  selectedSport,
  onSportSelect,
  toggleFavorite,
  activeDrag,
}: FavoriteCategoriesProps) {
  return (
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
