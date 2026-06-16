import { apiGet } from "./client";
import type { GatewayCatalogResponse } from "./types";

export function fetchGatewayCatalog(limit = 100): Promise<GatewayCatalogResponse> {
  return apiGet<GatewayCatalogResponse>(`/v0.1/gateway/catalog?limit=${limit}`);
}
