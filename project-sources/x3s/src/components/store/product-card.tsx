import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <article className="overflow-hidden rounded-md border border-white/10 bg-white/[.04]">
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <Image src={product.images[0]} alt={product.name} fill priority={priority} className="object-contain p-4 transition duration-700 group-hover:scale-105" />
          {product.limited && <span className="absolute left-3 top-3 rounded-sm bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-cobra-acid">Limited</span>}
        </div>
        <div className="flex items-start justify-between gap-4 p-4">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-white/45">{product.category}</p>
            <h3 className="mt-1 text-base font-semibold text-white">{product.name}</h3>
            <p className="mt-2 text-sm text-white/55">{formatPrice(product.price)}</p>
          </div>
          <ArrowUpRight className="mt-1 text-cobra-acid opacity-0 transition group-hover:opacity-100" size={18} />
        </div>
      </article>
    </Link>
  );
}
