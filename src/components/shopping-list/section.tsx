"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/contexts/cart-provider";
import { api } from "@/lib/api";

type Ingredient = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
};

export function ShoppingListSection() {
  return <h1>Shopping List Section</h1>;
}
