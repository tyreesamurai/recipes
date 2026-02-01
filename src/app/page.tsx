import { RecipeCardSection } from "@/components/recipe-card-section";
import { RecipeFilterSection } from "@/components/recipe-filter-section";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";
import type { RecipeFilters } from "@/lib/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters: RecipeFilters = {
    maxTime: parseOptionalInt(params.maxTime),
    maxCalories: parseOptionalInt(params.maxCalories),
    name: parseOptionalString(params.name),
    tags: parseStringArray(params.tags),
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

// TODO: CLEAN UP ALL THIS CODE UNDERNEATH & give it its own file

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const parseOptionalInt = (v: string | string[] | undefined) => {
  const s = first(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

const parseOptionalString = (v: string | string[] | undefined) => {
  const s = first(v);
  const trimmed = s?.trim();
  return trimmed ? trimmed : undefined;
};

const parseStringArray = (v: string | string[] | undefined) => {
  if (!v) return undefined;
  const arr = Array.isArray(v) ? v : [v];
  const cleaned = arr.map((x) => x.trim()).filter(Boolean);
  return cleaned.length ? cleaned : undefined;
};
