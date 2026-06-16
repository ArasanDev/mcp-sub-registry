import { apiGet } from "./client";
import type { CatalogResponse, SearchResponse, TagListResponse } from "./types";

export function fetchCatalog(opts: { tag?: string; featured?: boolean } = {}): Promise<CatalogResponse> {
  const p = new URLSearchParams();
  if (opts.tag) p.set("tag", opts.tag);
  if (opts.featured) p.set("featured", "true");
  const qs = p.toString();
  return apiGet<CatalogResponse>(`/v0.1/catalog${qs ? `?${qs}` : ""}`);
}

export function fetchSearch(query: string): Promise<SearchResponse> {
  return apiGet<SearchResponse>(`/v0.1/search?q=${encodeURIComponent(query)}&limit=50`);
}

export function fetchTags(): Promise<TagListResponse> {
  return apiGet<TagListResponse>("/v0.1/tags");
}
