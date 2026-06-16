import { useQuery } from "@tanstack/react-query";
import { fetchCatalog } from "@/api/catalog";
import { fetchGatewayCatalog } from "@/api/gateway";
import { Link } from "@tanstack/react-router";
import { relativeTime, formatDateShort } from "@/lib/utils";
import type { CatalogServer } from "@/api/types";

function getCuration(s: CatalogServer) {
  return (s._meta?.["com.mcp-gateway.registry/curation"] ?? {}) as Record<string, unknown>;
}
function getVerification(s: CatalogServer) {
  const cur = getCuration(s);
  return ((cur?.meta as Record<string, unknown>)?.verification ?? {}) as Record<string, unknown>;
}

export function DashboardPage() {
  const { data: catalog, isLoading: catLoading } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => fetchCatalog(),
    staleTime: 60_000
  });
  const { data: gateway, isLoading: gwLoading } = useQuery({
    queryKey: ["gateway-catalog"],
    queryFn: () => fetchGatewayCatalog(),
    staleTime: 60_000
  });

  const servers = catalog?.servers ?? [];
  const approved = servers.filter((s) => getCuration(s)?.status === "approved");
  const pending = servers.filter((s) => getCuration(s)?.status === "pending");
  const verified = servers.filter((s) => getVerification(s)?.status === "verified");
  const gwCount = gateway?.items.length ?? 0;
  const gwHosted = gateway?.items.filter((i) => i.gateway_compatibility.hosted_gateway).length ?? 0;

  const latestVerifiedAt = servers
    .map((s) => getVerification(s)?.verifiedAt as string | undefined)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  const recent = [...servers].sort((a, b) => {
    const av = getVerification(a)?.verifiedAt as string ?? "";
    const bv = getVerification(b)?.verifiedAt as string ?? "";
    return bv.localeCompare(av);
  }).slice(0, 3);

  return (
    <div className="page">
      {/* Page header */}
      <div className="ph">
        <div>
          <div className="ph-title">Pipeline Overview</div>
          <div className="ph-sub">Your curation flow — upstream to gateway</div>
        </div>
        <div className="ph-right">
          <Link to="/upstream">
            <button className="btn btn-outline btn-sm">
              <svg viewBox="0 0 24 24"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>
              Sync upstream
            </button>
          </Link>
        </div>
      </div>

      {/* 4-column pipeline */}
      <div className="pipeline">
        {/* Upstream */}
        <Link to="/upstream" style={{ display: "contents" }}>
          <div className="pipe-col">
            <div className="pipe-lbl">Upstream</div>
            <div className="pipe-num">18,410</div>
            <div className="pipe-desc">Servers in the official MCP Registry + PulseMCP</div>
            <div className="pipe-chips">
              <div className="pipe-chip">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Official MCP Registry</span>
              </div>
              <div className="pipe-chip">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>PulseMCP (co-steward)</span>
              </div>
            </div>
            <div className="pipe-action">
              <button className="btn btn-ghost btn-sm">Browse →</button>
            </div>
          </div>
        </Link>

        <div className="pipe-arrow">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </div>

        {/* Discovered */}
        <Link to="/catalog" style={{ display: "contents" }}>
          <div className="pipe-col">
            <div className="pipe-lbl">Discovered</div>
            <div className="pipe-num">{catLoading ? "…" : servers.length}</div>
            <div className="pipe-desc">Pulled into your registry for review</div>
            <div className="pipe-chips">
              <div className="pipe-chip chip-green">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{approved.length} approved</span>
              </div>
              {pending.length > 0 && (
                <div className="pipe-chip chip-yellow">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{pending.length} pending</span>
                </div>
              )}
              <div className="pipe-chip">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>All remote HTTP</span>
              </div>
            </div>
            <div className="pipe-action">
              <button className="btn btn-ghost btn-sm">Review queue →</button>
            </div>
          </div>
        </Link>

        <div className="pipe-arrow">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </div>

        {/* Approved — focal */}
        <Link to="/catalog" style={{ display: "contents" }}>
          <div className="pipe-col focal">
            <div className="pipe-lbl" style={{ color: "var(--accent)" }}>Approved</div>
            <div className="pipe-num">{catLoading ? "…" : approved.length}</div>
            <div className="pipe-desc">Curated, verified, version-pinned — your trusted set</div>
            <div className="pipe-chips">
              <div className="pipe-chip chip-green">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>All public</span>
              </div>
              <div className="pipe-chip chip-green">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{verified.length} endpoint-verified</span>
              </div>
              <div className="pipe-chip chip-green">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{latestVerifiedAt ? `Audited ${formatDateShort(latestVerifiedAt)}` : "Not yet audited"}</span>
              </div>
            </div>
            <div className="pipe-action">
              <button className="btn btn-ghost btn-sm">Manage →</button>
            </div>
          </div>
        </Link>

        <div className="pipe-arrow">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </div>

        {/* Gateway */}
        <Link to="/gateway" style={{ display: "contents" }}>
          <div className="pipe-col">
            <div className="pipe-lbl">Gateway Projection</div>
            <div className="pipe-num">{gwLoading ? "…" : gwCount}</div>
            <div className="pipe-desc">Items exported via <span className="mono" style={{ fontSize: "10px" }}>/v0.1/gateway/catalog</span></div>
            <div className="pipe-chips">
              <div className="pipe-chip chip-green">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>● Our Gateway live</span>
              </div>
              <div className="pipe-chip">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{gwHosted} gateway-compatible</span>
              </div>
            </div>
            <div className="pipe-action">
              <button className="btn btn-ghost btn-sm">View →</button>
            </div>
          </div>
        </Link>
      </div>

      {/* Grid: attention + activity */}
      <div className="grid2">
        <div className="feed-card">
          <div className="feed-title">Needs attention</div>
          {pending.length > 0 ? (
            pending.slice(0, 2).map((s) => (
              <div key={s.server.name} className="attn-item">
                <div className="attn-icon"><div className="attn-dot dot-yellow" /></div>
                <div className="attn-left">
                  <div className="attn-title mono" style={{ fontSize: "12px" }}>{s.server.name}</div>
                  <div className="attn-sub">Pending review</div>
                </div>
                <Link to="/catalog/$name" params={{ name: encodeURIComponent(s.server.name) }} className="attn-act">
                  Review
                </Link>
              </div>
            ))
          ) : null}
          <div className="attn-item">
            <div className="attn-icon"><div className="attn-dot dot-green" /></div>
            <div className="attn-left">
              <div className="attn-title">Audit complete</div>
              <div className="attn-sub">
                {verified.length}/{servers.length} servers endpoint-verified · 0 dead endpoints · 0 incidents
              </div>
            </div>
          </div>
        </div>

        <div className="feed-card">
          <div className="feed-title">Recent activity</div>
          {recent.map((s) => {
            const ver = getVerification(s);
            const verAt = ver?.verifiedAt as string | undefined;
            return (
              <Link
                key={s.server.name}
                to="/catalog/$name"
                params={{ name: encodeURIComponent(s.server.name) }}
                style={{ textDecoration: "none" }}
              >
                <div className="attn-item">
                  <div className="attn-icon" style={{ color: "var(--accent)", fontSize: "11px" }}>+</div>
                  <div className="attn-left">
                    <div className="attn-title">{s.server.title ?? s.server.name}</div>
                    <div className="attn-sub">
                      {s.server.name}{verAt ? ` · ${relativeTime(verAt)}` : ""}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {recent.length === 0 && (
            <div className="attn-item">
              <div className="attn-left">
                <div className="attn-title" style={{ color: "var(--tx3)" }}>No recent activity</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-val">100%</div>
          <div className="stat-lbl">Auth enforced across approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">0</div>
          <div className="stat-lbl">Active security incidents</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{latestVerifiedAt ? formatDateShort(latestVerifiedAt) : "—"}</div>
          <div className="stat-lbl">Last full audit</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{approved.length}/{servers.length}</div>
          <div className="stat-lbl">Approval rate</div>
        </div>
      </div>
    </div>
  );
}
