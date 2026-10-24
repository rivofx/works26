import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
      <form className="w-full rounded-md border border-white/10 bg-black/70 p-6 backdrop-blur">
        <h1 className="text-4xl font-black uppercase">Reset password</h1>
        <p className="mt-3 text-sm text-white/58">Enter your email and connect this form to Shopify customer recovery later.</p>
        <Input className="mt-6" type="email" placeholder="Email" />
        <Button className="mt-6 w-full">Send reset link</Button>
        <Link className="mt-4 block text-sm text-white/55" href="/login">Back to login</Link>
      </form>
    </main>
  );
}
