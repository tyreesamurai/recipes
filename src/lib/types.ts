import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  ingredientsTable,
  recipeIngredientsTable,
  recipesTable,
} from "@/db/schema";

const recipeSchema = createSelectSchema(recipesTable).partial({ id: true });
const ingredientSchema = createSelectSchema(ingredientsTable)
  .partial({
    id: true,
  })
  .extend({ quantity: z.coerce.number().min(0), unit: z.string() });
const recipeIngredientSchema = createSelectSchema(recipeIngredientsTable);

export type Recipe = z.infer<typeof recipeSchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
