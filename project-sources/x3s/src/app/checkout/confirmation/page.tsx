import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-16 text-center sm:px-6">
      <div className="rounded-md border border-white/10 bg-black/70 p-8 backdrop-blur">
        <CheckCircle2 className="mx-auto text-cobra-acid" size={54} />
        <h1 className="mt-6 text-4xl font-black uppercase sm:text-6xl">Order confirmed</h1>
        <p className="mt-5 text-white/62">Your CobraX3S order has been received. This confirmation page is ready to connect to real Shopify order IDs and customer email receipts.</p>
        <Link href="/shop" className="mt-8 inline-block"><Button>Continue shopping</Button></Link>
      </div>
    </main>
  );
}
