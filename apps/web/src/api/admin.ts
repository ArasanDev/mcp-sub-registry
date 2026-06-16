import { apiGet, apiPatch, apiPost } from "./client";
import type { CurationUpdate, SourcesResponse } from "./types";

export function fetchSources(adminKey: string): Promise<SourcesResponse> {
  return apiGet<SourcesResponse>("/v0.1/sources", adminKey);
}

export interface CurationResult {
  curation: Record<string, unknown>;
}

export function updateCuration(update: CurationUpdate, adminKey: string): Promise<CurationResult> {
  return apiPatch<CurationResult>("/v0.1/admin/curations", update, adminKey);
}

export interface SyncResult {
  sync: {
    mode: string;
    status: string;
    serversSeen: number;
    versionsSeen: number;
    error: string | null;
  };
}

export function triggerSync(
  sourceId: number,
  adminKey: string,
  mode = "latest_only"
): Promise<SyncResult> {
  return apiPost<SyncResult>(`/v0.1/admin/sources/${sourceId}/sync`, { mode }, adminKey);
}

export function exportBackup(adminKey: string): Promise<unknown> {
  return apiGet("/v0.1/admin/backup", adminKey);
}
