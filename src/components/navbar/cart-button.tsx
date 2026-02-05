"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-provider";

export function CartButton() {
  const { items } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <ShoppingCart />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Cart</SheetTitle>
        <SheetDescription>
          These are the recipes you have selected
        </SheetDescription>
        {items.map((recipe) => {
          return <h1 key={recipe.id}>{recipe.name}</h1>;
        })}
      </SheetContent>
    </Sheet>
  );
}
