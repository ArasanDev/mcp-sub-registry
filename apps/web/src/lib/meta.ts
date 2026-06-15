import { metaKeys } from "@shared";
import type {
  JsonValue,
  ReadinessResponse,
  ServerResponse
} from "../api/types";

export interface CurationMeta {
  status?: "pending" | "approved" | "rejected" | "hidden" | string;
  visibility?: "public" | "private" | "unlisted" | string;
  featured?: boolean;
  tags?: string[];
  notes?: string | null;
  qualityLabel?: string | null;
}

export interface ServerMeta {
  sourceNames?: string[];
  isOfficial?: boolean;
}

export interface VersionMeta {
  source?: string;
  status?: "active" | "deprecated" | "deleted" | string;
  updatedAt?: string;
  publishedAt?: string | null;
  isLatest?: boolean;
}

export function curationMeta(row: ServerResponse): CurationMeta {
  return objectMeta<CurationMeta>(row._meta[metaKeys.curation]);
}

export function readinessMeta(row: ServerResponse): Partial<ReadinessResponse> {
  return objectMeta<Partial<ReadinessResponse>>(row._meta[metaKeys.readiness]);
}

export function serverMeta(row: ServerResponse): ServerMeta {
  return objectMeta<ServerMeta>(row._meta[metaKeys.server]);
}

export function versionMeta(row: ServerResponse): VersionMeta {
  return objectMeta<VersionMeta>(row._meta[metaKeys.serverVersion]);
}

export function objectMeta<T extends object>(value: JsonValue | undefined): T {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as T)
    : ({} as T);
}

export function readinessTone(value?: string) {
  if (value === "ready" || value === "remote_only" || value === "package_only") {
    return "good" as const;
  }
  if (value === "needs_secret" || value === "needs_config") return "warn" as const;
  if (value === "deleted" || value === "deprecated") return "bad" as const;
  return "neutral" as const;
}

export function lifecycleTone(value?: string) {
  if (value === "deleted" || value === "removed_upstream") return "bad" as const;
  if (value === "deprecated") return "warn" as const;
  return "good" as const;
}

export function curationTone(value?: string) {
  if (value === "approved") return "good" as const;
  if (value === "rejected" || value === "hidden") return "bad" as const;
  return "warn" as const;
}
