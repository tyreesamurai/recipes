"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/cart-provider";
import type { Recipe } from "@/lib/types";

export function RecipeCheckbox({ recipe }: { recipe: Recipe }) {
  const { items, add, remove } = useCart();

  return (
    <Checkbox
      checked={items.some((r) => r.id === recipe.id)}
      onCheckedChange={(next) => {
        next ? add(recipe) : remove(recipe.id);
      }}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
