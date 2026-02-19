import { api } from "@/lib/api";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/recipes/[slug]">,
) {
  const { slug } = await ctx.params;

  return Response.json(
    {
      data: await api.recipes.get(slug),
    },
    { status: 200 },
  );
}
