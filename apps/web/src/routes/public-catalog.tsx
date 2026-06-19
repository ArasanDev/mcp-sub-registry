import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { PUBLIC_SERVERS } from "@/data/public-catalog";
import type { PublicServer, RiskLevel } from "@/data/public-catalog";
import "@/styles/public.css";

function riskPillClass(risk: RiskLevel): string {
  if (risk === "Low") return "pub-pill pub-pill-risk-low";
  if (risk === "Medium") return "pub-pill pub-pill-risk-medium";
  return "pub-pill pub-pill-risk-high";
}

function ServerCard({ server }: { server: PublicServer }) {
  return (
    <Link to="/server/$slug" params={{ slug: server.slug }} className="pub-card">
      <div className="pub-card-name">{server.name}</div>
      <div className="pub-card-desc">{server.description}</div>
      <div className="pub-card-pills">
        <span className="pub-pill pub-mono">{server.category}</span>
        <span className="pub-pill pub-pill-auth pub-mono">{server.auth}</span>
        <span className={riskPillClass(server.risk)}>{server.risk} Risk</span>
      </div>
      <div className="pub-card-footer">{server.toolCount} tools</div>
    </Link>
  );
}

export function PublicCatalogPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return PUBLIC_SERVERS;
    const q = query.toLowerCase();
    return PUBLIC_SERVERS.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="pub-root">
      <header className="pub-header">
        <div className="pub-header-logo">T</div>
        <span className="pub-header-name">ToolHost</span>
        <div className="pub-header-divider" />
        <span className="pub-header-section">Catalog</span>
        <div className="pub-header-space" />
        <a
          href="https://gateway.toolhost.online/console"
          className="pub-header-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Gateway →
        </a>
      </header>

      <div className="pub-container">
        <div className="pub-hero">
          <h1 className="pub-hero-title">ToolHost Catalog</h1>
          <p className="pub-hero-sub">
            Curated MCP servers for production use. Every server is schema-pinned at
            approval. Connect directly to any ToolHost gateway.
          </p>
        </div>

        <div className="pub-search-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="pub-search-input"
            type="text"
            placeholder="Search servers..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search servers"
          />
        </div>

        <div className="pub-grid">
          {filtered.length === 0 ? (
            <div className="pub-empty">No servers match "{query}"</div>
          ) : (
            filtered.map(server => (
              <ServerCard key={server.slug} server={server} />
            ))
          )}
        </div>
      </div>

      <footer className="pub-footer">
        <div className="pub-container">
          <div className="pub-footer-inner">
            <span>ToolHost Catalog — {PUBLIC_SERVERS.length} curated servers</span>
            <a
              href="https://gateway.toolhost.online"
              className="pub-footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              gateway.toolhost.online
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
