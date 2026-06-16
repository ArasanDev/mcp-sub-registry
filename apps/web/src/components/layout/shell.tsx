import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCatalog, fetchSearch } from "@/api/catalog";

function useCurrentPage() {
  const state = useRouterState();
  const path = state.location.pathname;
  if (path === "/") return "Pipeline";
  if (path.startsWith("/catalog")) return "Catalog";
  if (path.startsWith("/upstream")) return "Upstream";
  if (path.startsWith("/gateway")) return "Gateway";
  if (path.startsWith("/settings")) return "Settings";
  return "";
}

const NAV_ITEMS = [
  {
    to: "/",
    label: "Pipeline",
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  {
    to: "/catalog",
    label: "Catalog",
    badge: "catalog",
    icon: (
      <svg viewBox="0 0 24 24">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <circle cx="3" cy="6" r="1" fill="currentColor"/>
        <circle cx="3" cy="12" r="1" fill="currentColor"/>
        <circle cx="3" cy="18" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    to: "/upstream",
    label: "Upstream",
    badge: "18.4k",
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="8 17 12 21 16 17"/>
        <line x1="12" y1="12" x2="12" y2="21"/>
        <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
      </svg>
    )
  },
  {
    to: "/gateway",
    label: "Gateway",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    )
  }
];

function Sidebar({ catalogCount }: { catalogCount: number }) {
  const state = useRouterState();
  const path = state.location.pathname;

  return (
    <aside className="sidebar">
      <div className="sb-top">
        <div className="sb-logo">M</div>
        <span className="sb-name">Sub-Registry</span>
        <span className="sb-tag">v0.1</span>
      </div>
      <nav className="sb-nav">
        <span className="sb-section">Core</span>
        {NAV_ITEMS.map(({ to, label, icon, exact, badge }) => {
          const active = exact ? path === to : path.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`nav-item${active ? " active" : ""}`}
            >
              {icon}
              {label}
              {badge === "catalog" && catalogCount > 0 && (
                <span className="nav-badge num">{catalogCount}</span>
              )}
              {badge && badge !== "catalog" && (
                <span className="nav-badge num">{badge}</span>
              )}
            </Link>
          );
        })}
        <span className="sb-section">Config</span>
        <Link
          to="/settings"
          className={`nav-item${path.startsWith("/settings") ? " active" : ""}`}
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Settings
        </Link>
      </nav>
      <div className="sb-foot">
        <div className="pulse" />
        <span className="sb-url">registry.toolhost.online</span>
      </div>
    </aside>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["search", q],
    queryFn: () => fetchSearch(q),
    enabled: q.length > 1,
    staleTime: 5000
  });

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  if (!open) return null;

  const servers = data?.servers ?? [];
  const NAV_CMDS = [
    { label: "Go to Pipeline", sub: "Dashboard overview", path: "/" },
    { label: "Go to Catalog", sub: "Curated server list", path: "/catalog" },
    { label: "Browse Upstream", sub: "18,410 upstream servers", path: "/upstream" },
    { label: "Gateway Projection", sub: "What the gateway consumes", path: "/gateway" },
    { label: "Settings", sub: "Admin key & config", path: "/settings" }
  ];

  return (
    <div className="cmd-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cmd-box">
        <div className="cmd-in-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref={inputRef}
            className="cmd-in"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search or run a command…"
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          />
        </div>
        <div className="cmd-res">
          {!q && (
            <>
              <div className="cmd-grp">Navigate</div>
              {NAV_CMDS.map((c) => (
                <div
                  key={c.path}
                  className="cmd-item"
                  onClick={() => { navigate({ to: c.path }); onClose(); }}
                >
                  <div className="cmd-ic">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  </div>
                  <div className="cmd-txt">
                    <div className="cmd-nm">{c.label}</div>
                    <div className="cmd-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </>
          )}
          {servers.length > 0 && (
            <>
              <div className="cmd-grp">Servers</div>
              {servers.slice(0, 8).map((s) => (
                <div
                  key={s.server.name}
                  className="cmd-item"
                  onClick={() => {
                    navigate({ to: "/catalog/$name", params: { name: encodeURIComponent(s.server.name) } });
                    onClose();
                  }}
                >
                  <div className="cmd-ic" style={{ background: "var(--green-d)" }}>
                    <svg viewBox="0 0 24 24" style={{ stroke: "var(--green)" }}><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="cmd-txt">
                    <div className="cmd-nm mono" style={{ fontSize: "12px" }}>{s.server.name}</div>
                    <div className="cmd-sub">approved · {s.server.description?.slice(0, 50)}</div>
                  </div>
                </div>
              ))}
            </>
          )}
          {q.length > 1 && servers.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", fontSize: "13px", color: "var(--tx3)" }}>
              No results for "{q}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const currentPage = useCurrentPage();

  const { data: catalog } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => fetchCatalog(),
    staleTime: 60_000
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="shell">
      <Sidebar catalogCount={catalog?.metadata.count ?? 0} />

      <div className="main">
        <header className="topbar">
          <div className="bc">
            <span className="bc-sep mono" style={{ fontSize: "16px" }}>◈</span>
            <span className="bc-cur">{currentPage}</span>
          </div>
          <div className="tb-space" />
          <div className="sync-chip">
            <div className="sync-dot" />
            <span>live</span>
          </div>
          <button className="cmd-btn" onClick={() => setCmdOpen(true)}>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Search or jump…
            <span className="kbd">⌘K</span>
          </button>
        </header>

        <div className="content">
          {children}
        </div>
      </div>

      {cmdOpen && <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />}
    </div>
  );
}
