import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
      <form className="w-full rounded-md border border-white/10 bg-black/70 p-6 backdrop-blur">
        <h1 className="text-4xl font-black uppercase">Login</h1>
        <div className="mt-6 space-y-4"><Input type="email" placeholder="Email" /><Input type="password" placeholder="Password" /></div>
        <Button className="mt-6 w-full">Login</Button>
        <div className="mt-4 flex justify-between text-sm text-white/55"><Link href="/forgot-password">Forgot password?</Link><Link href="/register">Create account</Link></div>
      </form>
    </main>
  );
}
