import type { ReactNode } from "react";

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-card border border-border/50 p-4 rounded-xl shadow-sm mb-6">
      {children}
    </div>
  );
}