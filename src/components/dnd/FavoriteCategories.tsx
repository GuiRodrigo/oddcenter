"use client";

import { useState, type ComponentProps } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, PlusCircle, Trophy } from "lucide-react";

// Componente para um item arrastável
function SortableItem({
  id,
  children,
}: {
  id: any;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: ComponentProps<"div">["style"] = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export function FavoriteCategories() {
  const [favoriteCategories, setFavoriteCategories] = useState([
    { id: "1", name: "Futebol", icon: <Trophy className="h-5 w-5" /> },
    { id: "2", name: "Basquete", icon: <Trophy className="h-5 w-5" /> },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFavoriteCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        Minhas Categorias Favoritas
      </h2>
      <Card className="bg-card p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={favoriteCategories}
            strategy={rectSortingStrategy}
          >
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-0">
              {favoriteCategories.map((category) => (
                <SortableItem key={category.id} id={category.id}>
                  <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-grab">
                    {category.icon}
                    <span className="mt-2 text-sm font-medium">
                      {category.name}
                    </span>
                  </div>
                </SortableItem>
              ))}
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center p-4 h-auto min-h-[100px] border-dashed border-2"
              >
                <PlusCircle className="h-6 w-6 text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">
                  Adicionar
                </span>
              </Button>
            </CardContent>
          </SortableContext>
        </DndContext>
        <CardDescription className="mt-4 text-center">
          Arraste e solte para organizar suas categorias favoritas.
        </CardDescription>
      </Card>
    </section>
  );
}
