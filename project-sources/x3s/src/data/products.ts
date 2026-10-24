export type ProductCategory = "Hoodies" | "T-Shirts" | "Sweaters";

export type Product = {
  id: string;
  shopifyProductId: string | null;
  slug: string;
  sku: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  collections: string[];
  tags: string[];
  colors: { name: string; value: string; image: string }[];
  sizes: string[];
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  limited: boolean;
  seoTitle: string;
  seoDescription: string;
};

export const products: Product[] = [
  {
    id: "cx3s-001",
    shopifyProductId: null,
    slug: "shadow-core-oversized-hoodie",
    sku: "CX3S-HD-SHD-001",
    name: "Shadow Core Oversized Hoodie",
    description:
      "A washed charcoal pullover hoodie with tonal embroidered artwork, structured volume, and a heavy streetwear silhouette built for cold nights and louder entrances.",
    details: ["Oversized pullover fit", "Tonal raised front artwork", "Kangaroo pocket", "Ribbed cuffs and hem", "Detected color: washed charcoal black"],
    price: 118,
    compareAtPrice: 148,
    category: "Hoodies",
    collections: ["Hoodies", "New Arrivals", "Best Sellers", "Featured Collection"],
    tags: ["hoodie", "oversized", "washed black", "streetwear", "cobrax3s"],
    colors: [{ name: "Washed Charcoal", value: "#26282a", image: "/products/cobrax3s-shadow-core-hoodie.png" }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/products/cobrax3s-shadow-core-hoodie.png"],
    featured: true,
    bestSeller: true,
    limited: false,
    seoTitle: "Shadow Core Oversized Hoodie | CobraX3S Premium Streetwear",
    seoDescription: "Shop the CobraX3S Shadow Core Oversized Hoodie in washed charcoal with tonal artwork, premium streetwear fit, and luxury finishing."
  },
  {
    id: "cx3s-002",
    shopifyProductId: null,
    slug: "inferno-zip-hoodie",
    sku: "CX3S-HD-INF-002",
    name: "Inferno Gradient Zip Hoodie",
    description:
      "A red gradient zip hoodie with aggressive black appliqué artwork, star sleeve details, and a polished metal zipper for a collectible CobraX3S drop feel.",
    details: ["Full zip construction", "Black textured chest artwork", "Star sleeve patches", "Lined hood", "Detected color: flame red gradient"],
    price: 132,
    compareAtPrice: 164,
    category: "Hoodies",
    collections: ["Hoodies", "New Arrivals", "Best Sellers", "Limited Edition"],
    tags: ["zip hoodie", "red", "gradient", "limited", "streetwear"],
    colors: [{ name: "Inferno Red", value: "#d41224", image: "/products/cobrax3s-inferno-zip-hoodie.png" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: ["/products/cobrax3s-inferno-zip-hoodie.png"],
    featured: true,
    bestSeller: true,
    limited: true,
    seoTitle: "Inferno Gradient Zip Hoodie | CobraX3S Limited Edition",
    seoDescription: "Discover the CobraX3S Inferno Gradient Zip Hoodie, a red luxury streetwear zip hoodie with black artwork and sleeve patch details."
  },
  {
    id: "cx3s-003",
    shopifyProductId: null,
    slug: "venom-pink-zip-hoodie",
    sku: "CX3S-HD-VNM-003",
    name: "Venom Pink Zip Hoodie",
    description:
      "A saturated hot pink zip hoodie with black raised artwork, satin hood lining, and limited-edition attitude made for standout streetwear styling.",
    details: ["Full zip construction", "Raised black front artwork", "Satin-look hood lining", "Sleeve patch graphics", "Detected color: venom pink"],
    price: 132,
    category: "Hoodies",
    collections: ["Hoodies", "Featured Collection", "Limited Edition"],
    tags: ["zip hoodie", "pink", "venom", "limited", "luxury streetwear"],
    colors: [{ name: "Venom Pink", value: "#e21872", image: "/products/cobrax3s-venom-pink-zip-hoodie.png" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: ["/products/cobrax3s-venom-pink-zip-hoodie.png"],
    featured: true,
    bestSeller: false,
    limited: true,
    seoTitle: "Venom Pink Zip Hoodie | CobraX3S Fashion Hoodie",
    seoDescription: "Shop the CobraX3S Venom Pink Zip Hoodie with black raised artwork, satin hood lining, and premium futuristic streetwear energy."
  }
];

export const collections = ["Hoodies", "T-Shirts", "Sweaters", "New Arrivals", "Best Sellers", "Featured Collection", "Limited Edition"];

export const categories = [
  { name: "Hoodies", image: "/categories/hoodies.png", href: "/shop?category=Hoodies" },
  { name: "T-Shirts", image: "/categories/new-arrivals.png", href: "/shop?category=T-Shirts" },
  { name: "Sweaters", image: "/categories/limited-edition.png", href: "/shop?category=Sweaters" }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
