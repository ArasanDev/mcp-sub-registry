import type { JsonValue, ServerResponse, ToolSummary } from "@shared";

export type {
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
  metadata: {
    count: number;
  };
}

export interface ServerToolsResponse {
  serverName: string;
  version: string;
  tools: ToolSummary[];
  metadata: {
    count: number;
  };
}

export interface SearchResult extends ServerResponse {
  search: {
    score: number;
    matchedFields: string[];
  };
}

export interface SearchResponse {
  servers: SearchResult[];
  metadata: {
    count: number;
    query: string;
  };
}

export interface ServerVersionPayloadsResponse {
  serverName: string;
  version: string;
  rawJson: JsonValue;
  normalizedJson: JsonValue;
}
