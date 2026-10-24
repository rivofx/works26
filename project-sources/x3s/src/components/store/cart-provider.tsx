"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/cart";
import { calculateTotals } from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  discountCode: string;
  totals: ReturnType<typeof calculateTotals>;
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  setDiscountCode: (code: string) => void;
  clearCart: () => void;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function keyFor(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}:${item.size}:${item.color}`;
}

export function cartKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return keyFor(item);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("cobrax3s-cart");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cobrax3s-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    discountCode,
    totals: calculateTotals(items, discountCode),
    addItem: (item) => setItems((current) => {
      const key = keyFor(item);
      const exists = current.find((entry) => keyFor(entry) === key);
      if (exists) return current.map((entry) => keyFor(entry) === key ? { ...entry, quantity: entry.quantity + item.quantity } : entry);
      return [...current, item];
    }),
    removeItem: (key) => setItems((current) => current.filter((item) => keyFor(item) !== key)),
    updateQuantity: (key, quantity) => setItems((current) => current.map((item) => keyFor(item) === key ? { ...item, quantity: Math.max(1, quantity) } : item)),
    setDiscountCode,
    clearCart: () => setItems([]),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  }), [discountCode, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
