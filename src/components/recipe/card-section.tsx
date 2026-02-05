import { RecipeCard } from "@/components/recipe/card";
import { api } from "@/lib/api";
import { helpers } from "@/lib/helpers";
import { logger } from "@/lib/logger";
import type { RecipeFilters } from "@/lib/types";

export async function RecipeCardSection({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters: RecipeFilters = {
    maxTime: helpers.parseOptionalInt(params.maxTime),
    maxCalories: helpers.parseOptionalInt(params.maxCalories),
    name: helpers.parseOptionalString(params.name),
    tags: helpers.parseStringArray(params.tags),
  };

  logger.info("filter [searchParams] look like: %s", JSON.stringify(filters));

  const recipes = await api.recipes.query(filters);

  return recipes.map((recipe) => (
    <div key={recipe.id}>
      <RecipeCard recipe={recipe} />
    </div>
  ));
}
