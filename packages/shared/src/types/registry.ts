import type { GatewayReadiness } from "./readiness";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface GatewayCompatibility {
  hosted_gateway: boolean;
  requires_connector_runtime: boolean;
  supported_transports: string[];
  reason: string;
}

export interface ServerDetail {
  name: string;
  description: string;
  version: string;
  title?: string;
  packages?: Array<Record<string, JsonValue>>;
  remotes?: Array<Record<string, JsonValue>>;
  _meta?: Record<string, JsonValue>;
}

export interface ServerResponse {
  server: ServerDetail;
  _meta: Record<string, JsonValue>;
}

export interface ServerList {
  servers: ServerResponse[];
  metadata: {
    count: number;
    nextCursor?: string | null;
  };
}

export interface TagSummary {
  id: number;
  slug: string;
  name: string;
}

export type SourceSyncMode = "full_etl" | "incremental" | "latest_only";

export interface SourceSyncRunSummary {
  id: number;
  mode: SourceSyncMode | string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  cursor: string | null;
  serversSeen: number;
  versionsSeen: number;
  error: string | null;
}

export interface SourceSummary {
  id: number;
  name: string;
  type: string;
  baseUrl: string | null;
  enabled: boolean;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastSyncRun: SourceSyncRunSummary | null;
  recentSyncRuns: SourceSyncRunSummary[];
}

export interface ToolSummary {
  name: string;
  description: string | null;
  inputSchema?: JsonValue;
  outputSchema?: JsonValue;
  source: string;
  discoveredAt: string | null;
}

export interface ReadinessResponse extends GatewayReadiness {}
