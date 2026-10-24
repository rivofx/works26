import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cobrax3s.com";
  const paths = [
    "",
    "/shop",
    "/cart",
    "/checkout",
    "/account",
    ...products.map((product) => `/shop/${product.slug}`)
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/shop") ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : 0.8
  }));
}
