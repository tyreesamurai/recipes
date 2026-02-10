"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-provider";

export function CartButton() {
  const router = useRouter();
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
        <SheetClose asChild>
          <Button onClick={() => router.push("/shopping-list")}>
            Generate Shopping List
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
