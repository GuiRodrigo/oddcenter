"use client";

import {
  useState,
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
  type ReactElement,
} from "react";
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
import { Star, PlusCircle, Trophy, MinusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type Category = {
  id: string;
  name: string;
  icon: ReactElement;
};

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

type FavoriteCategoriesProps = {
  allCategories: Category[];
  favoriteCategories: Category[];
  setFavoriteCategories: Dispatch<SetStateAction<Category[]>>;
};

export function FavoriteCategories({
  allCategories,
  favoriteCategories,
  setFavoriteCategories,
}: FavoriteCategoriesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availableCategories = allCategories.filter(
    (c) => !favoriteCategories.some((fav) => fav.id === c.id)
  );

  const handleAddCategory = (category: Category) => {
    setFavoriteCategories((prev) => [...prev, category]);
  };

  const handleRemoveCategory = (categoryId: string) => {
    setFavoriteCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        Minhas Categorias Favoritas
      </h2>
      <Card className="bg-card p-4">
        <SortableContext
          items={favoriteCategories}
          strategy={rectSortingStrategy}
        >
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-0">
            {favoriteCategories.map((category) => (
              <SortableItem key={category.id} id={category.id}>
                <div className="relative group flex flex-col items-center justify-center p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-grab">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => handleRemoveCategory(category.id)}
                  >
                    <MinusCircle className="h-5 w-5 text-destructive" />
                  </Button>
                  {category.icon}
                  <span className="mt-2 text-sm font-medium">
                    {category.name}
                  </span>
                </div>
              </SortableItem>
            ))}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center p-4 h-auto min-h-[100px] border-dashed border-2"
                >
                  <PlusCircle className="h-6 w-6 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">
                    Adicionar
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Categoria</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2 py-4">
                  {availableCategories.length > 0 ? (
                    availableCategories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant="ghost"
                        className="justify-start gap-2"
                        onClick={() => handleAddCategory(cat)}
                      >
                        {cat.icon}
                        {cat.name}
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      Todas as categorias já foram adicionadas.
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Fechar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </SortableContext>
        <CardDescription className="mt-4 text-center">
          Arraste e solte para organizar suas categorias favoritas.
        </CardDescription>
      </Card>
    </section>
  );
}
