import { apiGet } from "./client";
import type { CatalogServer, ServerToolsResponse } from "./types";

export interface ServerDetailResponse {
  server: CatalogServer["server"];
  _meta: CatalogServer["_meta"];
}

export function fetchServer(name: string): Promise<ServerDetailResponse> {
  return apiGet<ServerDetailResponse>(`/v0.1/servers/${encodeURIComponent(name)}`);
}

export function fetchServerTools(name: string): Promise<ServerToolsResponse> {
  return apiGet<ServerToolsResponse>(`/v0.1/servers/${encodeURIComponent(name)}/tools`);
}
