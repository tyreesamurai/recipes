import { RecipeCardSection } from "@/components/recipe-card-section";
import { RecipeFilterSection } from "@/components/recipe-filter-section";
import { api } from "@/lib/api";
import { helpers } from "@/lib/helpers";
import { logger } from "@/lib/logger";
import type { RecipeFilters } from "@/lib/types";

export default async function Home({
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

  return (
    <div className="flex">
      <RecipeFilterSection />
      <RecipeCardSection recipes={recipes} />
    </div>
  );
}
