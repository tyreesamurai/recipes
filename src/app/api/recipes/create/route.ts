import { api } from "@/lib/api";

export async function POST(request: Request) {
  const { recipe, ingredients } = await request.json();

  const result = await api.recipes.upsert({
    recipe: recipe,
    ingredients: ingredients,
  });

  return Response.json({ result }, { status: 201 });
}
