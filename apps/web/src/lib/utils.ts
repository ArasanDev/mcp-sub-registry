import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function getAuthType(server: { remotes?: Array<Record<string, unknown>> }): string {
  const remote = server.remotes?.[0];
  if (!remote) return "—";
  const auth = remote["auth"] as Record<string, unknown> | undefined;
  if (!auth) return "none";
  const type = auth["type"] as string | undefined;
  if (type === "bearer") {
    const secret = auth["requiredSecret"] as string | undefined;
    if (secret?.toLowerCase().includes("sigv4") || secret?.toLowerCase().includes("aws")) {
      return "SigV4";
    }
    return "Bearer";
  }
  if (type === "oauth") return "OAuth";
  if (type === "api_key") return "API Key";
  return type ?? "auth";
}

export function extractSecrets(remotes: Array<Record<string, unknown>>): string[] {
  const secrets: string[] = [];
  for (const r of remotes) {
    const headers = r["headers"] as Array<Record<string, unknown>> | undefined;
    if (headers) {
      for (const h of headers) {
        if (h["isSecret"] && h["name"]) {
          secrets.push(h["name"] as string);
        }
      }
    }
    const auth = r["auth"] as Record<string, unknown> | undefined;
    if (auth?.requiredSecret) secrets.push(auth.requiredSecret as string);
  }
  return [...new Set(secrets)];
}
