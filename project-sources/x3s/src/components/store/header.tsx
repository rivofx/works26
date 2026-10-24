"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";

export function Header() {
  const { itemCount } = useCart();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-black uppercase tracking-[.28em] text-white">CobraX3S</Link>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[.18em] text-white/70 md:flex">
          <Link className="hover:text-cobra-acid" href="/shop">Shop</Link>
          <Link className="hover:text-cobra-acid" href="/shop?collection=New%20Arrivals">New Arrivals</Link>
          <Link className="hover:text-cobra-acid" href="/shop?collection=Limited%20Edition">Limited</Link>
          <Link className="hover:text-cobra-acid" href="/account">Account</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search"><Search size={18} /></Button>
          <Link href="/account" aria-label="Account" className="hidden rounded-md p-3 text-white hover:bg-white/10 sm:block"><User size={18} /></Link>
          <Link href="/cart" aria-label="Cart" className="relative rounded-md p-3 text-white hover:bg-white/10">
            <ShoppingBag size={18} />
            {itemCount > 0 && <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-cobra-acid text-[10px] font-bold text-black">{itemCount}</span>}
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu"><Menu size={18} /></Button>
        </div>
      </div>
    </header>
  );
}
