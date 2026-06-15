import type { ReactNode } from "react";
import { FolderSearch } from "lucide-react";

export function EmptyState({
  title,
  children
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-2xl bg-card/30 backdrop-blur-sm">
      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
        <FolderSearch className="w-8 h-8 text-muted-foreground opacity-70" />
      </div>
      <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>
      {children ? <p className="text-sm text-muted-foreground mt-2 max-w-md">{children}</p> : null}
    </div>
  );
}