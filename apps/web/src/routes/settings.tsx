import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSources, triggerSync, exportBackup } from "@/api/admin";
import { useAuthStore } from "@/store/auth";
import { relativeTime } from "@/lib/utils";
import { toast } from "sonner";
import type { SourceInfo } from "@/api/types";

function SourceRow({ source, adminKey }: { source: SourceInfo; adminKey: string }) {
  const queryClient = useQueryClient();
  const syncMut = useMutation({
    mutationFn: () => triggerSync(source.id, adminKey),
    onSuccess: (data) => {
      const s = data.sync;
      toast.success(`Sync complete — ${s.serversSeen} servers seen · ${s.status}`);
      queryClient.invalidateQueries({ queryKey: ["sources"] });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const lastRun = source.lastSyncRun;

  return (
    <div className="stg-row">
      <div className="stg-lbl">{source.name}</div>
      <div className="stg-val" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          className="toggle on"
          style={{
            width: "36px", height: "20px", borderRadius: "10px",
            background: "var(--accent)", position: "relative",
            cursor: "pointer", flexShrink: 0
          }}
        />
        <span style={{ fontSize: "12px", color: "var(--tx2)" }}>
          {lastRun
            ? `${lastRun.status} · ${lastRun.serversSeen} servers · ${relativeTime(lastRun.startedAt)}`
            : source.lastSyncedAt
            ? `last ${relativeTime(source.lastSyncedAt)}`
            : "never synced"
          }
        </span>
      </div>
      {source.baseUrl && adminKey && (
        <button
          className="btn btn-outline btn-sm"
          onClick={() => syncMut.mutate()}
          disabled={syncMut.isPending}
          style={{ flexShrink: 0 }}
        >
          <svg viewBox="0 0 24 24" style={{ width: "12px", height: "12px", stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          {syncMut.isPending ? "Syncing…" : "Sync now"}
        </button>
      )}
    </div>
  );
}

export function SettingsPage() {
  const { adminKey, setAdminKey, clearAdminKey } = useAuthStore();
  const [keyInput, setKeyInput] = useState(adminKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: sourcesData, isLoading: sourcesLoading } = useQuery({
    queryKey: ["sources", adminKey],
    queryFn: () => fetchSources(adminKey),
    enabled: adminKey.length > 0,
    staleTime: 30_000
  });

  function saveKey() {
    if (!keyInput.trim()) {
      clearAdminKey();
      toast.success("Admin key cleared");
    } else if (keyInput.length < 10) {
      toast.error("Key looks too short");
      return;
    } else {
      setAdminKey(keyInput.trim());
      toast.success("Admin key saved");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExportBackup() {
    if (!adminKey) { toast.error("Enter admin key first"); return; }
    exportBackup(adminKey)
      .then((data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "registry-backup.json";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Backup downloaded");
      })
      .catch((e: Error) => toast.error(e.message));
  }

  const sources = sourcesData?.sources ?? [];

  return (
    <div className="page" style={{ maxWidth: "720px" }}>
      <div className="ph">
        <div>
          <div className="ph-title">Settings</div>
          <div className="ph-sub">Registry configuration and connections</div>
        </div>
      </div>

      {/* Registry identity */}
      <div className="stg-section">
        <div className="stg-hd">Registry Identity</div>
        <div className="stg-row">
          <div className="stg-lbl">Name</div>
          <input className="stg-in" defaultValue="MCP Sub-Registry" />
        </div>
        <div className="stg-row">
          <div className="stg-lbl">Public URL</div>
          <input className="stg-in" defaultValue="https://registry.toolhost.online" />
        </div>
        <div className="stg-row">
          <div className="stg-lbl">API version</div>
          <div className="stg-val mono" style={{ fontSize: "13px" }}>v0.1</div>
        </div>
        <div className="stg-row">
          <div className="stg-lbl">Public catalog</div>
          <div className="stg-val" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px", height: "20px", borderRadius: "10px",
                background: "var(--accent)", position: "relative", cursor: "pointer", flexShrink: 0
              }}
            />
            <span style={{ fontSize: "13px", color: "var(--tx2)" }}>Allow anyone to browse approved servers</span>
          </div>
        </div>
      </div>

      {/* Upstream sources */}
      <div className="stg-section">
        <div className="stg-hd">Upstream Sources</div>
        {!adminKey ? (
          <div className="stg-row">
            <div style={{ fontSize: "13px", color: "var(--tx3)" }}>Enter admin key to see sources and trigger syncs</div>
          </div>
        ) : sourcesLoading ? (
          <div className="stg-row">
            <div style={{ fontSize: "13px", color: "var(--tx3)" }}>Loading…</div>
          </div>
        ) : sources.length === 0 ? (
          <>
            <div className="stg-row">
              <div className="stg-lbl">Official MCP Registry</div>
              <div className="stg-val" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "20px", borderRadius: "10px", background: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: "var(--tx2)" }}>Configured · no syncs run yet</span>
              </div>
            </div>
          </>
        ) : (
          sources.map((s) => <SourceRow key={s.id} source={s} adminKey={adminKey} />)
        )}
        <div className="stg-row">
          <div className="stg-lbl">Sync cadence</div>
          <div className="stg-val" style={{ fontSize: "13px", color: "var(--tx2)" }}>Every 6 hours</div>
        </div>
        <div className="stg-row">
          <div className="stg-lbl">Add upstream</div>
          <button className="btn btn-outline btn-sm">+ Connect source</button>
        </div>
      </div>

      {/* Admin API key */}
      <div className="stg-section">
        <div className="stg-hd">Admin API Key</div>
        <div className="stg-row">
          <div className="stg-lbl">Current key</div>
          <div style={{ flex: 1, display: "flex", gap: "8px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                className="stg-in"
                type={showKey ? "text" : "password"}
                value={keyInput}
                onChange={(e) => { setKeyInput(e.target.value); setSaved(false); }}
                placeholder="Enter admin key…"
                onKeyDown={(e) => e.key === "Enter" && saveKey()}
                style={{ paddingRight: "36px" }}
              />
              <button
                onClick={() => setShowKey((s) => !s)}
                style={{
                  position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "var(--tx3)", cursor: "pointer", fontSize: "11px"
                }}
              >
                {showKey ? "hide" : "show"}
              </button>
            </div>
            <button
              className={`btn btn-sm${saved ? " btn-primary" : " btn-outline"}`}
              onClick={saveKey}
            >
              {saved ? "Saved ✓" : "Save"}
            </button>
          </div>
        </div>
        <div className="stg-row">
          <div className="stg-lbl">Status</div>
          <div className="stg-val" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            {adminKey ? (
              <>
                <span style={{ color: "var(--green)", fontWeight: 500 }}>● active</span>
                <span style={{ fontSize: "12px", color: "var(--tx3)" }}>{adminKey.length} chars · localStorage</span>
                <button
                  onClick={() => { clearAdminKey(); setKeyInput(""); }}
                  style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "12px" }}
                >
                  Clear
                </button>
              </>
            ) : (
              <span style={{ color: "var(--tx3)" }}>not set</span>
            )}
          </div>
        </div>
        <div className="stg-row">
          <div className="stg-lbl"></div>
          <div className="stg-val" style={{ fontSize: "12px", color: "var(--tx3)" }}>
            ≥ 32 chars · never logged or committed. Admin key unlocks approve/reject, curation edits, and sync actions.
          </div>
        </div>
      </div>

      {/* Catalog seed */}
      <div className="stg-section">
        <div className="stg-hd">Catalog Seed</div>
        <div className="stg-row">
          <div className="stg-lbl">Default seed</div>
          <div className="stg-val">
            19 servers from <span className="mono" style={{ fontSize: "12px" }}>data/default-curated-servers.json</span>
          </div>
        </div>
        <div className="stg-row">
          <div className="stg-lbl">Endpoints</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <a href="/v0.1/catalog" target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: "12px", color: "var(--accent)" }}>/v0.1/catalog</a>
            <span style={{ color: "var(--tx3)" }}>·</span>
            <a href="/v0.1/gateway/catalog" target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: "12px", color: "var(--accent)" }}>/v0.1/gateway/catalog</a>
          </div>
        </div>
        <div className="stg-row">
          <div className="stg-lbl">Actions</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleExportBackup}
              disabled={!adminKey}
            >
              <svg viewBox="0 0 24 24" style={{ width: "13px", height: "13px", stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export seed
            </button>
            {!adminKey && (
              <span style={{ fontSize: "12px", color: "var(--tx3)", alignSelf: "center" }}>requires admin key</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
