import type { SQL } from "drizzle-orm";
import { and, eq, inArray, lte, sql } from "drizzle-orm";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { logger } from "@/lib/logger";
import type {
  Ingredient,
  Recipe,
  RecipeFilters,
  RecipeIngredient,
} from "@/lib/types";

const fetchAllRecipes = async () => {
  const rows = await db.select().from(schema.recipes);

  logger.info("fetched all recipes");

  return rows as Recipe[];
};

const fetchRecipeByID = async (id: number) => {
  const [row] = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.id, id))
    .limit(1);

  logger.info("fetched recipe: %s", JSON.stringify(row.name));

  return row as Recipe;
};

const fetchRecipeByName = async (name: string) => {
  const [row] = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.name, name))
    .limit(1);

  logger.info("fetched recipe: %s", JSON.stringify(row.name));

  return row as Recipe;
};

const fetchRecipe = async (id: string | number) => {
  if (typeof id === "string") {
    const recipe = await fetchRecipeByName(id);
    return recipe;
  }

  if (typeof id === "number") {
    const recipe = await fetchRecipeByID(id);
    return recipe;
  }

  return;
};

const upsertRecipe = async (recipe: Recipe) => {
  const foundRecipe = await api.recipes.getByName(recipe.name);

  if (foundRecipe) {
    const [row] = await db
      .update(schema.recipes)
      .set(recipe)
      .where(eq(schema.recipes.name, recipe.name))
      .returning();

    logger.info("found existing recipe: %s", JSON.stringify(row.name));
    return row as Recipe;
  }

  const [insertedRecipe] = await db
    .insert(schema.recipes)
    .values(recipe)
    .returning();

  logger.info("created new recipe: %s", JSON.stringify(insertedRecipe.name));
  return insertedRecipe as Recipe;
};

const fetchAllIngredients = async () => {
  const rows = await db.select().from(schema.ingredients);

  return rows as Ingredient[];
};

const fetchIngredientByID = async (id: number) => {
  const [row] = await db
    .select()
    .from(schema.ingredients)
    .where(eq(schema.ingredients.id, id))
    .limit(1);

  return row as Ingredient;
};

const fetchIngredientByName = async (name: string) => {
  const [row] = await db
    .select()
    .from(schema.ingredients)
    .where(eq(schema.ingredients.name, name))
    .limit(1);

  return row as Ingredient;
};

const upsertIngredient = async (ingredient: Ingredient) => {
  const foundIngredient = await api.ingredients.getByName(ingredient.name);

  if (foundIngredient) {
    const [row] = await db
      .update(schema.ingredients)
      .set(ingredient)
      .where(eq(schema.ingredients.name, ingredient.name))
      .returning();

    return row as Ingredient;
  }

  const [insertedIngredient] = await db
    .insert(schema.ingredients)
    .values(ingredient)
    .returning();

  return insertedIngredient as Ingredient;
};

const getIngredients = async (recipeId: number) => {
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

  return ingredients;
};

const insertRecipeWithIngredients = async (
  recipe: Recipe,
  ingredients?: Ingredient[],
) => {
  const insertedRecipe = await api.recipes.upsert(recipe);

  if (!ingredients) {
    logger.info(
      "inserted recipe with no ingredients: %s",
      JSON.stringify(insertedRecipe.name),
    );
    return insertedRecipe;
  }

  ingredients.forEach(async (ingredient) => {
    const insertedIngredient = await api.ingredients.upsert(ingredient);

    const recipeIngredient = {
      recipeId: insertedRecipe.id ?? null,
      ingredientId: insertedIngredient.id ?? null,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    };

    await api.recipeIngredients.insert(recipeIngredient);
  });

  logger.info("recipe inserted: %s", JSON.stringify(insertedRecipe.name));
};

const insertRecipeIngredient = async (recipeIngredient: RecipeIngredient) => {
  const [insertedRecipeIngredient] = await db
    .insert(schema.recipeIngredients)
    .values(recipeIngredient)
    .returning();

  return insertedRecipeIngredient;
};

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
    getAll: fetchAllRecipes,
    getByID: fetchRecipeByID,
    getByName: fetchRecipeByName,
    fetch: fetchRecipe,
    upsert: upsertRecipe,
    insert: insertRecipeWithIngredients,
    query: queryRecipes,
    getIngredients,
  },
  ingredients: {
    getAll: fetchAllIngredients,
    getByID: fetchIngredientByID,
    getByName: fetchIngredientByName,
    upsert: upsertIngredient,
  },
  recipeIngredients: {
    insert: insertRecipeIngredient,
  },
};
