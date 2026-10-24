"use client";

import Link from "next/link";
import { CreditCard, Lock } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { totals, clearCart } = useCart();
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-5xl font-black uppercase sm:text-7xl">Checkout</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form className="space-y-8">
          <section className="rounded-md border border-white/10 bg-white/[.04] p-6">
            <h2 className="text-2xl font-black uppercase">Shipping information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input placeholder="First name" /><Input placeholder="Last name" />
              <Input className="sm:col-span-2" placeholder="Address" />
              <Input placeholder="City" /><Input placeholder="State" />
              <Input placeholder="ZIP code" /><Input placeholder="Phone" />
            </div>
          </section>
          <section className="rounded-md border border-white/10 bg-white/[.04] p-6">
            <h2 className="text-2xl font-black uppercase">Billing information</h2>
            <label className="mt-5 flex items-center gap-3 text-sm text-white/65"><input type="checkbox" defaultChecked className="rounded border-white/20 bg-black text-cobra-acid" /> Same as shipping address</label>
          </section>
          <section className="rounded-md border border-white/10 bg-white/[.04] p-6">
            <h2 className="flex items-center gap-2 text-2xl font-black uppercase"><CreditCard size={22} /> Payment</h2>
            <p className="mt-3 text-sm text-white/55">Payment provider placeholder. Connect Shopify Payments, Stripe, or Shop Pay later.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input className="sm:col-span-2" placeholder="Card number" />
              <Input placeholder="MM / YY" /><Input placeholder="CVC" />
            </div>
          </section>
        </form>
        <aside className="h-fit rounded-md border border-white/10 bg-black/70 p-6 backdrop-blur">
          <h2 className="text-2xl font-black uppercase">Secure order</h2>
          <div className="mt-6 space-y-3 text-sm text-white/65">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold text-white"><span>Total</span><span>{formatPrice(totals.total)}</span></div>
          </div>
          <Link href="/checkout/confirmation" onClick={clearCart} className="mt-6 block"><Button className="w-full"><Lock size={16} /> Place Order</Button></Link>
        </aside>
      </div>
    </main>
  );
}
