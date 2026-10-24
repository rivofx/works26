"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState("All");
  const [color, setColor] = useState("All");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [collection, setCollection] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategory(params.get("category") ?? "All");
    setCollection(params.get("collection"));
  }, []);

  const colors = Array.from(new Set(products.flatMap((product) => product.colors.map((entry) => entry.name))));
  const filtered = useMemo(() => {
    const selected = products
      .filter((product) => !collection || product.collections.includes(collection))
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => size === "All" || product.sizes.includes(size))
      .filter((product) => color === "All" || product.colors.some((entry) => entry.name === color))
      .filter((product) => `${product.name} ${product.description} ${product.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === "price-low") selected.sort((a, b) => a.price - b.price);
    if (sort === "price-high") selected.sort((a, b) => b.price - a.price);
    if (sort === "new") selected.sort((a, b) => b.id.localeCompare(a.id));
    return selected;
  }, [category, collection, color, query, size, sort]);

  const pageSize = 6;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-cobra-acid">{collection ?? "All collections"}</p>
        <h1 className="mt-3 text-5xl font-black uppercase sm:text-7xl">Shop CobraX3S</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-md border border-white/10 bg-black/60 p-4 backdrop-blur">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[.16em]"><Filter size={16} /> Filters</div>
          <label className="text-xs uppercase tracking-[.16em] text-white/50">Search</label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-3 text-white/35" size={17} />
            <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className="pl-10" placeholder="Find a drop" />
          </div>
          {[
            ["Category", category, setCategory, ["All", "Hoodies", "T-Shirts", "Sweaters"]],
            ["Size", size, setSize, ["All", ...sizes]],
            ["Color", color, setColor, ["All", ...colors]]
          ].map(([label, value, setter, options]) => (
            <div key={String(label)} className="mt-5">
              <label className="text-xs uppercase tracking-[.16em] text-white/50">{String(label)}</label>
              <select value={String(value)} onChange={(event) => { (setter as (next: string) => void)(event.target.value); setPage(1); }} className="mt-2 h-12 w-full rounded-md border border-white/10 bg-cobra-charcoal px-3 text-sm text-white">
                {(options as string[]).map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
          ))}
          <div className="mt-5">
            <label className="text-xs uppercase tracking-[.16em] text-white/50">Sort</label>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-2 h-12 w-full rounded-md border border-white/10 bg-cobra-charcoal px-3 text-sm text-white">
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
            </select>
          </div>
          <div className="mt-5">
            <label className="text-xs uppercase tracking-[.16em] text-white/50">Price</label>
            <div className="mt-3 text-sm text-white/60">$100 - $150 premium drop range</div>
          </div>
        </aside>
        <section>
          <div className="mb-5 text-sm text-white/55">{filtered.length} products found</div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, index) => (
              <button key={index} onClick={() => setPage(index + 1)} className={`size-10 rounded-md border text-sm font-bold ${page === index + 1 ? "border-cobra-acid bg-cobra-acid text-black" : "border-white/10 bg-white/[.04] text-white"}`}>{index + 1}</button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
