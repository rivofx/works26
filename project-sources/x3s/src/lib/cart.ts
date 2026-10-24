import type { Product } from "@/data/products";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  shopifyVariantId?: string | null;
};

export type CartTotals = {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
};

export function makeCartItem(product: Product, size: string, color: string, quantity = 1): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    image: product.images[0],
    price: product.price,
    color,
    size,
    quantity,
    shopifyVariantId: null
  };
}

export function calculateTotals(items: CartItem[], discountCode?: string): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = discountCode?.toUpperCase() === "VENOM10" ? subtotal * 0.1 : 0;
  const shipping = subtotal - discount > 150 || subtotal === 0 ? 0 : 12;
  return { subtotal, shipping, discount, total: Math.max(0, subtotal - discount + shipping) };
}
