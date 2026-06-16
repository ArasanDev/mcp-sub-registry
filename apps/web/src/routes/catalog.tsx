import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCatalog, fetchSearch, fetchTags } from "@/api/catalog";
import { fetchServerTools } from "@/api/servers";
import { updateCuration } from "@/api/admin";
import { useAuthStore } from "@/store/auth";
import { formatDateShort, getAuthType } from "@/lib/utils";
import { toast } from "sonner";
import type { CatalogServer } from "@/api/types";

function getCuration(s: CatalogServer) {
  return (s._meta?.["com.mcp-gateway.registry/curation"] ?? {}) as Record<string, unknown>;
}
function getVerification(s: CatalogServer) {
  const cur = getCuration(s);
  return ((cur?.meta as Record<string, unknown>)?.verification ?? {}) as Record<string, unknown>;
}
function getTags(s: CatalogServer): string[] {
  return ((getCuration(s)?.tags as string[]) ?? []);
}
function getRemoteUrl(s: CatalogServer): string {
  return (s.server.remotes?.[0]?.url as string) ?? "";
}

function ToolRow({ name, desc, schema }: { name: string; desc: string | null; schema?: unknown }) {
  const [open, setOpen] = useState(false);
  const schemaObj = schema as Record<string, unknown> | null | undefined;
  const hasSchema = schemaObj && typeof schemaObj === "object" && Object.keys(schemaObj).length > 0;
  return (
    <div className="tool-item">
      <div
        className="tool-hd"
        onClick={() => hasSchema && setOpen((o) => !o)}
        style={{ cursor: hasSchema ? "pointer" : "default" }}
      >
        <span className="tool-fn">{name}</span>
        {desc && <span className="tool-desc">{desc}</span>}
        {hasSchema && (
          <span className={`tool-chev${open ? " open" : ""}`}>
            <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        )}
      </div>
      {open && hasSchema && (
        <div className="tool-schema">
          {Object.entries(schemaObj.properties as Record<string, {type?: string; description?: string}> ?? {}).map(([k, v]) => (
            <div key={k}>
              <span className="schema-key">{k}</span>: <span className="schema-type">{v?.type ?? "any"}</span>
              {v?.description && <span style={{ color: "var(--tx3)" }}>  — "{v.description}"</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TrustTimeline({ server }: { server: CatalogServer }) {
  const ver = getVerification(server);
  const cur = getCuration(server);
  const status = (cur?.status as string) ?? "pending";
  const verAt = ver?.verifiedAt as string | undefined;
  const approvedAt = cur?.approvedAt as string | undefined;

  const steps = [
    { act: "Discovered", dt: null, note: "upstream sync" },
    { act: "Verified", dt: verAt ? formatDateShort(verAt) : null, note: ver?.notes as string ?? "HTTP 401 · auth confirmed" },
    { act: status === "approved" ? "Approved" : status.charAt(0).toUpperCase() + status.slice(1), dt: approvedAt ? formatDateShort(approvedAt) : null, note: getTags(server).map(t => `+${t}`).join(" ") },
    { act: "Re-verified", dt: verAt ? formatDateShort(verAt) : null, note: ver?.notes as string ?? "" }
  ];

  const statusColors: Record<string, string> = {
    approved: "var(--green)",
    rejected: "var(--red)",
    flagged: "var(--orange)",
    pending: "var(--yellow)"
  };
  const dotColor = statusColors[status] ?? "var(--green)";

  return (
    <div className="tl">
      <div className="tl-track" />
      <div className="tl-items">
        {steps.map((s, i) => (
          <div key={i} className="tl-step">
            <div
              className="tl-dot done"
              style={i === 2 && status !== "approved"
                ? { background: dotColor, boxShadow: `0 0 0 1.5px ${dotColor}` }
                : {}}
            />
            <div className="tl-info">
              <div className="tl-act" style={i === 2 && status !== "approved" ? { color: dotColor } : {}}>{s.act}</div>
              {s.dt && <div className="tl-dt">{s.dt}</div>}
              {s.note && <div className="tl-note">{s.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailPanel({
  server,
  onClose,
  onStatusChange
}: {
  server: CatalogServer;
  onClose: () => void;
  onStatusChange: () => void;
}) {
  const { adminKey } = useAuthStore();
  const queryClient = useQueryClient();
  const curation = getCuration(server);
  const verification = getVerification(server);
  const remoteUrl = getRemoteUrl(server);
  const authType = getAuthType(server.server as Parameters<typeof getAuthType>[0]);
  const tags = getTags(server);
  const status = (curation?.status as string) ?? "pending";
  const verAt = verification?.verifiedAt as string | undefined;
  const verNotes = verification?.notes as string | undefined;
  const notes = curation?.notes as string | undefined;

  const { data: toolsData, isLoading: toolsLoading } = useQuery({
    queryKey: ["tools", server.server.name],
    queryFn: () => fetchServerTools(server.server.name),
    staleTime: 120_000
  });
  const tools = toolsData?.tools ?? [];

  const curateMutation = useMutation({
    mutationFn: (newStatus: "approved" | "rejected" | "pending" | "hidden") =>
      updateCuration({ serverName: server.server.name, status: newStatus }, adminKey),
    onSuccess: (_, newStatus) => {
      toast.success(`Status updated to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      onStatusChange();
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const configJson = `{
  "name": "${server.server.name.split("/")[1] ?? server.server.name}",
  "type": "streamable-http",
  "url": "${remoteUrl}",
  "headers": {
    "Authorization": "Bearer \${SECRET_TOKEN}"
  }
}`;

  const statusClass = `s-${status}`;

  return (
    <div className={`detail open`}>
      <div className="det-top">
        <div className="det-name-area">
          <div className="det-sname">{server.server.name}</div>
        </div>
        <div className={`status ${statusClass}`}>
          <div className="sdot" />
          {status}
        </div>
        <button className="det-close" onClick={onClose}>
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div className="det-body">
        {/* Trust timeline */}
        <div className="det-section">
          <div className="det-sh">Trust Timeline</div>
          <TrustTimeline server={server} />
        </div>

        {/* Description */}
        {server.server.description && (
          <div className="det-section">
            <div className="det-sh">Description</div>
            <p style={{ fontSize: "13px", color: "var(--tx2)", lineHeight: "1.6", marginTop: "6px" }}>
              {server.server.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="det-section">
            <div className="det-sh">Tags</div>
            <div className="tags-cell" style={{ marginTop: "8px" }}>
              {tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        )}

        {/* Tools */}
        <div className="det-section">
          <div className="det-sh">Tools ({toolsLoading ? "…" : tools.length})</div>
          {toolsLoading ? (
            <div style={{ fontSize: "12px", color: "var(--tx3)" }}>Loading tools…</div>
          ) : tools.length === 0 ? (
            <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
              No tools indexed yet. Tools are populated via the admin API.
            </div>
          ) : (
            <>
              {tools.slice(0, 4).map((t) => (
                <ToolRow key={t.name} name={t.name} desc={t.description} schema={t.inputSchema} />
              ))}
              {tools.length > 4 && (
                <div className="tools-more">+ {tools.length - 4} more tools</div>
              )}
            </>
          )}
        </div>

        {/* Security */}
        <div className="det-section">
          <div className="det-sh">Security</div>
          <div className={`sec-item${verAt ? " sec-ok" : " sec-warn"}`}>
            <div className="sec-ic">
              {verAt
                ? <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
            </div>
            <div className="sec-txt">
              {verAt
                ? <><strong>GET → 401</strong> · unauthenticated request blocked ({formatDateShort(verAt)})</>
                : "Endpoint not yet verified"
              }
            </div>
          </div>
          <div className={`sec-item${authType !== "none" && authType !== "—" ? " sec-ok" : " sec-warn"}`}>
            <div className="sec-ic">
              {authType !== "none" && authType !== "—"
                ? <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
            </div>
            <div className="sec-txt">
              {authType !== "none" && authType !== "—"
                ? <><strong>Auth: {authType}</strong> · required for all requests</>
                : "No auth detected"
              }
            </div>
          </div>
          {verNotes && (
            <div className="sec-item sec-ok">
              <div className="sec-ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
              <div className="sec-txt" style={{ color: "var(--tx3)" }}>{verNotes}</div>
            </div>
          )}
        </div>

        {/* Curation notes */}
        {notes && (
          <div className="det-section">
            <div className="det-sh">Curation notes</div>
            <p style={{ fontSize: "12px", color: "var(--tx2)", lineHeight: "1.6", marginTop: "6px", borderLeft: "2px solid var(--border2)", paddingLeft: "10px" }}>
              {notes}
            </p>
          </div>
        )}

        {/* Gateway config */}
        <div className="det-section">
          <div className="det-sh">Gateway Config</div>
          <div className="cfg-block">
            <span className="cfg-brace">{"{"}</span>{"\n"}
            {"  "}<span className="cfg-key">"name"</span>: <span className="cfg-str">"{server.server.name.split("/")[1] ?? server.server.name}"</span>,{"\n"}
            {"  "}<span className="cfg-key">"type"</span>: <span className="cfg-str">"streamable-http"</span>,{"\n"}
            {"  "}<span className="cfg-key">"url"</span>: <span className="cfg-str">"{remoteUrl}"</span>,{"\n"}
            {"  "}<span className="cfg-key">"headers"</span>: {"{"}<span className="cfg-key">"Authorization"</span>: <span className="cfg-str">"Bearer ${"{"}SECRET_TOKEN{"}"}"</span>{"}"}{"\n"}
            <span className="cfg-brace">{"}"}</span>
          </div>
          <div className="cfg-actions">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => { navigator.clipboard.writeText(configJson); toast.success("Config copied"); }}
            >
              Copy JSON
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                window.open(remoteUrl, "_blank");
              }}
            >
              Open URL
            </button>
          </div>
        </div>
      </div>

      {adminKey && (
        <div className="det-foot">
          {status !== "rejected" && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: "var(--red)" }}
              onClick={() => curateMutation.mutate("rejected")}
              disabled={curateMutation.isPending}
            >
              Reject
            </button>
          )}
          {status !== "pending" && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => curateMutation.mutate("pending")}
              disabled={curateMutation.isPending}
            >
              Demote to pending
            </button>
          )}
          <div style={{ flex: 1 }} />
          {status !== "approved" && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => curateMutation.mutate("approved")}
              disabled={curateMutation.isPending}
            >
              Approve ✓
            </button>
          )}
          {status === "approved" && (
            <button className="btn btn-outline btn-sm" disabled>
              ✓ Approved
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const TABS = ["all", "approved", "pending", "rejected", "hidden"] as const;
type TabFilter = (typeof TABS)[number];

const TAB_DOTS: Record<string, string> = {
  approved: "var(--green)",
  pending: "var(--yellow)",
  rejected: "var(--red)",
  hidden: "var(--tx3)"
};

export function CatalogPage({ preselect }: { preselect?: string } = {}) {
  const [tab, setTab] = useState<TabFilter>("all");
  const [searchQ, setSearchQ] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<CatalogServer | null>(null);

  const { data: catalog, isLoading, refetch } = useQuery({
    queryKey: ["catalog", selectedTag],
    queryFn: () => fetchCatalog({ tag: selectedTag ?? undefined }),
    staleTime: 30_000
  });

  const { data: searchData } = useQuery({
    queryKey: ["search", searchQ],
    queryFn: () => fetchSearch(searchQ),
    enabled: searchQ.length > 1,
    staleTime: 5000
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: 300_000
  });

  // Auto-select from URL param
  useEffect(() => {
    if (preselect && catalog?.servers) {
      const match = catalog.servers.find((s) => s.server.name === preselect);
      if (match) setSelected(match);
    }
  }, [preselect, catalog?.servers]);

  const servers: CatalogServer[] = searchQ.length > 1
    ? (searchData?.servers as unknown as CatalogServer[]) ?? []
    : catalog?.servers ?? [];

  const filtered = servers.filter((s) => {
    if (tab === "all") return true;
    return getCuration(s)?.status === tab;
  });

  const counts = {
    all: servers.length,
    approved: servers.filter((s) => getCuration(s)?.status === "approved").length,
    pending: servers.filter((s) => getCuration(s)?.status === "pending").length,
    rejected: servers.filter((s) => getCuration(s)?.status === "rejected").length,
    hidden: servers.filter((s) => getCuration(s)?.status === "hidden").length
  };

  const handleClose = useCallback(() => setSelected(null), []);
  const handleStatusChange = useCallback(() => { refetch(); setSelected(null); }, [refetch]);

  return (
    <>
      {/* Backdrop */}
      {selected && (
        <div className="backdrop" onClick={handleClose} />
      )}

      <div className="page" style={selected ? { marginRight: "460px" } : {}}>
        {/* Header */}
        <div className="ph">
          <div>
            <div className="ph-title">Catalog</div>
            <div className="ph-sub">Your curated, verified server set</div>
          </div>
          <div className="ph-right">
            <button className="btn btn-outline btn-sm">
              <svg viewBox="0 0 24 24"><polyline points="21 15 21 19 3 19 3 15"/><line x1="12" y1="3" x2="12" y2="15"/><polyline points="8 7 12 3 16 7"/></svg>
              Export
            </button>
            <button className="btn btn-primary btn-sm">
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add server
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="search-wrap" style={{ marginBottom: "12px" }}>
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder={`Search ${servers.length} servers…`}
          />
          {searchQ && (
            <button
              onClick={() => setSearchQ("")}
              style={{ background: "none", border: "none", color: "var(--tx3)", cursor: "pointer", fontSize: "13px" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Tag filters */}
        {tagsData && tagsData.tags.length > 0 && (
          <div className="filter-row">
            <button
              className={`fchip${!selectedTag ? " on" : ""}`}
              onClick={() => setSelectedTag(null)}
            >
              All
            </button>
            {tagsData.tags.slice(0, 12).map((t) => (
              <button
                key={t.slug}
                className={`fchip${selectedTag === t.slug ? " on" : ""}`}
                onClick={() => setSelectedTag(selectedTag === t.slug ? null : t.slug)}
              >
                {t.slug}
              </button>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="tab-bar">
          {TABS.map((t) => (
            <button
              key={t}
              className={`tab${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t !== "all" && (
                <span className="sdot" style={{ background: TAB_DOTS[t], width: "7px", height: "7px", borderRadius: "50%", display: "inline-block" }} />
              )}
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span className="tab-cnt">{counts[t]}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "32px 0", fontSize: "13px", color: "var(--tx3)" }}>Loading catalog…</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: "28px" }}></th>
                <th>Server</th>
                <th>Auth</th>
                <th>Verified</th>
                <th>Tools</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "48px 0", color: "var(--tx3)", fontSize: "13px" }}>
                    No servers in this category
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const cur = getCuration(s);
                  const ver = getVerification(s);
                  const tags = getTags(s);
                  const isSelected = selected?.server.name === s.server.name;
                  const status = (cur?.status as string) ?? "pending";
                  const authType = getAuthType(s.server as Parameters<typeof getAuthType>[0]);
                  const verDate = ver?.verifiedAt as string | undefined;

                  return (
                    <tr
                      key={s.server.name}
                      onClick={() => setSelected(isSelected ? null : s)}
                      className={isSelected ? "selected" : ""}
                    >
                      <td>
                        <div className={`status s-${status}`}>
                          <div className="sdot" />
                        </div>
                      </td>
                      <td>
                        <div className="sname">{s.server.name}</div>
                        {s.server.title && <div className="stitle">{s.server.title}</div>}
                      </td>
                      <td>
                        <span className="auth-tag">{authType}</span>
                      </td>
                      <td>
                        <div className="ver-date">
                          {verDate ? (
                            <><span className="ver-check">✓</span> {formatDateShort(verDate)}</>
                          ) : (
                            <span style={{ color: "var(--tx3)" }}>— not checked</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="tools-cnt">—</span>
                      </td>
                      <td>
                        <div className="tags-cell">
                          {tags.slice(0, 3).map((t) => (
                            <span key={t} className="tag">{t}</span>
                          ))}
                          {tags.length > 3 && (
                            <span style={{ fontSize: "11px", color: "var(--tx3)" }}>+{tags.length - 3}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <DetailPanel
          server={selected}
          onClose={handleClose}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
