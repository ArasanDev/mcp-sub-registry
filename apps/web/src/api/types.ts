export type {
  GatewayCompatibility,
  JsonPrimitive,
  JsonValue,
  ReadinessResponse,
  ServerDetail,
  ServerList,
  ServerResponse,
  SourceSyncMode,
  SourceSyncRunSummary,
  SourceSummary,
  TagSummary,
  ToolSummary
} from "@shared";

export interface ServerVersionSummary {
  version: string;
  updatedAt: string;
}

export interface ServerVersionsResponse {
  versions: ServerVersionSummary[];
  metadata: { count: number };
}

export interface ServerToolsResponse {
  serverName: string;
  version: string;
  tools: ToolDef[];
  metadata: { count: number };
}

export interface ToolDef {
  name: string;
  description: string | null;
  inputSchema?: unknown;
  outputSchema?: unknown;
  source: string;
  discoveredAt: string | null;
}

export interface SearchResult {
  server: {
    name: string;
    description: string;
    version: string;
    title?: string;
    packages?: unknown[];
    remotes?: Array<Record<string, unknown>>;
    _meta?: Record<string, unknown>;
  };
  _meta: Record<string, unknown>;
  search: { score: number; matchedFields: string[] };
}

export interface SearchResponse {
  servers: SearchResult[];
  metadata: { count: number; query: string };
}

export interface TagListResponse {
  tags: TagItem[];
  metadata: { count: number };
}

export interface TagItem {
  id: number;
  slug: string;
  name: string;
}

export interface GatewayCatalogItem {
  catalogItemId: string;
  name: string;
  version: string;
  isLatest: boolean;
  title: string;
  description: string;
  lifecycleStatus: string;
  updatedAt: string;
  contentHash: string;
  tags: string[];
  qualityLabel: string | null;
  gateway_compatibility: {
    hosted_gateway: boolean;
    requires_connector_runtime: boolean;
    supported_transports: string[];
    reason: string;
  };
  readiness: {
    status: string;
    reasons: string[];
    installType: string;
    hasPackage: boolean;
    hasRemote: boolean;
    requiredSecrets: string[];
    requiredConfig: string[];
  };
  requiredSecrets: string[];
  requiredConfig: string[];
  packages: Array<Record<string, unknown>>;
  remotes: Array<Record<string, unknown>>;
  toolsUrl: string;
  toolCount: number;
  provenance: Record<string, unknown>;
  verification: Record<string, unknown> | null;
  curation: Record<string, unknown>;
  _meta: Record<string, unknown>;
}

export interface GatewayCatalogResponse {
  generatedAt: string;
  nextCursor: string | null;
  items: GatewayCatalogItem[];
}

export interface CatalogServer {
  server: {
    name: string;
    description: string;
    version: string;
    title?: string;
    packages?: unknown[];
    remotes?: Array<Record<string, unknown>>;
  };
  _meta: {
    "com.mcp-gateway.registry/server"?: {
      sourceNames?: string[];
      isOfficial?: boolean;
      qualityLabel?: string;
      tags?: string[];
    };
    "com.mcp-gateway.registry/server-version"?: {
      source?: string;
      status?: string;
      updatedAt?: string;
      isLatest?: boolean;
    };
    "com.mcp-gateway.registry/curation"?: {
      status?: string;
      visibility?: string;
      featured?: boolean;
      tags?: string[];
      qualityLabel?: string;
      notes?: string;
      meta?: {
        verification?: {
          status?: string;
          verifiedAt?: string;
          ownership?: string;
          sourceUrl?: string;
          notes?: string;
        };
      };
      curatedAt?: string;
    };
    "com.mcp-gateway.registry/readiness"?: {
      status?: string;
      installType?: string;
      requiredSecrets?: string[];
    };
    [key: string]: unknown;
  };
}

export interface CatalogResponse {
  servers: CatalogServer[];
  metadata: { count: number };
}

export interface SourcesResponse {
  sources: SourceInfo[];
  metadata: { count: number };
}

export interface SourceInfo {
  id: number;
  name: string;
  type: string;
  baseUrl: string | null;
  enabled: boolean;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastSyncRun: SyncRun | null;
  recentSyncRuns: SyncRun[];
}

export interface SyncRun {
  id: number;
  mode: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  cursor: string | null;
  serversSeen: number;
  versionsSeen: number;
  error: string | null;
}

export interface CurationUpdate {
  serverName: string;
  version?: string;
  status?: "pending" | "approved" | "rejected" | "hidden";
  visibility?: "public" | "private" | "unlisted";
  featured?: boolean;
  notes?: string | null;
  qualityLabel?: string | null;
}
