import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/product-card";
import { ProductActions } from "@/components/store/product-actions";
import { getProductBySlug, products } from "@/data/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: [product.images[0]]
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: "CobraX3S" },
    offers: { "@type": "Offer", priceCurrency: "USD", price: product.price, availability: "https://schema.org/InStock" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "37" }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Script id={`schema-${product.id}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductActions product={product} />
      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        <div className="rounded-md border border-white/10 bg-white/[.04] p-6">
          <h2 className="text-xl font-black uppercase">Product details</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/65">
            {product.details.map((detail) => <li key={detail}>+ {detail}</li>)}
          </ul>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[.04] p-6">
          <h2 className="text-xl font-black uppercase">Reviews</h2>
          <p className="mt-5 text-sm leading-7 text-white/65">4.8 average rating. Customers highlight the heavyweight feel, dramatic artwork, and true oversized streetwear fit.</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[.04] p-6">
          <h2 className="text-xl font-black uppercase">Shipping</h2>
          <p className="mt-5 text-sm leading-7 text-white/65">Free shipping over $150. Orders ship from the CobraX3S warehouse with future Shopify fulfillment mapping ready.</p>
        </div>
      </section>
      <section className="mt-16">
        <h2 className="mb-6 text-3xl font-black uppercase">Related products</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </section>
    </main>
  );
}
