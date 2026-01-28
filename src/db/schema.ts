import {
  integer,
  jsonb,
  pgTable,
  real,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const recipesTable = pgTable("recipes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  instructions: text().array(),
  nutrition: jsonb().$type<{
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  }>(),
  cookingTimes: jsonb().$type<{
    cook?: number;
    prep?: number;
    rest?: number;
    additional?: number;
    cool?: number;
    total: number;
  }>(),
  imageUrl: varchar("image_url", { length: 255 }),
  inputUrl: varchar("input_url", { length: 255 }),
});

export const ingredientsTable = pgTable("ingredients", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  imageUrl: varchar("image_url", { length: 255 }),
});

export const recipeIngredientsTable = pgTable("recipe_ingredients", {
  recipeId: integer("recipe_id").references(() => recipesTable.id),
  ingredientId: integer("ingredient_id").references(() => ingredientsTable.id),
  quantity: real(),
  unit: varchar({ length: 255 }),
});
