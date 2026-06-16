import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "green" | "yellow" | "orange" | "red" | "blue" | "mono";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-medium rounded px-1.5 py-0.5 whitespace-nowrap",
        variant === "default" && "bg-[var(--s3)] text-[var(--tx2)] border border-[var(--border)]",
        variant === "green" && "bg-[var(--green-d)] text-[var(--green)]",
        variant === "yellow" && "bg-[var(--yel-d)] text-[var(--yellow)]",
        variant === "orange" && "bg-[var(--ora-d)] text-[var(--orange)]",
        variant === "red" && "bg-[var(--red-d)] text-[var(--red)]",
        variant === "blue" && "bg-[var(--acc-dim)] text-[var(--accent)]",
        variant === "mono" && "bg-[var(--s3)] text-[var(--tx2)] font-mono",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusDot({ status }: { status: string }) {
  const color =
    status === "approved"
      ? "bg-[var(--green)]"
      : status === "pending"
        ? "bg-[var(--yellow)]"
        : status === "rejected"
          ? "bg-[var(--red)]"
          : status === "hidden"
            ? "bg-[var(--tx3)]"
            : "bg-[var(--orange)]";

  const textColor =
    status === "approved"
      ? "text-[var(--green)]"
      : status === "pending"
        ? "text-[var(--yellow)]"
        : status === "rejected"
          ? "text-[var(--red)]"
          : status === "hidden"
            ? "text-[var(--tx3)]"
            : "text-[var(--orange)]";

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium", textColor)}>
      <span className={cn("w-[7px] h-[7px] rounded-full flex-shrink-0", color)} />
      {status}
    </span>
  );
}

export function AuthBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center text-[11px] font-medium px-1.5 py-0.5 rounded bg-[var(--acc-dim)] text-[var(--accent)]">
      {type}
    </span>
  );
}
