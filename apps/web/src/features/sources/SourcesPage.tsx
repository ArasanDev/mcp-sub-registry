import { useEffect, useMemo, useState, type FormEvent } from "react";
import { apiPatch, apiPost } from "../../api/client";
import type { SourceSummary, SourceSyncMode, SourceSyncRunSummary } from "../../api/types";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { formatDate } from "../../lib/format";
import { Server, Settings, RefreshCw, Power, ServerCog } from "lucide-react";

type SourceDraft = {
  name: string;
  type: string;
  baseUrl: string;
  enabled: boolean;
};

type SyncResponse = {
  sync?: Partial<SourceSyncRunSummary> & {
    sourceName?: string;
  };
};

const syncModes: Array<{ mode: SourceSyncMode; label: string }> = [
  { mode: "latest_only", label: "Latest" },
  { mode: "incremental", label: "Incremental" },
  { mode: "full_etl", label: "Full" }
];

export function SourcesPage({
  sources,
  adminKey,
  onRefresh,
  onActivity
}: {
  sources: SourceSummary[];
  adminKey: string;
  onRefresh: () => void;
  onActivity: (line: string) => void;
}) {
  const [busySource, setBusySource] = useState<number | null>(null);
  const [busyAction, setBusyAction] = useState<"sync" | "save" | "toggle" | null>(null);
  const [editingSource, setEditingSource] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, SourceDraft>>({});
  const [messages, setMessages] = useState<Record<number, string>>({});

  useEffect(() => {
    setDrafts((current) =>
      Object.fromEntries(
        sources.map((source) => {
          const currentDraft = current[source.id];
          return [
            source.id,
            editingSource === source.id && currentDraft ? currentDraft : toDraft(source)
          ];
        })
      )
    );
  }, [editingSource, sources]);

  async function syncSource(source: SourceSummary, mode: SourceSyncMode) {
    setBusySource(source.id);
    setBusyAction("sync");
    setMessages((current) => ({ ...current, [source.id]: "" }));
    try {
      const result = await apiPost<SyncResponse>(
        `/admin/sources/${source.id}/sync`,
        { mode },
        adminKey
      );
      const summary = syncSummary(result.sync);
      onActivity(`Synced ${source.name} (${modeLabel(mode)}): ${summary}`);
      setMessages((current) => ({ ...current, [source.id]: `Sync complete: ${summary}` }));
      await onRefresh();
    } catch (error) {
      const message = errorMessage(error);
      setMessages((current) => ({ ...current, [source.id]: `Sync failed: ${message}` }));
      onActivity(`Sync failed for ${source.name}: ${message}`);
    } finally {
      setBusySource(null);
      setBusyAction(null);
    }
  }

  async function saveSource(source: SourceSummary) {
    const draft = drafts[source.id] || toDraft(source);
    setBusySource(source.id);
    setBusyAction("save");
    setMessages((current) => ({ ...current, [source.id]: "" }));
    try {
      await apiPatch(
        `/admin/sources/${source.id}`,
        {
          name: draft.name.trim(),
          type: draft.type,
          baseUrl: normalizeBaseUrl(draft.baseUrl),
          enabled: draft.enabled
        },
        adminKey
      );
      setEditingSource(null);
      setMessages((current) => ({ ...current, [source.id]: "Source saved" }));
      onActivity(`Updated source ${draft.name.trim() || source.name}`);
      await onRefresh();
    } catch (error) {
      const message = errorMessage(error);
      setMessages((current) => ({ ...current, [source.id]: `Save failed: ${message}` }));
      onActivity(`Source update failed for ${source.name}: ${message}`);
    } finally {
      setBusySource(null);
      setBusyAction(null);
    }
  }

  async function toggleSource(source: SourceSummary) {
    setBusySource(source.id);
    setBusyAction("toggle");
    setMessages((current) => ({ ...current, [source.id]: "" }));
    try {
      await apiPatch(
        `/admin/sources/${source.id}`,
        {
          name: source.name,
          type: source.type,
          baseUrl: source.baseUrl,
          enabled: !source.enabled
        },
        adminKey
      );
      onActivity(`${source.enabled ? "Disabled" : "Enabled"} source ${source.name}`);
      await onRefresh();
    } catch (error) {
      const message = errorMessage(error);
      setMessages((current) => ({ ...current, [source.id]: `Toggle failed: ${message}` }));
      onActivity(`Source toggle failed for ${source.name}: ${message}`);
    } finally {
      setBusySource(null);
      setBusyAction(null);
    }
  }

  async function createSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiPost(
      "/admin/sources",
      {
        name: String(form.get("name") || ""),
        type: String(form.get("type") || "official"),
        baseUrl: normalizeBaseUrl(String(form.get("baseUrl") || "")),
        enabled: form.get("enabled") === "on"
      },
      adminKey
    );
    event.currentTarget.reset();
    onActivity("Created source");
    await onRefresh();
  }

  function updateDraft(source: SourceSummary, patch: Partial<SourceDraft>) {
    setDrafts((current) => ({
      ...current,
      [source.id]: {
        ...(current[source.id] || toDraft(source)),
        ...patch
      }
    }));
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 animate-in fade-in duration-500 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Sources</h2>
          <p className="text-muted-foreground mt-2">
            Manage upstream sources and import new records into the sub-registry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="neutral">{sources.length} sources</Badge>
          <Button variant="secondary" onClick={onRefresh}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {sources.map((source) => {
          const draft = drafts[source.id] || toDraft(source);
          const editing = editingSource === source.id;
          const runs = syncRuns(source);
          const latestRun = runs[0] || source.lastSyncRun || null;
          const busy = busySource === source.id;
          const message = messages[source.id];

          return (
            <article className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col gap-4" key={source.id}>
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 pb-4 border-b border-border/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground tracking-tight">{source.name}</h3>
                    <p className="text-sm font-mono text-muted-foreground">{source.baseUrl || "manual source"}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge tone={source.enabled ? "good" : "neutral"}>{source.enabled ? "enabled" : "disabled"}</Badge>
                      <Badge tone="neutral">{source.type}</Badge>
                      {latestRun ? <Badge tone={syncTone(latestRun.status)}>{latestRun.status}</Badge> : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button variant="secondary" size="sm" disabled={busy} onClick={() => setEditingSource(editing ? null : source.id)}>
                    <Settings className="w-3.5 h-3.5 mr-1.5" /> Edit
                  </Button>
                  <Button variant="secondary" size="sm" disabled={busy} onClick={() => void toggleSource(source)}>
                    <Power className="w-3.5 h-3.5 mr-1.5" />
                    {busy && busyAction === "toggle" ? "..." : source.enabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>

              {editing ? (
                <form
                  className="bg-muted/30 p-5 rounded-xl border border-border/50 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void saveSource(source);
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Name</label>
                      <input
                        value={draft.name}
                        onChange={(event) => updateDraft(source, { name: event.currentTarget.value })}
                        required
                        className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Type</label>
                      <select
                        value={draft.type}
                        onChange={(event) => updateDraft(source, { type: event.currentTarget.value })}
                        className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                      >
                        <option value="official">Official</option>
                        <option value="subregistry">Sub-registry</option>
                        <option value="manual">Manual</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-foreground">Base URL</label>
                      <input
                        value={draft.baseUrl}
                        onChange={(event) => updateDraft(source, { baseUrl: event.currentTarget.value })}
                        placeholder="https://registry.modelcontextprotocol.io"
                        className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <input
                        checked={draft.enabled}
                        type="checkbox"
                        id={`enabled-${source.id}`}
                        onChange={(event) => updateDraft(source, { enabled: event.currentTarget.checked })}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor={`enabled-${source.id}`} className="text-sm font-medium">Enabled</label>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button disabled={busy} onClick={() => setEditingSource(null)} variant="ghost" size="sm">Cancel</Button>
                    <Button disabled={busy} type="submit" size="sm">
                      {busy && busyAction === "save" ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              ) : null}

              <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-xl border border-border/50 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Last global sync:</span>
                  <span className="font-mono">{formatDate(source.lastSyncedAt) || "Never"}</span>
                </div>
                {latestRun && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground font-semibold shrink-0">Latest job:</span>
                    <span className="text-right text-muted-foreground">{runSummary(latestRun)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground mr-2">Run Job:</span>
                {syncModes.map(({ mode, label }) => (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!source.baseUrl || !source.enabled || busy}
                    key={mode}
                    onClick={() => void syncSource(source, mode)}
                  >
                    <RefreshCw className="w-3 h-3 mr-1.5" />
                    {busy && busyAction === "sync" ? "..." : label}
                  </Button>
                ))}
              </div>

              {message ? (
                <div className={`p-3 rounded-lg text-sm border ${message.includes("failed") ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500"}`}>
                  {message}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {sources.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-2xl bg-card/30 backdrop-blur-sm">
          <ServerCog className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No Upstream Sources</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Add an upstream registry source to start importing AI capabilities.
          </p>
        </div>
      ) : null}

      <div className="mt-12 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight flex items-center gap-2">
          <ServerCog className="w-5 h-5 text-primary" /> Add Source
        </h3>
        <form className="space-y-4" onSubmit={(event) => void createSource(event)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Name</label>
              <input name="name" placeholder="official" required className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Type</label>
              <select name="type" defaultValue="official" className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/50 outline-none">
                <option value="official">Official</option>
                <option value="subregistry">Sub-registry</option>
                <option value="manual">Manual</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Base URL</label>
              <input name="baseUrl" placeholder="https://registry.modelcontextprotocol.io" className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/50 outline-none font-mono" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <input name="enabled" type="checkbox" id="new-enabled" defaultChecked className="w-4 h-4 rounded border-border" />
              <label htmlFor="new-enabled" className="text-sm font-medium">Enabled by default</label>
            </div>
            <Button type="submit">Create Source</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function toDraft(source: SourceSummary): SourceDraft {
  return {
    name: source.name,
    type: source.type,
    baseUrl: source.baseUrl || "",
    enabled: source.enabled
  };
}

function normalizeBaseUrl(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function syncRuns(source: SourceSummary) {
  if (source.recentSyncRuns?.length) return source.recentSyncRuns;
  return source.lastSyncRun ? [source.lastSyncRun] : [];
}

function syncTone(status?: string): "neutral" | "good" | "warn" | "bad" {
  const normalized = String(status || "").toLowerCase();
  if (["success", "succeeded", "completed", "complete", "ok"].includes(normalized)) return "good";
  if (["failed", "error", "errored"].includes(normalized)) return "bad";
  if (["running", "pending", "started", "in_progress"].includes(normalized)) return "warn";
  return "neutral";
}

function modeLabel(mode?: string) {
  if (mode === "latest_only") return "latest";
  if (mode === "full_etl") return "full";
  return mode || "sync";
}

function syncSummary(sync?: SyncResponse["sync"]) {
  const servers = typeof sync?.serversSeen === "number" ? sync.serversSeen : 0;
  const versions = typeof sync?.versionsSeen === "number" ? sync.versionsSeen : 0;
  const cursor = sync?.cursor ? `, cursor ${sync.cursor}` : "";
  return `${servers} servers, ${versions} versions${cursor}`;
}

function runSummary(run: SourceSyncRunSummary) {
  const finished = run.finishedAt ? `finished ${formatDate(run.finishedAt)}` : `started ${formatDate(run.startedAt)}`;
  return `${modeLabel(run.mode)}: ${run.serversSeen} servers, ${run.versionsSeen} versions, ${finished}`;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}
