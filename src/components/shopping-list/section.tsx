"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useCart } from "@/contexts/cart-provider";
import { logger } from "@/lib/logger";
import { type Ingredient, ingredientSchema } from "@/lib/types";

export function ShoppingListSection() {
  const { items } = useCart();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const ids = useMemo(
    () => items.map((r) => r.id).filter((id): id is number => Boolean(id)),
    [items],
  );

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setIngredients([]);
      return;
    }

    const getIngredients = async () => {
      const response = await fetch("/api/recipes/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        logger.error("bad response from endpoint /api/recipe/ingredients");
      }

      const json = await response.json();

      console.log(json);

      const ingredients = z.array(ingredientSchema).parse(json.ingredients);

      return ingredients;
    };

    getIngredients().then((response) => {
      setIngredients(response);
    });
  }, [ids]);

  return ingredients.map((ingredient) => {
    return <h1 key={ingredient.id}>{ingredient.name}</h1>;
  });
}
