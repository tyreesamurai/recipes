import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import type { db } from "@/db/index";
import { ingredients, recipeIngredients, recipes } from "@/db/schema";

const nutritionSchema = z
  .object({
    calories: z.number().nonnegative(),
    protein: z.number().nonnegative().optional(),
    fats: z.number().nonnegative().optional(),
    carbs: z.number().nonnegative().optional(),
  })
  .optional();

const cookingTimeSchema = z
  .object({
    total: z.number().nonnegative(),
    prep: z.number().nonnegative().optional(),
    cook: z.number().nonnegative().optional(),
    additional: z.number().nonnegative().optional(),
    rest: z.number().nonnegative().optional(),
    cool: z.number().nonnegative().optional(),
  })
  .optional();

export const recipeSchema = createSelectSchema(recipes)
  .extend({ nutrition: nutritionSchema, cookingTimes: cookingTimeSchema })
  .partial()
  .required({ name: true });
export const ingredientSchema = createSelectSchema(ingredients)
  .extend({
    nutrition: nutritionSchema,
    quantity: z.number().nonnegative(),
    unit: z.string(),
  })
  .partial()
  .required({ name: true });

export const recipeIngredientSchema = createSelectSchema(recipeIngredients);

export const resultSchema = {
  entity: z.enum(["recipe", "ingredient", "recipeIngredient", "tag"]),
  operation: z.enum(["insert", "update", "delete", "select"]),
  identifier: z
    .object({
      id: z.number().nonnegative().optional(),
      ids: z.array(z.number().nonnegative().optional()),
      recipeId: z.number().nonnegative().optional(),
      recipeIds: z.array(z.number().nonnegative().optional()),
      ingredientId: z.number().nonnegative().optional(),
      ingredientIds: z.array(z.number().nonnegative().optional()),
      name: z.string().optional(),
    })
    .optional(),
  ok: z.boolean(),
  message: z.string().optional(),
  error: z
    .object({
      type: z.string(),
      message: z.string().optional(),
    })
    .optional(),
};

type DatabaseType = typeof db;
export type Transaction = Parameters<
  Parameters<DatabaseType["transaction"]>[0]
>[0];

export type Recipe = z.infer<typeof recipeSchema>;
export type Result = z.infer<typeof resultSchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
export type RecipeFilters = {
  name?: string;
  maxTime?: number;
  maxCalories?: number;
  tags?: string[];
};
export type RecipeWithIngredients = {
  recipe: Recipe;
  ingredients?: Ingredient[];
};
