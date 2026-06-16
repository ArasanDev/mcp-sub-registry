import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-[var(--s2)] border border-[var(--border)] rounded-md px-3 py-1.5",
        "text-[13px] text-[var(--tx)] placeholder:text-[var(--tx3)]",
        "outline-none focus:border-[var(--accent)] transition-colors",
        "font-[Geist,system-ui]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
