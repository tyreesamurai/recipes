import { api } from "@/lib/api";

const recipes = [
  {
    name: "",
    description: "",
    instructions: [""],
    nutrition: {
      calories: 0,
      protein: 0,
      fats: 0,
      carbs: 0,
    },
    cookingTimes: {
      cook: 0,
      prep: 0,
      total: 0,
    },
    imageUrl: "",
    inputUrl: "",
    ingredients: [
      {
        name: "",
        description: "",
        nutrition: {
          calories: 0,
          protein: 0,
          fats: 0,
          carbs: 0,
        },
        imageUrl: "",
        quantity: 0,
        unit: "",
      },
    ],
  },
];

recipes.forEach((recipeData) => {
  const { ingredients, ...recipe } = recipeData;

  api.recipes.insert(recipe, ingredients);
});
