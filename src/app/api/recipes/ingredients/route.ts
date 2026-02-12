import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const { ids } = await request.json();

  console.log(ids);

  if (!ids) {
    return Response.json({ error: "no ids provided" }, { status: 400 });
  }

  return Response.json(
    {
      ingredients: await api.recipes.getIngredientsForRecipes(ids),
    },
    { status: 200 },
  );
}
