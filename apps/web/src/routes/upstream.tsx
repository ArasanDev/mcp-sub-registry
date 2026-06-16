import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCatalog, fetchSearch } from "@/api/catalog";
import { Link } from "@tanstack/react-router";
import type { CatalogServer } from "@/api/types";

function getCuration(s: CatalogServer) {
  return (s._meta?.["com.mcp-gateway.registry/curation"] ?? {}) as Record<string, unknown>;
}

export function UpstreamPage() {
  const [q, setQ] = useState("stripe");
  const [remoteOnly, setRemoteOnly] = useState(true);
  const [hasTools] = useState(false);

  const { data: catalog } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => fetchCatalog(),
    staleTime: 60_000
  });

  const { data: searchData, isLoading } = useQuery({
    queryKey: ["search-upstream", q],
    queryFn: () => fetchSearch(q),
    enabled: q.length > 1,
    staleTime: 5000
  });

  const catalogServers = catalog?.servers ?? [];
  const catalogNames = new Set(catalogServers.map((s) => s.server.name));

  const results = (searchData?.servers as unknown as CatalogServer[]) ?? [];

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">Upstream Browser</div>
          <div className="ph-sub">Official MCP Registry · 18,410 servers</div>
        </div>
        <div className="ph-right">
          <button className="btn btn-outline btn-sm">
            <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Sync now
          </button>
        </div>
      </div>

      <div className="search-wrap">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          placeholder="Search 18,410 upstream servers…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="filter-row">
        <button
          className={`fchip${remoteOnly ? " on" : ""}`}
          onClick={() => setRemoteOnly((v) => !v)}
        >
          Remote only
        </button>
        <button className={`fchip${hasTools ? " on" : ""}`}>Has tools</button>
        <button className="fchip">Official vendor</button>
        <button className="fchip">New this week</button>
      </div>

      {q.length > 1 && (
        <div style={{ fontSize: "12px", color: "var(--tx3)", marginBottom: "14px" }}>
          {isLoading ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""} for "${q}"`}
        </div>
      )}

      {/* Results from the curated catalog that match the search */}
      {results.map((s) => {
        const inCatalog = catalogNames.has(s.server.name);
        const cur = inCatalog ? getCuration(catalogServers.find(c => c.server.name === s.server.name)!) : null;
        const status = (cur?.status as string) ?? "approved";
        const remoteUrl = (s.server.remotes?.[0]?.url as string) ?? "";
        const tags = ((getCuration(s)?.tags as string[]) ?? []);

        return (
          <div key={s.server.name} className="up-item">
            <div className="up-info">
              <div className="up-name">
                {s.server.name}
                {status === "approved" && <span className="official-chip">official vendor</span>}
              </div>
              <div className="up-meta">
                {s.server.description ?? "MCP server"}
                {remoteUrl ? ` · Remote · streamable-HTTP` : ""}
              </div>
              <div className="up-chips">
                {inCatalog ? (
                  <span className="in-cat">✓ In your catalog</span>
                ) : (
                  <span className="not-cat">Not in your catalog</span>
                )}
                {tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            {inCatalog ? (
              <Link to="/catalog/$name" params={{ name: encodeURIComponent(s.server.name) }}>
                <button className="btn btn-ghost btn-sm">View yours →</button>
              </Link>
            ) : (
              <button className="btn btn-outline btn-sm">+ Add to review</button>
            )}
          </div>
        );
      })}

      {/* Static example entries when no search */}
      {q.length <= 1 && (
        <>
          <div className="up-item">
            <div className="up-info">
              <div className="up-name">
                stripe/agent-toolkit
                <span className="official-chip">official vendor</span>
              </div>
              <div className="up-meta">Stripe's official MCP server · Remote · streamable-HTTP · OAuth · 12 tools</div>
              <div className="up-chips">
                <span className="in-cat">✓ In your catalog</span>
                <span className="tag">com.stripe/mcp</span>
              </div>
            </div>
            <Link to="/catalog/$name" params={{ name: "com.stripe%2Fmcp" }}>
              <button className="btn btn-ghost btn-sm">View yours →</button>
            </Link>
          </div>

          <div className="up-item">
            <div className="up-info">
              <div className="up-name">github/github-mcp-server</div>
              <div className="up-meta">GitHub's official MCP server · Remote · streamable-HTTP · OAuth · 26 tools</div>
              <div className="up-chips">
                <span className="in-cat">✓ In your catalog</span>
                <span className="tag">com.github/mcp</span>
              </div>
            </div>
            <Link to="/catalog/$name" params={{ name: "com.github%2Fmcp" }}>
              <button className="btn btn-ghost btn-sm">View yours →</button>
            </Link>
          </div>

          <div className="up-item">
            <div className="up-info">
              <div className="up-name">
                supabase/mcp-server-supabase
                <span className="official-chip">official vendor</span>
              </div>
              <div className="up-meta">Supabase MCP · Remote · streamable-HTTP · OAuth · 11 tools</div>
              <div className="up-chips">
                <span className="in-cat">✓ In your catalog</span>
                <span className="tag">com.supabase/mcp</span>
              </div>
            </div>
            <Link to="/catalog/$name" params={{ name: "com.supabase%2Fmcp" }}>
              <button className="btn btn-ghost btn-sm">View yours →</button>
            </Link>
          </div>

          <div className="up-item">
            <div className="up-info">
              <div className="up-name">stripe-community/mcp-server</div>
              <div className="up-meta">Community Stripe MCP (unofficial) · Package (npx) · stdio · API key · 8 tools</div>
              <div className="up-chips">
                <span className="not-cat">Not in your catalog</span>
                <span className="warn-chip">⚠ stdio — needs Connector Runtime</span>
              </div>
            </div>
            <button className="btn btn-outline btn-sm">+ Add to review</button>
          </div>
        </>
      )}

      {results.length === 0 && q.length > 1 && !isLoading && (
        <div style={{ textAlign: "center", padding: "32px 0", fontSize: "13px", color: "var(--tx3)" }}>
          No results found in your catalog. The upstream search covers the full registry.
        </div>
      )}
    </div>
  );
}
