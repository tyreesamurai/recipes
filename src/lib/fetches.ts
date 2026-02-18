import { eq, inArray } from "drizzle-orm";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { logger } from "@/lib/logger";
import type { Ingredient, Recipe, Result } from "@/lib/types";

export const fetchAllRecipes = async () => {
  const rows = await db.select().from(schema.recipes);

  const result: Result = {
    entity: "recipe",
    operation: "select",
    ok: true,
    identifier: {
      ids: rows.map((row) => row.id),
    },
  };

  logger.info(result);

  return rows as Recipe[];
};

export const fetchRecipeByID = async (id: number) => {
  const [row] = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.id, id))
    .limit(1);

  const result: Result = {
    entity: "recipe",
    operation: "select",
    ok: true,
    identifier: {
      id: row.id,
      name: row.name,
    },
  };

  logger.info(result);

  return row as Recipe;
};

export const fetchRecipeByName = async (name: string) => {
  const cleanedName = name.replaceAll(/-/g, " ");

  const [row] = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.name, cleanedName))
    .limit(1);

  const result = {
    entity: "recipe",
    operation: "select",
    ok: true,
    identifier: {
      id: row.id,
      name: row.name,
    },
  };

  logger.info(result);

  return row as Recipe;
};

export const fetchRecipe = async (id: string | number) => {
  const asNumber = Number(id);
  const isNumeric = Number.isFinite(asNumber);

  if (!isNumeric) {
    const recipe = await fetchRecipeByName(String(id));
    return recipe;
  }

  const recipe = await fetchRecipeByID(asNumber);
  return recipe;
};

export const fetchAllIngredients = async () => {
  const rows = await db.select().from(schema.ingredients);

  const result = {
    entity: "ingredient",
    operation: "select",
    ok: true,
    identifier: {
      ids: rows.map((row) => row.id),
    },
  };

  logger.info(result);

  return rows as Ingredient[];
};

export const fetchIngredientByID = async (id: number) => {
  const [row] = await db
    .select()
    .from(schema.ingredients)
    .where(eq(schema.ingredients.id, id))
    .limit(1);

  const result = {
    entity: "ingredient",
    operation: "select",
    ok: true,
    identifier: {
      id: row.id,
      name: row.name,
    },
  };

  logger.info(result);

  return row as Ingredient;
};

export const fetchIngredientByName = async (name: string) => {
  const [row] = await db
    .select()
    .from(schema.ingredients)
    .where(eq(schema.ingredients.name, name))
    .limit(1);

  const result = {
    entity: "ingredient",
    operation: "select",
    ok: true,
    identifier: {
      id: row.id,
      name: row.name,
    },
  };

  logger.info(result);

  return row as Ingredient;
};

export const getIngredients = async (recipeId: number) => {
  const ingredients = await db
    .select({
      id: schema.ingredients.id,
      name: schema.ingredients.name,
      quantity: schema.recipeIngredients.quantity,
      unit: schema.recipeIngredients.unit,
    })
    .from(schema.recipeIngredients)
    .innerJoin(
      schema.ingredients,
      eq(schema.ingredients.id, schema.recipeIngredients.ingredientId),
    )
    .where(eq(schema.recipeIngredients.recipeId, recipeId));

  const result = {
    entity: "ingredient",
    operation: "select",
    ok: true,
    identifier: {
      recipeId: recipeId,
      ingredientIds: ingredients.map((ing) => ing.id),
    },
  };

  logger.info(result);

  return ingredients;
};

export const getIngredientsForRecipes = async (recipeIds: number[]) => {
  const uniqueIds = [...new Set(recipeIds)].filter((n) => Number.isFinite(n));

  if (uniqueIds.length === 0) return [];

  const ingredients = await db
    .select({
      id: schema.ingredients.id,
      name: schema.ingredients.name,
      quantity: schema.recipeIngredients.quantity,
      unit: schema.recipeIngredients.unit,
    })
    .from(schema.recipeIngredients)
    .innerJoin(
      schema.ingredients,
      eq(schema.ingredients.id, schema.recipeIngredients.ingredientId),
    )
    .where(inArray(schema.recipeIngredients.recipeId, uniqueIds));

  const map = new Map();

  for (const ing of ingredients) {
    const key = ing.id;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, { ...ing, quantity: ing.quantity ?? 0 });
      continue;
    }

    map.set(key, {
      ...existing,
      quantity: (existing.quantity ?? 0) + (ing.quantity ?? 0),
    });
  }

  const aggregate = Array.from(map.values());

  const result: Result = {
    entity: "recipeIngredient",
    operation: "select",
    ok: true,
    identifier: {
      recipeIds: uniqueIds,
      ingredientIds: aggregate.map((ingredient) => ingredient.id),
    },
  };

  logger.info(result);

  return aggregate;
};
