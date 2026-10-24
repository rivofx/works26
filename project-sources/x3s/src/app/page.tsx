import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { MotionReveal } from "@/components/store/motion-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, products } from "@/data/products";
import type { LucideIcon } from "lucide-react";

export default function HomePage() {
  const featured = products.filter((product) => product.featured);
  const bestSellers = products.filter((product) => product.bestSeller);
  const trustItems: [string, LucideIcon][] = [["Fast ship", Truck], ["Secure checkout", ShieldCheck], ["Limited runs", Sparkles]];

  return (
    <main>
      <section className="noise relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
          <MotionReveal>
          <div className="relative z-10 max-w-3xl">
            <p className="mb-5 inline-flex rounded-sm border border-cobra-acid/50 bg-cobra-acid/10 px-3 py-2 text-xs font-bold uppercase tracking-[.22em] text-cobra-acid">Luxury streetwear drop 01</p>
            <h1 className="text-6xl font-black uppercase leading-[.86] tracking-normal text-white sm:text-8xl lg:text-9xl">CobraX3S</h1>
            <p className="mt-6 max-w-xl text-xl text-white/72 sm:text-2xl">Unleash Your Style</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop"><Button>Shop Now <ArrowRight size={17} /></Button></Link>
              <Link href="/shop?collection=New%20Arrivals"><Button variant="outline">New Arrivals</Button></Link>
            </div>
          </div>
          </MotionReveal>
          <MotionReveal delay={0.15}>
          <div className="relative z-10 mx-auto w-full max-w-lg">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-white/10 bg-white shadow-glow">
              <Image src="/products/cobrax3s-inferno-zip-hoodie.png" alt="CobraX3S Inferno Gradient Zip Hoodie" fill priority className="object-contain p-5" />
            </div>
          </div>
          </MotionReveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-cobra-acid py-3 text-black">
        <div className="flex animate-marquee whitespace-nowrap text-sm font-black uppercase tracking-[.2em]">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex gap-10 pr-10">
              <span>Unleash Your Style</span><span>Premium Streetwear</span><span>Limited Drops</span><span>CobraX3S</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cobra-acid">Featured collection</p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl">First Strike</h2>
          </div>
          <Link href="/shop" className="hidden text-sm font-bold uppercase tracking-[.16em] text-white/70 hover:text-cobra-acid sm:block">View all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => <ProductCard key={product.id} product={product} priority={index === 0} />)}
        </div>
      </section>

      <section className="bg-white/[.04] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-cobra-acid">Shop by category</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group relative aspect-[5/4] overflow-hidden rounded-md border border-white/10 bg-black">
                <Image src={category.image} alt={category.name} fill className="object-contain p-6 opacity-80 transition group-hover:scale-105 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-6">
                  <h3 className="text-2xl font-black uppercase">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cobra-acid">Brand story</p>
            <h2 className="mt-4 text-4xl font-black uppercase sm:text-6xl">Built for the after-hours uniform.</h2>
            <p className="mt-6 text-lg leading-8 text-white/66">CobraX3S blends sharp silhouettes, high-contrast artwork, and future-facing streetwear details into pieces that feel rare from the first wear. Every drop is organized for Shopify expansion, with product IDs, variants, inventory records, and collection logic ready to map into a storefront backend.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustItems.map(([label, Icon]) => (
                <div key={label} className="rounded-md border border-white/10 bg-white/[.04] p-4">
                  <Icon className="text-cobra-acid" size={22} />
                  <p className="mt-3 text-sm font-bold uppercase tracking-[.14em]">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="relative aspect-[4/5] overflow-hidden rounded-md bg-white">
                <Image src={product.images[0]} alt={product.name} fill className="object-contain p-4" />
              </div>
            ))}
            <div className="rounded-md border border-cobra-acid/30 bg-cobra-acid p-6 text-black">
              <Mail size={28} />
              <h3 className="mt-6 text-2xl font-black uppercase">Join the list</h3>
              <p className="mt-2 text-sm font-medium text-black/70">Early access to future drops.</p>
              <div className="mt-5 flex gap-2">
                <Input placeholder="Email address" className="border-black/10 bg-black/10 text-black placeholder:text-black/50" />
                <Button className="bg-black text-white hover:bg-cobra-charcoal">Join</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cobra-acid">Best sellers</p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl">Most wanted</h2>
          </div>
        </div>
        <div className="flex snap-x gap-5 overflow-x-auto pb-4">
          {bestSellers.map((product) => <div key={product.id} className="min-w-[280px] snap-start sm:min-w-[360px]"><ProductCard product={product} /></div>)}
        </div>
      </section>
    </main>
  );
}
