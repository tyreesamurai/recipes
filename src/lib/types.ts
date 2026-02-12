import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { ingredients, recipeIngredients, recipes } from "@/db/schema";

const nutritionSchema = z
  .object({
    calories: z.number(),
    protein: z.number().optional(),
    fats: z.number().optional(),
    carbs: z.number().optional(),
  })
  .nullish();

export const recipeSchema = createSelectSchema(recipes).partial({ id: true });
export const ingredientSchema = createSelectSchema(ingredients)
  .partial({
    id: true,
  })
  .extend({
    description: z.string().nullish(),
    imageUrl: z.string().nullish(),
    nutrition: nutritionSchema,
    quantity: z.coerce.number().min(0),
    unit: z.string(),
  });
export const recipeIngredientSchema = createSelectSchema(recipeIngredients);

export type Recipe = z.infer<typeof recipeSchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
export type RecipeFilters = {
  name?: string;
  maxTime?: number;
  maxCalories?: number;
  tags?: string[];
};
