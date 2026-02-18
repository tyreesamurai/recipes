import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { logger } from "@/lib/logger";
import type {
  Ingredient,
  RecipeIngredient,
  RecipeWithIngredients,
  Result,
} from "@/lib/types";

export const upsertRecipe = async (item: RecipeWithIngredients) => {
  const { recipe, ingredients } = item;

  const results: Result[] = [];

  await db.transaction(async (tx) => {
    const [returnedRecipe] = await tx
      .insert(schema.recipes)
      .values(recipe)
      .onConflictDoUpdate({
        target: schema.recipes.name,
        set: {
          name: recipe.name.trim(),
          ...(recipe.description && { description: recipe.description }),
          ...(recipe.instructions && { instructions: recipe.instructions }),
          ...(recipe.imageUrl && { imageUrl: recipe.imageUrl }),
          ...(recipe.inputUrl && { inputUrl: recipe.inputUrl }),
          ...(recipe.nutrition && { nutrition: recipe.nutrition }),
          ...(recipe.cookingTimes && { cookingTimes: recipe.cookingTimes }),
        },
      })
      .returning({ id: schema.recipes.id, name: schema.recipes.name });

    const recipeInsertResult = {
      entity: "recipe",
      operation: "insert",
      ok: true,
      identifier: {
        id: returnedRecipe.id,
        name: returnedRecipe.name,
      },
    };

    logger.info(recipeInsertResult);

    results.push(recipeInsertResult);

    if (!ingredients) return returnedRecipe;

    const deletedRecipeIngredients = await tx
      .delete(schema.recipeIngredients)
      .where(eq(schema.recipeIngredients.recipeId, returnedRecipe.id))
      .returning({
        recipeId: schema.recipeIngredients.recipeId,
        ingredientId: schema.recipeIngredients.ingredientId,
      });

    deletedRecipeIngredients.forEach((deletedRecipeIngredient) => {
      const deletedRecipeResult = {
        entity: "recipeIngredient",
        operation: "delete",
        ok: true,
        identifier: {
          recipeId: deletedRecipeIngredient.recipeId,
          ingredientId: deletedRecipeIngredient.ingredientId,
        },
      };

      logger.info(deletedRecipeResult);
      results.push(deletedRecipeResult);
    });

    for (const ing of ingredients) {
      const [returnedIngredient] = await tx
        .insert(schema.ingredients)
        .values(ing)
        .onConflictDoUpdate({
          target: schema.ingredients.name,
          set: {
            name: ing.name.trim(),
            ...(ing.description && { description: ing.description }),
            ...(ing.nutrition && { nutrition: ing.nutrition }),
            ...(ing.imageUrl && { imageUrl: ing.imageUrl }),
          },
        })
        .returning({
          id: schema.ingredients.id,
          name: schema.ingredients.name,
        });

      const insertIngredientResult = {
        entity: "ingredient",
        operation: "insert",
        ok: true,
        identifier: {
          id: returnedIngredient.id,
          name: returnedIngredient.name,
        },
      };

      logger.info(insertIngredientResult);
      results.push(insertIngredientResult);

      const [returnedRecipeIngredient] = await tx
        .insert(schema.recipeIngredients)
        .values({
          recipeId: returnedRecipe.id,
          ingredientId: returnedIngredient.id,
          ...(ing.quantity && { quantity: ing.quantity }),
          ...(ing.unit && { unit: ing.unit }),
        })
        .returning({
          recipeId: schema.recipeIngredients.recipeId,
          ingredientId: schema.recipeIngredients.ingredientId,
        });

      const recipeIngredientResult = {
        entity: "recipeIngredient",
        operation: "insert",
        ok: true,
        identifier: {
          recipeId: returnedRecipeIngredient.recipeId,
          ingredientId: returnedRecipeIngredient.ingredientId,
        },
      };
      logger.info(recipeIngredientResult);
      results.push(recipeIngredientResult);
    }
  });

  return results[0];
};

export const upsertIngredient = async (ingredient: Ingredient) => {
  const [insertedIngredient] = await db
    .insert(schema.ingredients)
    .values(ingredient)
    .returning({ id: schema.ingredients.id, name: schema.ingredients.name });

  const result: Result = {
    entity: "ingredient",
    operation: "insert",
    ok: true,
    identifier: {
      id: insertedIngredient.id,
      name: insertedIngredient.name,
    },
  };

  logger.info(result);

  return insertedIngredient;
};

export const insertRecipeIngredient = async (
  recipeIngredient: RecipeIngredient,
) => {
  const [insertedRecipeIngredient] = await db
    .insert(schema.recipeIngredients)
    .values(recipeIngredient)
    .returning({
      recipeId: schema.recipeIngredients.recipeId,
      ingredientId: schema.recipeIngredients.ingredientId,
    });

  const result = {
    entity: "recipeIngredient",
    operation: "insert",
    ok: true,
    identifier: {
      recipeId: insertedRecipeIngredient.recipeId,
      ingredientId: insertedRecipeIngredient.ingredientId,
    },
  };

  logger.info(result);

  return insertedRecipeIngredient;
};
