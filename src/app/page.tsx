import { RecipeCardSection } from "@/components/recipe/card-section";
import { RecipeFilterSection } from "@/components/recipe/filter-section";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="flex">
      <RecipeFilterSection />
      <RecipeCardSection searchParams={searchParams} />
    </div>
  );
}
