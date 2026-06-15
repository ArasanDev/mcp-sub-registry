import type { ReactNode } from "react";
import type { ServerResponse, SourceSummary } from "../../api/types";
import { Button } from "../../components/Button";
import { CapabilityCard } from "../../components/CapabilityCard";
import { MetricTile } from "../../components/MetricTile";
import { curationMeta, readinessMeta, versionMeta } from "../../lib/meta";
import { formatDate } from "../../lib/format";
import { Activity, Server, AlertCircle, PlayCircle, ArrowRight, Sparkles } from "lucide-react";

export function OverviewPage({
  registry,
  catalog,
  sources,
  reviewCount,
  onSync,
  onOpenReview,
  onOpenPublished,
  onSelect,
  onImport
}: {
  registry: ServerResponse[];
  catalog: ServerResponse[];
  sources: SourceSummary[];
  reviewCount: number;
  onSync: () => void;
  onOpenReview: () => void;
  onOpenPublished: () => void;
  onSelect: (row: ServerResponse) => void;
  onImport: (row: ServerResponse) => void;
}) {
  const readinessIssues = registry.filter((row) =>
    ["needs_secret", "needs_config", "unknown", "deprecated", "deleted"].includes(
      readinessMeta(row).status || "unknown"
    )
  ).length;
  const pending = registry.filter((row) => (curationMeta(row).status || "pending") === "pending").length;
  const lifecycleIssues = registry.filter((row) =>
    ["deprecated", "deleted"].includes(versionMeta(row).status || "")
  ).length;
  const lastSync = sources
    .map((source) => source.lastSyncedAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  const featured = catalog.slice(0, 3);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500 overflow-y-auto space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(10,132,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(52,199,89,0.10),transparent_28%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Import first
            </div>
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                Discover, import, and trust the few MCP servers that matter.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                The sub-registry should feel like a shortlist, not a store. Search upstream, import
                the useful records, and keep the approved set obvious.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={onOpenPublished}>
                <ArrowRight className="w-4 h-4 mr-2" /> Browse catalog
              </Button>
              <Button variant="secondary" onClick={onOpenReview}>
                <AlertCircle className="w-4 h-4 mr-2" /> Review queue
              </Button>
              <Button variant="secondary" onClick={onSync}>
                <PlayCircle className="w-4 h-4 mr-2" /> Sync source
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 self-start">
            <MetricTile label="Approved" value={catalog.length} detail="Visible downstream" />
            <MetricTile label="Review" value={reviewCount} detail="Needs attention" />
            <MetricTile label="Pending" value={pending} detail="Waiting for curation" />
            <MetricTile label="Sources" value={sources.length} detail="Upstream inputs" />
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">Featured imports</h3>
              <p className="text-muted-foreground mt-2">
                Start with a small list of trusted records already available to import.
              </p>
            </div>
            <Button variant="secondary" onClick={onOpenPublished}>
              Browse all
            </Button>
          </div>

          {featured.length === 0 ? (
            <EmptyShelf title="No catalog entries yet">
              Sync a source or create a private entry to populate the shortlist.
            </EmptyShelf>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((row) => (
                <CapabilityCard
                  key={row.server.name}
                  server={row}
                  onClick={() => onSelect(row)}
                  onImport={() => onImport(row)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">Current system</h3>
            <p className="text-muted-foreground mt-2">
              Keep the product narrow. The job is to select, import, and curate.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-primary" />
                <strong className="text-sm uppercase tracking-wider text-foreground">Sources</strong>
              </div>
              <p className="text-sm text-muted-foreground">
                {sources.length === 0 ? "No sources configured." : `${sources.length} configured sources.`}
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <strong className="text-sm uppercase tracking-wider text-foreground">Sync</strong>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Last sync: {formatDate(lastSync) || "N/A"}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-muted-foreground/80">
                {lifecycleIssues} lifecycle issues · {readinessIssues} readiness issues
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function EmptyShelf({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-border/60 bg-card/40 p-8 text-center">
      <h4 className="text-lg font-semibold text-foreground">{title}</h4>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{children}</p>
    </div>
  );
}
