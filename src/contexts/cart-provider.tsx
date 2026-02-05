"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { errors } from "@/lib/errors";
import type { Recipe } from "@/lib/types";

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartContextValue = {
  items: Recipe[];
  add: (recipe: Recipe) => void;
  remove: (id: Recipe["id"]) => void;
  clear: () => void;
};

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw errors.CONTEXT_NOT_FOUND;
  }

  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Recipe[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const itemsString = localStorage.getItem("cart");
    if (!itemsString) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(itemsString);
      setItems(parsed);
    } catch {
      throw errors.LOCAL_STORAGE_MALFORMED;
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cart", JSON.stringify(items));
  }, [hydrated, items]);

  const add = (recipe: Recipe) => {
    setItems((prev) => [...prev, recipe]);
  };

  const remove = (id: Recipe["id"]) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  const clear = () => {
    setItems([]);
  };

  const value = {
    items,
    add,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
