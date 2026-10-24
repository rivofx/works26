"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { cartKey, useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, totals, removeItem, updateQuantity, discountCode, setDiscountCode } = useCart();
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-5xl font-black uppercase sm:text-7xl">Shopping Cart</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          {items.length === 0 && <div className="rounded-md border border-white/10 bg-white/[.04] p-8 text-white/60">Your cart is empty. <Link href="/shop" className="text-cobra-acid">Shop the drop</Link>.</div>}
          {items.map((item) => (
            <article key={cartKey(item)} className="grid gap-4 rounded-md border border-white/10 bg-white/[.04] p-4 sm:grid-cols-[110px_1fr_auto]">
              <div className="relative aspect-square rounded-md bg-white">
                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
              </div>
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p className="mt-1 text-sm text-white/55">{item.color} / {item.size}</p>
                <p className="mt-3 font-semibold">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <input type="number" min={1} value={item.quantity} onChange={(event) => updateQuantity(cartKey(item), Number(event.target.value))} className="h-10 w-20 rounded-md border border-white/10 bg-black px-3 text-white" />
                <button onClick={() => removeItem(cartKey(item))} className="rounded-md p-2 text-white/50 hover:bg-white/10 hover:text-cobra-acid" aria-label="Remove item"><Trash2 size={18} /></button>
              </div>
            </article>
          ))}
        </section>
        <aside className="h-fit rounded-md border border-white/10 bg-black/70 p-6 backdrop-blur">
          <h2 className="text-2xl font-black uppercase">Order summary</h2>
          <div className="mt-5">
            <label className="text-xs uppercase tracking-[.16em] text-white/50">Discount code</label>
            <Input value={discountCode} onChange={(event) => setDiscountCode(event.target.value)} placeholder="Try VENOM10" className="mt-2" />
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
            <div className="flex justify-between text-white/60"><span>Discount</span><span>-{formatPrice(totals.discount)}</span></div>
            <div className="flex justify-between text-white/60"><span>Shipping estimate</span><span>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold"><span>Total</span><span>{formatPrice(totals.total)}</span></div>
          </div>
          <Link href="/checkout" className="mt-6 block"><Button className="w-full">Checkout</Button></Link>
        </aside>
      </div>
    </main>
  );
}
