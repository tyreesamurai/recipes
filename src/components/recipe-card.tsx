"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [checked, setChecked] = useState(false);

  return (
    <Card
      className="max-w-xl"
      onClick={() => {
        setChecked((prev) => !prev);
      }}
    >
      <Link
        href={
          recipe.name.includes("-")
            ? `/${recipe.id}`
            : `/${recipe.name.replaceAll(" ", "-")}`
        }
      >
        <CardTitle>{recipe.name}</CardTitle>
      </Link>
      <CardHeader>
        <Checkbox
          checked={checked}
          onCheckedChange={() => setChecked((prev) => !prev)}
          onClick={(e) => e.stopPropagation()}
        />
      </CardHeader>
      <CardDescription>{recipe.description}</CardDescription>
      <CardContent>{recipe.instructions}</CardContent>
    </Card>
  );
}
