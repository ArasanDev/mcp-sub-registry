import type { ServerResponse, SourceSummary, TagSummary } from "../../api/types";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { CapabilityCard } from "../../components/CapabilityCard";
import { EmptyState } from "../../components/EmptyState";
import { FilterBar } from "../../components/FilterBar";
import { MetricTile } from "../../components/MetricTile";
import type { RegistryFilters } from "../types";
import { BookOpen, RefreshCw, Search } from "lucide-react";

export function CatalogPage({
  rows,
  sources,
  tags,
  filters,
  onFiltersChange,
  onImport,
  onSelect,
  onRefresh
}: {
  rows: ServerResponse[];
  sources: SourceSummary[];
  tags: TagSummary[];
  filters: RegistryFilters;
  onFiltersChange: (filters: RegistryFilters) => void;
  selected: ServerResponse | null;
  onSelect: (row: ServerResponse) => void;
  onImport: (row: ServerResponse) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500 overflow-y-auto flex flex-col gap-8">
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Approved catalog
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                The gateway-ready shortlist.
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Only approved and visible records are shown here. Use this surface to confirm what the
                Gateway can consume without exposing the broader registry.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="good">{rows.length} approved</Badge>
            <Badge tone="neutral">{sources.length} sources</Badge>
            <Badge tone="private">{tags.length} tags</Badge>
            <Button variant="secondary" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricTile label="Approved" value={rows.length} detail="Visible to the Gateway" />
          <MetricTile label="Sources" value={sources.length} detail="Upstream feeds" />
          <MetricTile label="Tags" value={tags.length} detail="Catalog labels" />
        </div>
      </section>

      <FilterBar>
        <div className="relative min-w-[260px] flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={filters.query}
            onChange={(event) => onFiltersChange({ ...filters, query: event.target.value })}
            placeholder="Search approved servers..."
            className="w-full rounded-2xl border border-border/40 bg-card py-4 pl-12 pr-4 text-lg text-foreground shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <Badge tone="neutral">{rows.length} results</Badge>
      </FilterBar>

      {rows.length === 0 ? (
        <div className="space-y-4">
          <EmptyState title="No approved servers found">
            Try adjusting your search or import and approve more servers.
          </EmptyState>
          <div className="flex justify-center">
            <Button variant="secondary" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh catalog
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rows.map((row) => (
            <CapabilityCard
              key={row.server.name}
              server={row}
              onClick={() => onSelect(row)}
              onImport={(e) => {
                e.preventDefault();
                onImport(row);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
