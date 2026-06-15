import type { ServerResponse, SourceSummary, TagSummary } from "../../api/types";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { FilterBar } from "../../components/FilterBar";
import { curationMeta, curationTone, readinessMeta, readinessTone, versionMeta } from "../../lib/meta";
import type { RegistryFilters } from "../types";
import { AlertCircle, ArrowRight, Filter, RefreshCw, Search } from "lucide-react";

const sortOptions: Array<{ value: RegistryFilters["sort"]; label: string }> = [
  { value: "updated", label: "Updated" },
  { value: "name", label: "Name" },
  { value: "source", label: "Source" },
  { value: "readiness", label: "Readiness" },
  { value: "curation", label: "Curation" }
];

export function ReviewQueuePage({
  rows,
  sources,
  tags,
  filters,
  onFiltersChange,
  onSelect,
  onRefresh
}: {
  rows: ServerResponse[];
  sources: SourceSummary[];
  tags: TagSummary[];
  filters: RegistryFilters;
  onFiltersChange: (filters: RegistryFilters) => void;
  onSelect: (row: ServerResponse) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 animate-in fade-in duration-500 flex flex-col gap-6 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Review</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Triage pending, risky, deprecated, or deleted records before they reach the approved catalog.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="neutral">{rows.length} in review</Badge>
          <Button onClick={onRefresh} variant="secondary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <FilterBar>
        <div className="relative min-w-[220px] flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={filters.query}
            onChange={(event) => onFiltersChange({ ...filters, query: event.target.value })}
            placeholder="Search review queue..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          Filters
        </div>

        <select
          value={filters.curation}
          onChange={(event) => onFiltersChange({ ...filters, curation: event.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Any curation</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="hidden">Hidden</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filters.lifecycle}
          onChange={(event) => onFiltersChange({ ...filters, lifecycle: event.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Any lifecycle</option>
          <option value="active">Active</option>
          <option value="deprecated">Deprecated</option>
          <option value="deleted">Deleted</option>
        </select>

        <select
          value={filters.readiness}
          onChange={(event) => onFiltersChange({ ...filters, readiness: event.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Any readiness</option>
          <option value="ready">Ready</option>
          <option value="needs_secret">Needs secret</option>
          <option value="needs_config">Needs config</option>
          <option value="package_only">Package only</option>
          <option value="remote_only">Remote only</option>
          <option value="unknown">Unknown</option>
          <option value="deprecated">Deprecated</option>
          <option value="deleted">Deleted</option>
        </select>

        <select
          value={filters.source}
          onChange={(event) => onFiltersChange({ ...filters, source: event.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Any source</option>
          {sources.map((source) => (
            <option key={source.id} value={source.name}>
              {source.name}
            </option>
          ))}
        </select>

        <select
          value={filters.tag}
          onChange={(event) => onFiltersChange({ ...filters, tag: event.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Any tag</option>
          {tags.map((tag) => (
            <option key={tag.slug} value={tag.slug}>
              {tag.slug}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              sort: event.target.value as RegistryFilters["sort"]
            })
          }
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </select>
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState title="Inbox Zero">
          No records need your review right now. New or risky records will appear here after sync.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((row) => {
            const readiness = readinessMeta(row);
            const curation = curationMeta(row);
            const lifecycle = versionMeta(row);
            return (
              <article
                key={`${row.server.name}:${row.server.version}`}
                className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => onSelect(row)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {row.server.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge tone={curationTone(curation.status)}>{curation.status || "pending"}</Badge>
                    <Badge tone={readinessTone(readiness.status)}>{readiness.status || "unknown"}</Badge>
                    <Badge tone={lifecycle.status === "active" ? "good" : "warn"}>
                      {lifecycle.status || "active"}
                    </Badge>
                  </div>
                  <div className="flex items-start gap-2 mt-3 text-sm text-muted-foreground bg-muted/50 p-2.5 rounded-lg border border-border/50">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{reviewReason(row)}</span>
                  </div>
                </div>

                <div className="shrink-0 mt-2 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="rounded-full bg-primary/5 text-primary hover:bg-primary/10">
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function reviewReason(row: ServerResponse) {
  const readiness = readinessMeta(row);
  const curation = curationMeta(row);
  const lifecycle = versionMeta(row);

  if (lifecycle.status === "deleted") return "Deleted upstream; confirm whether to hide from catalog.";
  if (lifecycle.status === "deprecated") return "Deprecated upstream; review before publishing.";
  if (readiness.reasons?.[0]) return readiness.reasons[0];
  if ((curation.status || "pending") === "pending") return "New record waiting for owner curation.";
  return row.server.description || "Needs inspection.";
}
