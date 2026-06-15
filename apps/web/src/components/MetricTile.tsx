import type { ReactNode } from "react";

export function MetricTile({
  label,
  value,
  detail
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{label}</span>
      <strong className="text-3xl font-bold tracking-tight text-foreground">{value}</strong>
      {detail ? <div className="mt-2 text-sm text-muted-foreground">{detail}</div> : null}
    </div>
  );
}