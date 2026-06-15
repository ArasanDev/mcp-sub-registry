import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { apiGet, apiPost, apiPut } from "../../api/client";
import type {
  ServerResponse,
  ServerToolsResponse,
  ServerVersionPayloadsResponse,
  ServerVersionsResponse,
  TagSummary,
  ToolSummary
} from "../../api/types";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { JsonBlock } from "../../components/JsonBlock";
import { formatDate } from "../../lib/format";
import {
  curationMeta,
  curationTone,
  readinessMeta,
  readinessTone,
  serverMeta,
  versionMeta
} from "../../lib/meta";
import type { CurationAction } from "../types";
import { cn } from "../../lib/utils";
import { Check, EyeOff, Trash2, Star, Tag, Database, Activity, Code, Settings } from "lucide-react";

export function ServerDetailPanel({
  selected,
  tags,
  adminKey,
  onCurate,
  onImport,
  onTagged
}: {
  selected: ServerResponse | null;
  onCurate: (action: CurationAction) => void;
  tags: TagSummary[];
  adminKey: string;
  onImport: (row: ServerResponse) => Promise<void> | void;
  onTagged: () => void;
}) {
  const [versions, setVersions] = useState<ServerVersionsResponse["versions"]>([]);
  const [tools, setTools] = useState<ToolSummary[]>([]);
  const [payloads, setPayloads] = useState<ServerVersionPayloadsResponse | null>(null);
  const [payloadMessage, setPayloadMessage] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const [toolMessage, setToolMessage] = useState("");

  useEffect(() => {
    let active = true;

    if (!selected) {
      setVersions([]);
      setTools([]);
      setPayloads(null);
      setPayloadMessage("");
      return () => {
        active = false;
      };
    }

    const name = encodeURIComponent(selected.server.name);
    const version = encodeURIComponent(selected.server.version);

    setVersions([]);
    setTools([]);
    setPayloads(null);
    setPayloadMessage("");

    void apiGet<ServerVersionsResponse>(`/v0.1/servers/${name}/versions`)
      .then((result) => {
        if (!active) return;
        setVersions(result.versions);
      })
      .catch(() => {
        if (!active) return;
        setVersions([]);
      });

    void apiGet<ServerToolsResponse>(`/v0.1/servers/${name}/tools?version=${version}`)
      .then((result) => {
        if (!active) return;
        setTools(result.tools);
      })
      .catch(() => {
        if (!active) return;
        setTools([]);
      });

    if (!adminKey) {
      setPayloadMessage("Set an admin key to inspect stored payloads.");
    } else {
      void apiGet<ServerVersionPayloadsResponse>(
        `/admin/servers/${name}/versions/${version}/payloads`,
        adminKey
      )
        .then((result) => {
          if (!active) return;
          setPayloads(result);
        })
        .catch((error) => {
          if (!active) return;
          setPayloads(null);
          setPayloadMessage(error instanceof Error ? error.message : "Payload inspection unavailable");
        });
    }

    return () => {
      active = false;
    };
  }, [selected, adminKey]);

  if (!selected) {
    return (
      <aside className="w-96 border-l border-border/50 bg-card/50 backdrop-blur-xl flex flex-col shrink-0 h-full p-6 text-center justify-center">
        <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center text-muted-foreground">
          <Database className="w-8 h-8 opacity-50" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Inspector</h2>
        <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
          Select a capability from the registry to inspect its metadata and curation state.
        </p>
      </aside>
    );
  }

  const curation = curationMeta(selected);
  const readiness = readinessMeta(selected);
  const server = serverMeta(selected);
  const version = versionMeta(selected);

  function saveNotes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onCurate({
      notes: String(form.get("notes") || ""),
      qualityLabel: String(form.get("qualityLabel") || "") || null,
      visibility: String(form.get("visibility") || curation.visibility || "private") as
        | "public"
        | "private"
        | "unlisted"
    });
  }

  async function assignTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const tagSlug = String(form.get("tagSlug") || "");
    if (!tagSlug) return;

    await apiPost(
      "/admin/server-tags",
      {
        serverName: selected.server.name,
        tagSlug
      },
      adminKey
    );
    onTagged();
  }

  async function importServer() {
    setImportMessage("");
    setImporting(true);

    try {
      await onImport(selected);
      setImportMessage(`Imported ${selected.server.name}`);
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  async function saveTool(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    if (!name) return;

    try {
      const inputSchema = parseJsonField(String(form.get("inputSchema") || ""));
      const outputSchema = parseJsonField(String(form.get("outputSchema") || ""));
      await apiPut(
        `/admin/servers/${encodeURIComponent(selected.server.name)}/versions/${encodeURIComponent(
          selected.server.version
        )}/tools/${encodeURIComponent(name)}`,
        {
          description: String(form.get("description") || "") || null,
          inputSchema,
          outputSchema
        },
        adminKey
      );
      setToolMessage(`Saved tool ${name}`);
      event.currentTarget.reset();
      await loadTools(selected);
    } catch (error) {
      setToolMessage(error instanceof Error ? error.message : "Tool save failed");
    }
  }

  async function loadTools(row: ServerResponse) {
    const name = encodeURIComponent(row.server.name);
    const version = encodeURIComponent(row.server.version);
    await apiGet<ServerToolsResponse>(`/v0.1/servers/${name}/tools?version=${version}`)
      .then((result) => setTools(result.tools))
      .catch(() => setTools([]));
  }

  return (
    <aside className="w-96 border-l border-border/50 bg-card flex flex-col shrink-0 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border/50 sticky top-0 bg-card/80 backdrop-blur-xl z-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge tone={curationTone(curation.status)}>{curation.status || "pending"}</Badge>
          <Badge tone={readinessTone(readiness.status)}>{readiness.status || "unknown"}</Badge>
        </div>
        <h2 className="text-xl font-bold text-foreground leading-tight tracking-tight break-words">
          {selected.server.name}
        </h2>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
          {selected.server.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Version {selected.server.version}
          </span>
          <span className="rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Source {server.sourceNames?.[0] || "manual"}
          </span>
          <span className="rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {version.status || "active"}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Primary Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Import</h4>
          <Button
            className="w-full"
            onClick={() => void importServer()}
            disabled={importing}
          >
            <Database className="w-4 h-4 mr-2" />
            {importing ? "Importing..." : "Import to sub-registry"}
          </Button>
          {importMessage && <p className="text-xs text-muted-foreground">{importMessage}</p>}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Curation</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full" onClick={() => onCurate({ status: "approved", visibility: "public" })}>
              <Check className="w-4 h-4 mr-2" /> Approve
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => onCurate({ status: "hidden", visibility: "private" })}>
              <EyeOff className="w-4 h-4 mr-2" /> Hide
            </Button>
          </div>
          <details className="rounded-2xl border border-border/50 bg-muted/20 p-4">
            <summary className="text-sm font-semibold text-foreground cursor-pointer list-none flex items-center gap-2">
              <Settings className="w-4 h-4" />
              More actions
            </summary>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" className="w-full" onClick={() => onCurate({ featured: !curation.featured })}>
                <Star className={cn("w-4 h-4 mr-2", curation.featured ? "fill-amber-500 text-amber-500" : "")} />
                Feature
              </Button>
              <Button
                variant="secondary"
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                onClick={() => onCurate({ status: "rejected", visibility: "private" })}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Reject
              </Button>
            </div>
          </details>
        </div>

        <details className="rounded-2xl border border-border/50 bg-muted/20 p-4">
          <summary className="text-sm font-semibold text-foreground cursor-pointer list-none flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Curation details
          </summary>
          <div className="mt-4 space-y-5">
            <form className="space-y-4 bg-background/70 p-4 rounded-xl border border-border/50" onSubmit={saveNotes}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Visibility</label>
                <select
                  name="visibility"
                  defaultValue={curation.visibility || "private"}
                  className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2"
                >
                  <option value="public">Public catalog</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Quality label</label>
                <input
                  name="qualityLabel"
                  defaultValue={curation.qualityLabel || ""}
                  placeholder="trusted, needs-review"
                  className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={curation.notes || ""}
                  className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 resize-none"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" className="w-full">
                Save metadata
              </Button>
            </form>

            <form className="flex gap-2" onSubmit={assignTag}>
              <select
                name="tagSlug"
                defaultValue=""
                className="flex-1 bg-background border border-border rounded-lg text-sm px-3 py-2"
              >
                <option value="">Assign tag...</option>
                {tags.map((tag) => (
                  <option key={tag.slug} value={tag.slug}>
                    {tag.slug}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="secondary">
                Add
              </Button>
            </form>
          </div>
        </details>

        <details className="rounded-2xl border border-border/50 bg-muted/20 p-4">
          <summary className="text-sm font-semibold text-foreground cursor-pointer list-none flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Advanced metadata
          </summary>
          <div className="mt-5 space-y-8">
            <Section title="Readiness">
              <JsonBlock value={readiness} />
            </Section>

            <Section title="Versions">
              <div className="space-y-2">
                {versions.map((item) => (
                  <div key={item.version} className="flex justify-between items-center text-sm p-2 rounded-lg bg-muted/30 border border-border/50">
                    <strong className="font-mono">{item.version}</strong>
                    <span className="text-muted-foreground text-xs">{formatDate(item.updatedAt)}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Packages">
              <PackageList packages={selected.server.packages || []} />
            </Section>

            <Section title="Remotes">
              <RemoteList remotes={selected.server.remotes || []} />
            </Section>

            <Section title="Tools">
              <ToolList tools={tools} />

              <details className="mt-4 group">
                <summary className="text-sm font-semibold text-primary cursor-pointer hover:underline list-none flex items-center gap-2">
                  <Code className="w-4 h-4" /> Add manual tool
                </summary>
                <form className="space-y-3 mt-3 bg-muted/30 p-4 rounded-xl border border-border/50" onSubmit={saveTool}>
                  <input name="name" placeholder="Tool name (e.g. read_file)" required className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2" />
                  <textarea name="description" rows={2} placeholder="Description" className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 resize-none" />
                  <textarea name="inputSchema" rows={3} placeholder='Input schema JSON' className="w-full font-mono bg-background border border-border rounded-lg text-xs px-3 py-2 resize-none" />
                  <Button type="submit" variant="secondary" size="sm" className="w-full">Save manual tool</Button>
                  {toolMessage && <p className="text-xs text-amber-500 text-center">{toolMessage}</p>}
                </form>
              </details>
            </Section>

            <Section title="Developer JSON">
              <details className="group">
                <summary className="text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground list-none">
                  View stored raw and normalized payloads
                </summary>
                <div className="mt-3 space-y-4">
                  {payloadMessage && <p className="text-xs text-muted-foreground">{payloadMessage}</p>}
                  {payloads ? (
                    <>
                      <div>
                        <h5 className="text-xs font-semibold mb-2">Stored raw payload</h5>
                        <JsonBlock value={payloads.rawJson} />
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold mb-2">Stored normalized payload</h5>
                        <JsonBlock value={payloads.normalizedJson} />
                      </div>
                    </>
                  ) : adminKey ? (
                    <p className="text-xs text-muted-foreground">
                      Loading stored payloads for this version.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Set an admin key to inspect stored payloads for this version.
                    </p>
                  )}
                  <div>
                    <h5 className="text-xs font-semibold mb-2">Curation metadata</h5>
                    <JsonBlock value={curation} />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold mb-2">Registry context</h5>
                    <JsonBlock value={{ server, version }} />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold mb-2">Full local record</h5>
                    <JsonBlock value={selected} />
                  </div>
                </div>
              </details>
            </Section>
          </div>
        </details>
      </div>
    </aside>
  );
}

function parseJsonField(value: string) {
  const trimmed = value.trim();
  return trimmed ? JSON.parse(trimmed) : undefined;
}

function FactBox({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-muted/30 border border-border/50 rounded-xl p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <div className="w-3.5 h-3.5 opacity-70 [&>svg]:w-full [&>svg]:h-full">{icon}</div>
        <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground truncate">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border/50 pb-2">{title}</h4>
      {children}
    </div>
  );
}

function PackageList({ packages }: { packages: Array<Record<string, unknown>> }) {
  if (!packages.length) return <p className="text-sm text-muted-foreground italic">No package metadata.</p>;

  return (
    <div className="space-y-3">
      {packages.map((item, index) => (
        <article key={index} className="bg-muted/30 border border-border/50 rounded-xl p-3 text-sm">
          <div className="font-semibold text-foreground break-all">{String(item.identifier || "package")}</div>
          <div className="text-xs text-muted-foreground mt-1 flex gap-2">
            <span className="bg-background px-1.5 py-0.5 rounded border border-border">{String(item.registryType || "registry")}</span>
            {item.version && <span>v{String(item.version)}</span>}
          </div>
          {item.environmentVariables && (
            <div className="mt-3">
              <span className="text-xs font-semibold text-muted-foreground mb-1 block">Environment</span>
              <JsonBlock value={item.environmentVariables} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function RemoteList({ remotes }: { remotes: Array<Record<string, unknown>> }) {
  if (!remotes.length) return <p className="text-sm text-muted-foreground italic">No remote metadata.</p>;

  return (
    <div className="space-y-3">
      {remotes.map((item, index) => (
        <article key={index} className="bg-muted/30 border border-border/50 rounded-xl p-3 text-sm">
          <div className="font-semibold text-foreground capitalize mb-1">{String(item.type || "remote")}</div>
          <div className="text-xs font-mono text-muted-foreground break-all bg-background p-1.5 rounded border border-border">
            {String(item.url || "")}
          </div>
        </article>
      ))}
    </div>
  );
}

function ToolList({ tools }: { tools: ToolSummary[] }) {
  if (!tools.length) return <p className="text-sm text-muted-foreground italic">No tool metadata extracted.</p>;

  return (
    <div className="space-y-3">
      {tools.map((tool) => (
        <article key={tool.name} className="bg-muted/30 border border-border/50 rounded-xl p-3 text-sm">
          <div className="flex justify-between items-start gap-2 mb-1">
            <strong className="font-mono text-primary break-all">{tool.name}</strong>
            <Badge tone={tool.source === "manual" ? "private" : "neutral"} className="shrink-0">{tool.source}</Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{tool.description || "No description"}</p>
        </article>
      ))}
    </div>
  );
}
