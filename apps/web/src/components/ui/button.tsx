import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md font-medium transition-all cursor-pointer border select-none",
          size === "sm" && "px-2.5 py-1 text-xs",
          size === "md" && "px-3 py-1.5 text-[13px]",
          variant === "primary" &&
            "bg-[var(--accent)] text-white border-transparent hover:bg-blue-600",
          variant === "outline" &&
            "bg-transparent border-[var(--border)] text-[var(--tx2)] hover:border-[var(--border2)] hover:text-[var(--tx)]",
          variant === "ghost" &&
            "bg-transparent border-transparent text-[var(--tx2)] hover:bg-[var(--s2)] hover:text-[var(--tx)]",
          variant === "danger" &&
            "bg-transparent border-[var(--border)] text-[var(--red)] hover:bg-[var(--red-d)] hover:border-[var(--red)]",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
