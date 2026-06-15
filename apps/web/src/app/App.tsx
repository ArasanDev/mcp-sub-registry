import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../api/client";
import type { SearchResponse, ServerList, ServerResponse, SourceSummary, TagSummary } from "../api/types";
import { AppShell } from "./shell/AppShell";
import { Topbar } from "./shell/Topbar";
import type { Tab } from "./routes";
import { ApiDocsPage } from "../features/api-docs/ApiDocsPage";
import { BackupPage } from "../features/backup/BackupPage";
import { CatalogPage } from "../features/catalog/CatalogPage";
import { ManualServerPage } from "../features/manual/ManualServerPage";
import { OverviewPage } from "../features/overview/OverviewPage";
import { RegistryPage } from "../features/registry/RegistryPage";
import { ReviewQueuePage } from "../features/review/ReviewQueuePage";
import { ServerDetailPanel } from "../features/server-detail/ServerDetailPanel";
import { SourcesPage } from "../features/sources/SourcesPage";
import type { CurationAction, RegistryFilters } from "../features/types";
import { curationMeta, readinessMeta, serverMeta, versionMeta } from "../lib/meta";

const adminKeyStorage = "mcpSubRegistryAdminKey";

const defaultFilters: RegistryFilters = {
  query: "",
  curation: "",
  lifecycle: "",
  readiness: "",
  source: "",
  tag: "",
  sort: "updated"
};

export function App() {
  const [tab, setTab] = useState<Tab>("overview");
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(adminKeyStorage) || "");
  const [health, setHealth] = useState<string>("unknown");
  const [registry, setRegistry] = useState<ServerResponse[]>([]);
  const [catalog, setCatalog] = useState<ServerResponse[]>([]);
  const [sources, setSources] = useState<SourceSummary[]>([]);
  const [tags, setTags] = useState<TagSummary[]>([]);
  const [selected, setSelected] = useState<ServerResponse | null>(null);
  const [filters, setFilters] = useState<RegistryFilters>(defaultFilters);
  const [activity, setActivity] = useState<string[]>([]);
  const [registryCursor, setRegistryCursor] = useState<string | null>(null);
  const [nextRegistryCursor, setNextRegistryCursor] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResponse["servers"]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem(adminKeyStorage, adminKey);
  }, [adminKey]);

  useEffect(() => {
    void refreshAll();
  }, []);

  async function refreshAll() {
    await Promise.all([loadHealth(), loadSources(), loadTags(), loadRegistry(), loadCatalog()]);
  }

  async function loadHealth() {
    try {
      const result = await apiGet<{ status: string }>("/v0.1/health");
      setHealth(result.status);
    } catch {
      setHealth("unavailable");
    }
  }

  async function loadRegistry(cursor?: string | null) {
    const params = new URLSearchParams({ limit: "100", version: "latest" });
    if (cursor) params.set("cursor", cursor);

    const result = await apiGet<ServerList>(`/v0.1/servers?${params.toString()}`);
    setRegistry(result.servers);
    setRegistryCursor(cursor || null);
    setNextRegistryCursor(result.metadata.nextCursor || null);
    setSelected((current) => current || result.servers[0] || null);
  }

  async function loadCatalog() {
    const result = await apiGet<ServerList>("/v0.1/catalog");
    setCatalog(result.servers);
  }

  async function loadSources() {
    const result = await apiGet<{ sources: SourceSummary[] }>("/v0.1/sources");
    setSources(result.sources);
  }

  async function loadTags() {
    const result = await apiGet<{ tags: TagSummary[] }>("/v0.1/tags");
    setTags(result.tags);
  }

  useEffect(() => {
    const query = filters.query.trim();

    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    let active = true;
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);

    const timer = setTimeout(() => {
      void apiGet<SearchResponse>(
        `/v0.1/search?${new URLSearchParams({
          q: query,
          limit: "100"
        }).toString()}`
      )
        .then((result) => {
          if (!active) return;
          setSearchResults(result.servers);
        })
        .catch((error) => {
          if (!active) return;
          setSearchError(error instanceof Error ? error.message : "Search unavailable");
        })
        .finally(() => {
          if (!active) return;
          setSearchLoading(false);
        });
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [filters.query]);

  function recordActivity(line: string) {
    setActivity((lines) => [`${new Date().toLocaleTimeString()} ${line}`, ...lines].slice(0, 16));
  }

  async function curateSelected(action: CurationAction) {
    if (!selected) return;
    const current = selected;

    await apiPatch(
      "/admin/curations",
      {
        serverName: current.server.name,
        version: current.server.version,
        ...action
      },
      adminKey
    );

    recordActivity(`Curated ${current.server.name}`);
    await Promise.all([loadRegistry(), loadCatalog()]);
    await refreshSelected(current);
  }

  async function importSelected(row: ServerResponse) {
    const source = serverMeta(row);
    const lifecycle = versionMeta(row);
    const sourceName = source.sourceNames?.[0] || "manual";

    await apiPost(
      "/admin/imports",
      {
        sourceName,
        sourceType: source.isOfficial ? "official" : sourceName === "manual" ? "manual" : "subregistry",
        sourceBaseUrl: lifecycle.source?.startsWith("http") ? lifecycle.source : null,
        input: row.server,
        upstreamStatus:
          lifecycle.status === "deleted"
            ? "deleted"
            : lifecycle.status === "deprecated"
              ? "deprecated"
              : "active"
      },
      adminKey
    );

    recordActivity(`Imported ${row.server.name}`);
    await Promise.all([loadRegistry(), loadCatalog(), loadSources()]);
    await refreshSelected(row);
  }

  async function refreshSelected(row: ServerResponse) {
    const name = encodeURIComponent(row.server.name);
    const version = encodeURIComponent(row.server.version);
    const fresh = await apiGet<ServerResponse>(`/v0.1/servers/${name}/versions/${version}`);
    setSelected(fresh);
  }

  async function syncOfficial() {
    const source = sources.find((item) => item.type === "official" && item.baseUrl) || sources.find((item) => item.baseUrl);
    if (!source) {
      recordActivity("No syncable source found");
      return;
    }

    const result = await apiPost<{ sync: { serversSeen: number; versionsSeen: number } }>(
      `/admin/sources/${source.id}/sync`,
      { mode: "latest_only" },
      adminKey
    );
    recordActivity(
      `Synced ${source.name}: ${result.sync.serversSeen} servers, ${result.sync.versionsSeen} versions`
    );
    await Promise.all([loadSources(), loadRegistry(), loadCatalog()]);
  }

  const reviewRows = useMemo(() => registry.filter(needsReview), [registry]);
  const searchResultNames = useMemo(() => {
    if (!filters.query.trim() || searchLoading || searchError) return null;

    return new Set(searchResults.map((result) => result.server.name));
  }, [filters.query, searchLoading, searchError, searchResults]);
  const filteredReviewRows = useMemo(
    () => sortRows(reviewRows.filter((row) => matchesFilters(row, filters, searchResultNames)), filters.sort),
    [reviewRows, filters, searchResultNames]
  );
  const filteredRegistry = useMemo(
    () => sortRows(registry.filter((row) => matchesFilters(row, filters, searchResultNames)), filters.sort),
    [registry, filters, searchResultNames]
  );
  const filteredCatalog = useMemo(
    () => sortRows(catalog.filter((row) => matchesFilters(row, filters, searchResultNames)), filters.sort),
    [catalog, filters, searchResultNames]
  );

  const content = (() => {
    switch (tab) {
      case "overview":
        return (
          <OverviewPage
            registry={registry}
            catalog={catalog}
            sources={sources}
            reviewCount={reviewRows.length}
            onSync={() => void syncOfficial()}
            onOpenReview={() => setTab("review")}
            onOpenPublished={() => setTab("catalog")}
            onSelect={(row) => {
              setSelected(row);
              setTab("catalog");
            }}
            onImport={(row) => void importSelected(row)}
          />
        );
      case "review":
        return (
          <ReviewQueuePage
            rows={filteredReviewRows}
            sources={sources}
            tags={tags}
            filters={filters}
            onFiltersChange={setFilters}
            onSelect={setSelected}
            onRefresh={() => void loadRegistry()}
          />
        );
      case "catalog":
        return (
          <CatalogPage
            rows={filteredCatalog}
            sources={sources}
            tags={tags}
            filters={filters}
            onFiltersChange={setFilters}
            selected={selected}
            onSelect={setSelected}
            onImport={(row) => void importSelected(row)}
            onRefresh={() => void loadCatalog()}
          />
        );
      case "registry":
        return (
          <RegistryPage
            rows={filteredRegistry}
            sources={sources}
            tags={tags}
            filters={filters}
            onFiltersChange={setFilters}
            selected={selected}
            onSelect={setSelected}
            nextCursor={nextRegistryCursor}
            hasPrevious={Boolean(registryCursor)}
            onNext={() => void loadRegistry(nextRegistryCursor)}
            onPrevious={() => void loadRegistry()}
            onRefresh={() => void loadRegistry(registryCursor)}
          />
        );
      case "sources":
        return (
          <SourcesPage
            sources={sources}
            adminKey={adminKey}
            onRefresh={() => void loadSources()}
            onActivity={recordActivity}
          />
        );
      case "manual":
        return (
          <ManualServerPage
            adminKey={adminKey}
            onCreated={() => void Promise.all([loadRegistry(), loadCatalog()])}
            onActivity={recordActivity}
          />
        );
      case "backup":
        return (
          <BackupPage
            adminKey={adminKey}
            onActivity={recordActivity}
            onImported={() => void refreshAll()}
          />
        );
      case "api":
        return <ApiDocsPage tags={tags} activity={activity} />;
    }
  })();

  return (
    <AppShell active={tab} onSelect={setTab} adminKey={adminKey} onAdminKeyChange={setAdminKey}>
      <main className="flex-1 overflow-hidden relative flex flex-col min-w-0">
        <Topbar health={health} registryCount={registry.length} catalogCount={catalog.length} />
        {tab === "overview" ? (
          <div className="flex-1 min-h-0 overflow-y-auto">{content}</div>
        ) : (
          <div className="flex-1 min-h-0 flex overflow-hidden">
            <div className="flex-1 min-w-0 overflow-y-auto">{content}</div>
            <ServerDetailPanel
              selected={selected}
              tags={tags}
              adminKey={adminKey}
              onCurate={(action) => void curateSelected(action)}
              onImport={(row) => void importSelected(row)}
              onTagged={() =>
                void (async () => {
                  await Promise.all([loadRegistry(), loadCatalog(), loadTags()]);
                  if (selected) await refreshSelected(selected);
                })()
              }
            />
          </div>
        )}
      </main>
    </AppShell>
  );
}

function sortRows(rows: ServerResponse[], sort: RegistryFilters["sort"]) {
  return [...rows].sort((left, right) => {
    if (sort === "updated") {
      return String(versionMeta(right).updatedAt || "").localeCompare(
        String(versionMeta(left).updatedAt || "")
      );
    }

    if (sort === "source") {
      return String(serverMeta(left).sourceNames?.[0] || "").localeCompare(
        String(serverMeta(right).sourceNames?.[0] || "")
      );
    }

    if (sort === "readiness") {
      return String(readinessMeta(left).status || "").localeCompare(
        String(readinessMeta(right).status || "")
      );
    }

    if (sort === "curation") {
      return String(curationMeta(left).status || "pending").localeCompare(
        String(curationMeta(right).status || "pending")
      );
    }

    return left.server.name.localeCompare(right.server.name);
  });
}

function needsReview(row: ServerResponse) {
  const readiness = readinessMeta(row);
  const lifecycle = versionMeta(row);
  const curation = curationMeta(row);

  return (
    ["pending", "hidden", "rejected"].includes(curation.status || "pending") ||
    ["needs_secret", "needs_config", "deprecated", "deleted", "unknown"].includes(
      readiness.status || "unknown"
    ) ||
    ["deprecated", "deleted"].includes(lifecycle.status || "")
  );
}

function matchesFilters(
  row: ServerResponse,
  filters: RegistryFilters,
  searchResultNames: Set<string> | null
) {
  const query = filters.query.trim().toLowerCase();
  const curation = curationMeta(row);
  const readiness = readinessMeta(row);
  const lifecycle = versionMeta(row);
  const source = serverMeta(row);

  if (query) {
    if (searchResultNames) {
      if (!searchResultNames.has(row.server.name)) return false;
    } else {
      const haystack = [
        row.server.name,
        row.server.title || "",
        row.server.description || ""
      ].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
  }

  if (filters.curation && (curation.status || "pending") !== filters.curation) return false;
  if (filters.readiness && (readiness.status || "unknown") !== filters.readiness) return false;
  if (filters.lifecycle && (lifecycle.status || "active") !== filters.lifecycle) return false;
  if (filters.source && !source.sourceNames?.includes(filters.source)) return false;
  if (filters.tag && !curation.tags?.includes(filters.tag)) return false;

  return true;
}
