import type { CartItem } from "@/lib/cart";

export type ShopifyMapping = {
  productId: string;
  shopifyProductId: string | null;
  shopifyVariantId: string | null;
};

export async function createShopifyCheckout(items: CartItem[]) {
  return {
    provider: "shopify-storefront-api-ready",
    checkoutUrl: "/checkout",
    lineItems: items.map((item) => ({
      productId: item.productId,
      variantId: item.shopifyVariantId,
      quantity: item.quantity
    }))
  };
}
