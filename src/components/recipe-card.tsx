import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import type { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card>
      <CardTitle>{recipe.name}</CardTitle>
      <CardDescription>{recipe.description}</CardDescription>
      <CardContent>{recipe.instructions}</CardContent>
    </Card>
  );
}
