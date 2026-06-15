import type { ReactNode } from "react";
import { cn } from "../lib/utils";

const toneStyles = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  good: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  warn: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  bad: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  private: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20"
};

export function Badge({
  tone = "neutral",
  children,
  className
}: {
  tone?: keyof typeof toneStyles;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border transition-colors",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}