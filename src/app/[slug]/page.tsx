import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const id = Number(slug);
  const isId = !Number.isNaN(id);

  const recipe = isId
    ? await api.recipes.getByID(id)
    : await api.recipes.getByName(slug.replaceAll("-", " "));

  if (!recipe.id) {
    logger.info("no recipe id for %s", recipe.name);
    return;
  }

  const ingredients = await api.recipes.getIngredients(recipe.id);

  return (
    <div>
      <h1>{recipe.name}</h1>
      <h4>{recipe.description}</h4>
      {recipe.instructions?.map((instruction) => {
        return <h5 key={instruction}>{instruction}</h5>;
      })}

      <h5>{recipe.instructions}</h5>
      {ingredients.map((ingredient) => {
        return (
          <h5
            key={ingredient.id}
          >{`${ingredient.quantity} ${ingredient.unit} of ${ingredient.name}`}</h5>
        );
      })}
    </div>
  );
}
