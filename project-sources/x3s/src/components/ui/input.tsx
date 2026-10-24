import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn("h-12 w-full rounded-md border border-white/10 bg-white/[.06] px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-cobra-acid", className)}
    {...props}
  />
));
Input.displayName = "Input";
