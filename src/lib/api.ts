import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Recipe, Ingredient, RecipeIngredient } from "@/lib/types";

const fetchAllRecipes = async () => {
  const rows = await db.select().from(schema.recipesTable);

  return rows as Recipe[];
};

const fetchRecipeByID = async (id: number) => {
  const [row] = await db
    .select()
    .from(schema.recipesTable)
    .where(eq(schema.recipesTable.id, id))
    .limit(1);

  return row as Recipe;
};

const fetchRecipeByName = async (name: string) => {
  const [row] = await db
    .select()
    .from(schema.recipesTable)
    .where(eq(schema.recipesTable.name, name))
    .limit(1);

  return row as Recipe;
};

const fetchAllIngredients = async () => {
  const rows = await db.select().from(schema.ingredientsTable);

  return rows as Ingredient[];
};

const fetchIngredientByID = async (id: number) => {
  const [row] = await db
    .select()
    .from(schema.ingredientsTable)
    .where(eq(schema.ingredientsTable.id, id))
    .limit(1);

  return row as Ingredient;
};

const fetchIngredientByName = async (name: string) => {
  const [row] = await db
    .select()
    .from(schema.ingredientsTable)
    .where(eq(schema.ingredientsTable.name, name))
    .limit(1);

  return row as Ingredient;
};

const recipes = {
  getAll: fetchAllRecipes,
  getByID: fetchRecipeByID,
  getByName: fetchRecipeByName,
};

const ingredients = {
  getAll: fetchAllIngredients,
  getByID: fetchIngredientByID,
  getByName: fetchIngredientByName,
};

export const api = {
  recipes: {
    getAll: fetchAllRecipes,
    getByID: fetchRecipeByID,
    getByName: fetchRecipeByName,
  },
  ingredients,
};
