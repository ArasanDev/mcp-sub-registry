import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { getServerBySlug } from "@/data/public-catalog";
import type { RiskLevel } from "@/data/public-catalog";
import "@/styles/public.css";

function riskPillClass(risk: RiskLevel): string {
  if (risk === "Low") return "pub-det-pill pub-pill-risk-low";
  if (risk === "Medium") return "pub-det-pill pub-pill-risk-medium";
  return "pub-det-pill pub-pill-risk-high";
}

export function PublicServerPage({ slug }: { slug: string }) {
  const server = getServerBySlug(slug);

  useEffect(() => {
    document.title = server
      ? `${server.name} — ToolHost Catalog`
      : "Server Not Found — ToolHost Catalog";
  }, [server]);

  if (!server) {
    return (
      <div className="pub-root">
        <header className="pub-header">
          <div className="pub-header-logo">T</div>
          <span className="pub-header-name">ToolHost</span>
          <div className="pub-header-divider" />
          <span className="pub-header-section">Catalog</span>
        </header>
        <main aria-label="Server Not Found — ToolHost Catalog">
          <div className="pub-container">
            <nav aria-label="Breadcrumb">
              <Link to="/servers" className="pub-back">← Catalog</Link>
            </nav>
            <p style={{ color: "var(--tx-muted)", fontSize: "14px" }}>
              Server not found.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const tools = server.tools ?? [];
  const TOOL_PREVIEW = 9;
  const shownTools = tools.slice(0, TOOL_PREVIEW);
  const remainingTools = server.toolCount - shownTools.length;

  const importUrl = `https://gateway.toolhost.online/console?import=${encodeURIComponent(server.slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": server.name,
    "applicationCategory": server.category,
    "description": server.description,
    "url": `https://registry.toolhost.online/server/${server.slug}`
  };

  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <div className="pub-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

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

      <main aria-label={`${server.name} — ToolHost Catalog`}>
        <div className="pub-container">
          <nav aria-label="Breadcrumb">
            <Link to="/servers" className="pub-back">← Catalog</Link>
          </nav>

          <div className="pub-det-header">
            <h1 className="pub-det-title">{server.name}</h1>
            <p className="pub-det-desc">{server.description}</p>

            <div className="pub-det-pills">
              <span className="pub-det-pill pub-mono">{server.category}</span>
              <span
                className="pub-det-pill pub-mono"
                aria-label={`Authentication: ${server.auth}`}
              >
                {server.auth}
              </span>
              <span
                className={riskPillClass(server.risk)}
                aria-label={`Risk level: ${server.risk}`}
              >
                {server.risk} Risk
              </span>
              <span className="pub-det-pill pub-mono">{server.toolCount} tools</span>
            </div>

            <a href={importUrl} className="pub-cta-btn" target="_blank" rel="noopener noreferrer">
              Add to Gateway →
            </a>
          </div>

          <div className="pub-det-body">
            {/* Main column */}
            <div>
              {/* Tools */}
              <section aria-label="Available tools" className="pub-section">
                <div className="pub-section-title">Tools</div>
                <ul className="pub-tool-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {shownTools.map(tool => (
                    <li key={tool.name} className="pub-tool-item">
                      <code className="pub-tool-name">{tool.name}</code>
                      <span className="pub-tool-desc">{tool.description}</span>
                    </li>
                  ))}
                </ul>
                {remainingTools > 0 && (
                  <a
                    href={importUrl}
                    className="pub-tools-more"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View all {server.toolCount} →
                  </a>
                )}
              </section>

              {/* Auth Setup */}
              <section aria-label="Authentication setup" className="pub-section">
                <div className="pub-section-title">Auth Setup</div>
                <p className="pub-auth-text">
                  {server.authSetup ?? "No authentication required for this server."}
                </p>
              </section>

              {/* Schema */}
              <section aria-label="Schema verification" className="pub-section">
                <div className="pub-section-title">Schema</div>
                <div className="pub-schema-block">
                  <div>Schema pinned at first approval.</div>
                  <div style={{ marginTop: "8px" }}>
                    <span className="pub-schema-key">Hash: </span>
                    <span className="pub-schema-val">
                      {server.schemaHash ?? "sha256:[pending first approval]"}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div>
              <div className="pub-sidebar-card">
                <div className="pub-sidebar-card-title">Server Details</div>
                <div className="pub-sidebar-row">
                  <span className="pub-sidebar-label">Category</span>
                  <span className="pub-sidebar-val">{server.category}</span>
                </div>
                <div className="pub-sidebar-row">
                  <span className="pub-sidebar-label">Auth</span>
                  <span className="pub-sidebar-val">{server.auth}</span>
                </div>
                <div className="pub-sidebar-row">
                  <span className="pub-sidebar-label">Risk</span>
                  <span className="pub-sidebar-val">{server.risk}</span>
                </div>
                <div className="pub-sidebar-row">
                  <span className="pub-sidebar-label">Tools</span>
                  <span className="pub-sidebar-val">{server.toolCount}</span>
                </div>
                <div className="pub-sidebar-row">
                  <span className="pub-sidebar-label">Status</span>
                  <span
                    className="pub-sidebar-val"
                    style={{ color: "var(--success)", fontSize: "13px" }}
                  >
                    Approved
                  </span>
                </div>
              </div>

              <div className="pub-sidebar-card">
                <div className="pub-sidebar-card-title">Add to Gateway</div>
                <p style={{ fontSize: "13px", color: "var(--tx-secondary)", lineHeight: "1.6", marginBottom: "14px" }}>
                  Import this server into your ToolHost gateway. Schema is pinned at approval — any
                  upstream changes are flagged automatically.
                </p>
                <a href={importUrl} className="pub-cta-btn" target="_blank" rel="noopener noreferrer" style={{ width: "100%", justifyContent: "center" }}>
                  Add to Gateway →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="pub-footer">
        <div className="pub-container">
          <div className="pub-footer-inner">
            <span>ToolHost Catalog</span>
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
