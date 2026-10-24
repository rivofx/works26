export type InventoryRecord = {
  productId: string;
  size: string;
  available: number;
  shopifyInventoryItemId: string | null;
};

export const inventory: InventoryRecord[] = [
  "XS,S,M,L,XL,XXL".split(",").map((size) => ({ productId: "cx3s-001", size, available: size === "XXL" ? 4 : 12, shopifyInventoryItemId: null })),
  "XS,S,M,L,XL".split(",").map((size) => ({ productId: "cx3s-002", size, available: size === "XS" ? 3 : 8, shopifyInventoryItemId: null })),
  "XS,S,M,L,XL".split(",").map((size) => ({ productId: "cx3s-003", size, available: size === "XL" ? 5 : 10, shopifyInventoryItemId: null }))
].flat();

export function getAvailableSizes(productId: string) {
  return inventory.filter((item) => item.productId === productId && item.available > 0).map((item) => item.size);
}
