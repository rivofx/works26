import Link from "next/link";
import { Heart, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.22em] text-cobra-acid">Member area</p>
          <h1 className="mt-3 text-5xl font-black uppercase sm:text-7xl">Account</h1>
        </div>
        <div className="flex gap-3"><Link href="/login"><Button variant="outline">Login</Button></Link><Link href="/register"><Button>Register</Button></Link></div>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-md border border-white/10 bg-white/[.04] p-6">
          <User className="text-cobra-acid" /><h2 className="mt-4 text-2xl font-black uppercase">Profile</h2>
          <p className="mt-3 text-sm text-white/60">Customer profile placeholder for Shopify customer account mapping.</p>
        </section>
        <section className="rounded-md border border-white/10 bg-white/[.04] p-6">
          <Package className="text-cobra-acid" /><h2 className="mt-4 text-2xl font-black uppercase">Order history</h2>
          <p className="mt-3 text-sm text-white/60">No completed orders yet. Future orders can sync from Shopify.</p>
        </section>
        <section className="rounded-md border border-white/10 bg-white/[.04] p-6">
          <Heart className="text-cobra-acid" /><h2 className="mt-4 text-2xl font-black uppercase">Wishlist</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {products.slice(0, 2).map((product) => <li key={product.id}>{product.name}</li>)}
          </ul>
        </section>
      </div>
    </main>
  );
}
