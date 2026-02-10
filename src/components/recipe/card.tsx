import Link from "next/link";
import { RecipeCheckbox } from "@/components/recipe/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="max-w-xl">
      <RecipeCheckbox recipe={recipe} />
      <Link
        href={
          recipe.name.includes("-")
            ? `/${recipe.id}`
            : `/${recipe.name.replaceAll(" ", "-")}`
        }
      >
        <CardTitle>{recipe.name}</CardTitle>
      </Link>
      <CardHeader></CardHeader>
      <CardDescription>{recipe.description}</CardDescription>
      <CardContent>{recipe.instructions}</CardContent>
    </Card>
  );
}
