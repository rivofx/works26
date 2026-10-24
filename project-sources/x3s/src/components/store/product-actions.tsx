"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { makeCartItem } from "@/lib/cart";

export function ProductActions({ product }: { product: Product }) {
  const [image, setImage] = useState(product.images[0]);
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  function add() {
    addItem(makeCartItem(product, size, color, quantity));
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
      <div>
        <div className="group relative aspect-[4/5] overflow-hidden rounded-md bg-white">
          <Image src={image} alt={product.name} fill priority className="object-contain p-6 transition duration-500 group-hover:scale-110" />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {product.images.map((item) => (
            <button key={item} onClick={() => setImage(item)} className={`relative aspect-square overflow-hidden rounded-md bg-white ${image === item ? "ring-2 ring-cobra-acid" : "ring-1 ring-white/10"}`}>
              <Image src={item} alt={`${product.name} gallery image`} fill className="object-contain p-2" />
            </button>
          ))}
        </div>
      </div>
      <div className="lg:pt-6">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-cobra-acid">{product.sku}</p>
        <h1 className="mt-3 text-4xl font-black uppercase sm:text-6xl">{product.name}</h1>
        <p className="mt-5 text-2xl font-semibold">${product.price}</p>
        <p className="mt-5 text-lg leading-8 text-white/65">{product.description}</p>

        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-white/50">Color</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.colors.map((entry) => (
              <button key={entry.name} onClick={() => { setColor(entry.name); setImage(entry.image); }} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${color === entry.name ? "border-cobra-acid" : "border-white/10"}`}>
                <span className="size-5 rounded-full border border-white/20" style={{ backgroundColor: entry.value }} />
                {entry.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-white/50">Size</p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {product.sizes.map((entry) => (
              <button key={entry} onClick={() => setSize(entry)} className={`h-11 rounded-md border text-sm font-bold ${size === entry ? "border-cobra-acid bg-cobra-acid text-black" : "border-white/10 bg-white/[.04] text-white"}`}>{entry}</button>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-white/50">Quantity</p>
          <div className="mt-3 inline-flex h-12 overflow-hidden rounded-md border border-white/10">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 bg-white/[.04] text-xl">-</button>
            <span className="grid w-14 place-items-center text-sm font-bold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-12 bg-white/[.04] text-xl">+</button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button onClick={add}><ShoppingBag size={17} /> Add to Cart</Button>
          <Button variant="outline" onClick={add}><Zap size={17} /> Buy Now</Button>
        </div>
      </div>
    </div>
  );
}
