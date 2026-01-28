import {
  ingredientsTable,
  recipeIngredientsTable,
  recipesTable,
} from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

const recipeSchema = createSelectSchema(recipesTable).partial({ id: true });
const ingredientSchema = createSelectSchema(ingredientsTable).partial({
  id: true,
});
const recipeIngredientSchema = createSelectSchema(recipeIngredientsTable);

export type Recipe = z.infer<typeof recipeSchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
