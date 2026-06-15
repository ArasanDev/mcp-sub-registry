import type { ServerResponse, SourceSummary, TagSummary } from "../api/types";

export type RegistryFilters = {
  query: string;
  curation: string;
  lifecycle: string;
  readiness: string;
  source: string;
  tag: string;
  sort: "name" | "updated" | "source" | "readiness" | "curation";
};

export type CurationAction = {
  status?: "pending" | "approved" | "rejected" | "hidden";
  visibility?: "public" | "private" | "unlisted";
  featured?: boolean;
  notes?: string;
  qualityLabel?: string | null;
};

export type PageProps = {
  registry: ServerResponse[];
  catalog: ServerResponse[];
  sources: SourceSummary[];
  tags: TagSummary[];
  selected: ServerResponse | null;
  onSelect: (row: ServerResponse) => void;
  onRefreshRegistry: () => void;
  onRefreshCatalog: () => void;
  onRefreshSources: () => void;
};
