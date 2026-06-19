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

  if (!server) {
    return (
      <div className="pub-root">
        <header className="pub-header">
          <div className="pub-header-logo">T</div>
          <span className="pub-header-name">ToolHost</span>
          <div className="pub-header-divider" />
          <span className="pub-header-section">Catalog</span>
        </header>
        <div className="pub-container">
          <Link to="/servers" className="pub-back">← Catalog</Link>
          <p style={{ color: "var(--tx-muted)", fontSize: "14px" }}>
            Server not found.
          </p>
        </div>
      </div>
    );
  }

  const tools = server.tools ?? [];
  const TOOL_PREVIEW = 9;
  const shownTools = tools.slice(0, TOOL_PREVIEW);
  const remainingTools = server.toolCount - shownTools.length;

  const importUrl = `https://gateway.toolhost.online/console?import=${encodeURIComponent(server.slug)}`;

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
        <Link to="/servers" className="pub-back">← Catalog</Link>

        <div className="pub-det-header">
          <h1 className="pub-det-title">{server.name}</h1>
          <p className="pub-det-desc">{server.description}</p>

          <div className="pub-det-pills">
            <span className="pub-det-pill pub-mono">{server.category}</span>
            <span className="pub-det-pill pub-mono">{server.auth}</span>
            <span className={riskPillClass(server.risk)}>{server.risk} Risk</span>
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
            <div className="pub-section">
              <div className="pub-section-title">Tools</div>
              <div className="pub-tool-list">
                {shownTools.map(tool => (
                  <div key={tool.name} className="pub-tool-item">
                    <span className="pub-tool-name">{tool.name}</span>
                    <span className="pub-tool-desc">{tool.description}</span>
                  </div>
                ))}
              </div>
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
            </div>

            {/* Auth Setup */}
            <div className="pub-section">
              <div className="pub-section-title">Auth Setup</div>
              <p className="pub-auth-text">
                {server.authSetup ?? "No authentication required for this server."}
              </p>
            </div>

            {/* Schema */}
            <div className="pub-section">
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
            </div>
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
