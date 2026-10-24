import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold uppercase tracking-[.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobra-acid disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-cobra-acid text-black hover:bg-white",
        outline: "border border-white/20 bg-white/5 text-white hover:border-cobra-acid hover:text-cobra-acid",
        ghost: "text-white hover:bg-white/10"
      },
      size: {
        default: "h-12",
        sm: "h-9 px-3 text-xs",
        icon: "size-10 p-0"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
));
Button.displayName = "Button";
