import { RecipeCard } from "@/components/recipe-card";
import { api } from "@/lib/api";

export default async function Home() {
  const recipes = await api.recipes.getAll();

  return (
    <div className="flex">
      {recipes.map((recipe) => {
        return <RecipeCard key={recipe.id} recipe={recipe} />;
      })}
    </div>
  );
}
