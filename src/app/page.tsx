import { Suspense } from "react";
import { RecipeCardSection } from "@/components/recipe/card-section";
import { RecipeFilterSection } from "@/components/recipe/filter-section";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="flex">
      <Suspense fallback={<h1>this is the fallback</h1>}>
        <RecipeFilterSection />
        <RecipeCardSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
