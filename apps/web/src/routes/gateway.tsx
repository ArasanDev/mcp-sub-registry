import { useQuery } from "@tanstack/react-query";
import { fetchGatewayCatalog } from "@/api/gateway";
import { relativeTime } from "@/lib/utils";
import { toast } from "sonner";

export function GatewayPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["gateway-catalog"],
    queryFn: () => fetchGatewayCatalog(),
    staleTime: 60_000
  });

  const items = data?.items ?? [];
  const hostedCount = items.filter((i) => i.gateway_compatibility.hosted_gateway).length;

  function exportJson() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gateway-catalog.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported gateway-catalog.json");
  }

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">Gateway Projection</div>
          <div className="ph-sub">What connected gateways consume from this registry</div>
        </div>
        <div className="ph-right">
          <button className="btn btn-outline btn-sm" onClick={exportJson}>
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export JSON
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="proj-head">
        <div className="proj-num">{isLoading ? "…" : items.length}</div>
        <div className="proj-info">
          <div style={{ fontSize: "14px", fontWeight: 600 }}>Items in projection</div>
          <div className="proj-label">Approved + public · all hosts verified</div>
          <div className="proj-hash mono">
            {data ? `generated ${relativeTime(data.generatedAt)} · ${hostedCount} hosted-gateway ready` : "Loading…"}
          </div>
        </div>
        <a href="/v0.1/gateway/catalog" target="_blank" rel="noopener noreferrer">
          <button className="btn btn-outline">
            <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View /v0.1/gateway/catalog
          </button>
        </a>
      </div>

      {/* Connected gateways */}
      <div className="gw-section-title">Connected Gateways</div>
      <div className="gw-row">
        <div className="pulse" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: 500 }}>Our MCP Gateway</div>
          <div className="gw-url">https://gateway.toolhost.online</div>
        </div>
        <span className="gw-badge">● polling every 5m</span>
      </div>
      <div className="gw-row" style={{ border: "1px dashed var(--border)", background: "transparent", cursor: "pointer" }}>
        <svg viewBox="0 0 24 24" style={{ width: "14px", height: "14px", stroke: "var(--tx3)", fill: "none", strokeWidth: 2 }}>
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <div style={{ fontSize: "13px", color: "var(--tx3)" }}>Register another gateway</div>
      </div>

      {/* Projection items table */}
      <div style={{ marginTop: "24px" }}>
        <div className="gw-section-title">Projection items</div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "32px 0", fontSize: "13px", color: "var(--tx3)" }}>Loading gateway catalog…</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Server</th>
                <th>Compatibility</th>
                <th>Transport</th>
                <th>Secrets needed</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.catalogItemId}>
                  <td>
                    <div className="sname">{item.name}</div>
                    {item.title && item.title !== item.name && (
                      <div className="stitle">{item.title}</div>
                    )}
                  </td>
                  <td>
                    {item.gateway_compatibility.hosted_gateway ? (
                      <span className="gw-badge">● hosted</span>
                    ) : (
                      <span className="gw-badge-yellow">○ connector*</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {item.gateway_compatibility.supported_transports.map((t) => (
                        <span key={t} className="tag">{t.replace(/_/g, "-")}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {item.requiredSecrets.length > 0 ? (
                      <span className="mono" style={{ fontSize: "11px", color: "var(--tx2)" }}>
                        {item.requiredSecrets.join(", ")}
                      </span>
                    ) : (
                      <span style={{ fontSize: "11px", color: "var(--tx3)" }}>none</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Boundary notice */}
      <div className="boundary-box">
        <div className="boundary-title">discovered ≠ approved ≠ enabled</div>
        <div className="boundary-text">
          This registry approves servers for <strong style={{ color: "var(--tx)" }}>catalog visibility only</strong>.
          Enabling for runtime execution happens in your gateway — never here.
          Secret names are stored; secret values are never.
        </div>
      </div>
    </div>
  );
}
