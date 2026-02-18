import type { SQL } from "drizzle-orm";
import { and, eq, inArray, lte, sql } from "drizzle-orm";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import * as fetcher from "@/lib/fetches";
import * as inserter from "@/lib/inserts";
import type { Recipe, RecipeFilters } from "@/lib/types";

const queryRecipes = async (filters: RecipeFilters) => {
  const normalizedName = filters.name?.trim();
  const tagList = (filters.tags ?? []).map((t) => t.trim()).filter(Boolean);
  const hasTags = tagList.length > 0;

  const totalTimeExpr = sql<number>`(${schema.recipes.cookingTimes}->>'total')::int`;
  const caloriesExpr = sql<number>`(${schema.recipes.nutrition}->>'calories')::int`;

  const conditions: SQL[] = [];

  if (normalizedName) {
    conditions.push(sql`${schema.recipes.name} ILIKE %${normalizedName}%`);
  }

  if (typeof filters.maxTime === "number") {
    conditions.push(lte(totalTimeExpr, filters.maxTime));
  }

  if (typeof filters.maxCalories === "number") {
    conditions.push(lte(caloriesExpr, filters.maxCalories));
  }

  const base = db.select().from(schema.recipes);

  const query = hasTags
    ? base
        .innerJoin(
          schema.recipeTags,
          eq(schema.recipeTags.recipeId, schema.recipes.id),
        )
        .innerJoin(schema.tags, eq(schema.tags.id, schema.recipeTags.tagId))
        .where(and(...conditions, inArray(schema.tags.name, tagList)))
        .groupBy(schema.recipes.id)
    : conditions.length
      ? base.where(and(...conditions))
      : base;

  return (await query) as Recipe[];
};

export const api = {
  recipes: {
    getAll: fetcher.fetchAllRecipes,
    getByID: fetcher.fetchRecipeByID,
    getByName: fetcher.fetchRecipeByName,
    get: fetcher.fetchRecipe,
    upsert: inserter.upsertRecipe,
    query: queryRecipes,
    getIngredients: fetcher.getIngredients,
    getIngredientsForRecipes: fetcher.getIngredientsForRecipes,
  },
  ingredients: {
    getAll: fetcher.fetchAllIngredients,
    getByID: fetcher.fetchIngredientByID,
    getByName: fetcher.fetchIngredientByName,
    upsert: inserter.upsertIngredient,
  },
  recipeIngredients: {
    insert: inserter.insertRecipeIngredient,
  },
};
