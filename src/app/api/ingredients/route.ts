import { api } from "@/lib/api";

export default async function GET() {
  return Response.json({
    status: 200,
    message: "hey from tyree",
    data: api.ingredients.getAll(),
  });
}
