import type { ServerResponse, SourceSummary, TagSummary } from "../../api/types";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { FilterBar } from "../../components/FilterBar";
import { ServerTable } from "../../components/ServerTable";
import type { RegistryFilters } from "../types";
import { Filter, RefreshCw, Search } from "lucide-react";

const sortOptions: Array<{ value: RegistryFilters["sort"]; label: string }> = [
  { value: "updated", label: "Updated" },
  { value: "name", label: "Name" },
  { value: "source", label: "Source" },
  { value: "readiness", label: "Readiness" },
  { value: "curation", label: "Curation" }
];

export function RegistryPage({
  rows,
  sources,
  tags,
  filters,
  onFiltersChange,
  onSelect,
  selected,
  nextCursor,
  hasPrevious,
  onNext,
  onPrevious,
  onRefresh
}: {
  rows: ServerResponse[];
  sources: SourceSummary[];
  tags: TagSummary[];
  filters: RegistryFilters;
  onFiltersChange: (filters: RegistryFilters) => void;
  onSelect: (row: ServerResponse) => void;
  selected: ServerResponse | null;
  nextCursor: string | null;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500 flex flex-col h-full gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Sub-registry</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            The complete local view of servers under this registry’s ownership.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="neutral">{rows.length} in view</Badge>
          <Badge tone="neutral">{sources.length} sources</Badge>
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
            placeholder="Search trusted servers..."
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

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <ServerTable rows={rows} selectedName={selected?.server.name} onSelect={onSelect} />
      </div>

      <div className="flex items-center justify-between mt-6 shrink-0 bg-card p-4 rounded-xl border border-border/50">
        <span className="text-sm text-muted-foreground font-medium">
          {rows.length} records in view
        </span>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={!hasPrevious} onClick={onPrevious}>First page</Button>
          <Button variant="secondary" size="sm" disabled={!nextCursor} onClick={onNext}>Next page</Button>
        </div>
      </div>
    </div>
  );
}
