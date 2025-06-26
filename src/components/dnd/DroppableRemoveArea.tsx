"use client";

import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DroppableRemoveAreaProps = {
  isDragging: boolean;
};

export function DroppableRemoveArea({ isDragging }: DroppableRemoveAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "remove-area",
  });

  if (!isDragging) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 mt-8 border-2 border-dashed rounded-lg transition-colors",
        isOver ? "border-destructive bg-destructive/20" : "border-border"
      )}
    >
      <Trash2
        className={cn(
          "h-8 w-8 transition-colors",
          isOver ? "text-destructive-foreground" : "text-muted-foreground"
        )}
      />
      <span
        className={cn(
          "transition-colors",
          isOver ? "text-destructive-foreground" : "text-muted-foreground"
        )}
      >
        Arraste aqui para remover
      </span>
    </div>
  );
}
