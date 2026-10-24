import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
      <form className="w-full rounded-md border border-white/10 bg-black/70 p-6 backdrop-blur">
        <h1 className="text-4xl font-black uppercase">Register</h1>
        <div className="mt-6 space-y-4"><Input placeholder="Name" /><Input type="email" placeholder="Email" /><Input type="password" placeholder="Password" /></div>
        <Button className="mt-6 w-full">Create account</Button>
        <p className="mt-4 text-sm text-white/55">Already have an account? <Link className="text-cobra-acid" href="/login">Login</Link></p>
      </form>
    </main>
  );
}
