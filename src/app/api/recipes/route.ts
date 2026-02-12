import { api } from "@/lib/api";

export async function GET() {
  return Response.json(
    {
      data: await api.recipes.getAll(),
    },
    { status: 200 },
  );
}
