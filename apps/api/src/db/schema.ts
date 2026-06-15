import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

const id = integer().primaryKey().generatedAlwaysAsIdentity();

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow()
};

export const registrySourceType = pgEnum("registry_source_type", [
  "official",
  "subregistry",
  "manual",
  "other"
]);

export const serverStatus = pgEnum("server_status", [
  "indexed",
  "invalid",
  "removed_upstream"
]);

export const upstreamStatus = pgEnum("upstream_status", [
  "active",
  "deprecated",
  "deleted"
]);

export const versionStatus = pgEnum("server_version_status", [
  "indexed",
  "removed_upstream",
  "invalid"
]);

export const curationStatus = pgEnum("curation_status", [
  "pending",
  "approved",
  "rejected",
  "hidden"
]);

export const curationVisibility = pgEnum("curation_visibility", [
  "public",
  "private",
  "unlisted"
]);

export const toolSource = pgEnum("tool_source", [
  "manual",
  "discovered",
  "upstream"
]);

export const syncMode = pgEnum("sync_mode", [
  "full_etl",
  "incremental",
  "latest_only"
]);

export const syncStatus = pgEnum("sync_status", [
  "running",
  "succeeded",
  "failed"
]);

export const registrySources = pgTable(
  "registry_sources",
  {
    id,
    name: text().notNull(),
    type: registrySourceType().notNull(),
    baseUrl: text(),
    enabled: boolean().notNull().default(true),
    lastSyncedAt: timestamp({ withTimezone: true }),
    ...timestamps
  },
  (table) => [uniqueIndex("registry_sources_name_idx").on(table.name)]
);

export const servers = pgTable(
  "servers",
  {
    id,
    name: text().notNull(),
    title: text(),
    description: text(),
    websiteUrl: text(),
    repositoryUrl: text(),
    license: text(),
    status: serverStatus().notNull().default("indexed"),
    ...timestamps
  },
  (table) => [
    uniqueIndex("servers_name_idx").on(table.name),
    index("servers_status_idx").on(table.status)
  ]
);

export const serverVersions = pgTable(
  "server_versions",
  {
    id,
    serverId: integer()
      .notNull()
      .references(() => servers.id, { onDelete: "cascade" }),
    sourceId: integer()
      .notNull()
      .references(() => registrySources.id, { onDelete: "restrict" }),
    version: text().notNull(),
    rawJson: jsonb().notNull(),
    normalizedJson: jsonb().notNull(),
    upstreamStatus: upstreamStatus(),
    status: versionStatus().notNull().default("indexed"),
    publishedAt: timestamp({ withTimezone: true }),
    upstreamUpdatedAt: timestamp({ withTimezone: true }),
    ...timestamps
  },
  (table) => [
    uniqueIndex("server_versions_identity_idx").on(
      table.serverId,
      table.sourceId,
      table.version
    ),
    index("server_versions_server_idx").on(table.serverId),
    index("server_versions_status_idx").on(table.status)
  ]
);

export const serverPackages = pgTable(
  "server_packages",
  {
    id,
    serverVersionId: integer()
      .notNull()
      .references(() => serverVersions.id, { onDelete: "cascade" }),
    registryType: text().notNull(),
    identifier: text().notNull(),
    version: text(),
    transport: jsonb(),
    runtimeHint: text(),
    registryBaseUrl: text(),
    fileSha256: text(),
    packageArguments: jsonb(),
    runtimeArguments: jsonb(),
    environmentVariables: jsonb(),
    packageJson: jsonb().notNull(),
    ...timestamps
  },
  (table) => [
    index("server_packages_version_idx").on(table.serverVersionId),
    index("server_packages_registry_type_idx").on(table.registryType)
  ]
);

export const serverRemotes = pgTable(
  "server_remotes",
  {
    id,
    serverVersionId: integer()
      .notNull()
      .references(() => serverVersions.id, { onDelete: "cascade" }),
    transportType: text().notNull(),
    url: text().notNull(),
    headers: jsonb(),
    variables: jsonb(),
    remoteJson: jsonb().notNull(),
    ...timestamps
  },
  (table) => [
    index("server_remotes_version_idx").on(table.serverVersionId),
    index("server_remotes_transport_type_idx").on(table.transportType)
  ]
);

export const serverTools = pgTable(
  "server_tools",
  {
    id,
    serverVersionId: integer()
      .notNull()
      .references(() => serverVersions.id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text(),
    inputSchema: jsonb(),
    outputSchema: jsonb(),
    source: toolSource().notNull().default("manual"),
    discoveredAt: timestamp({ withTimezone: true }),
    ...timestamps
  },
  (table) => [
    uniqueIndex("server_tools_version_name_idx").on(
      table.serverVersionId,
      table.name
    ),
    index("server_tools_name_idx").on(table.name)
  ]
);

export const curations = pgTable(
  "curations",
  {
    id,
    serverId: integer()
      .notNull()
      .references(() => servers.id, { onDelete: "cascade" }),
    serverVersionId: integer().references(() => serverVersions.id, {
      onDelete: "cascade"
    }),
    status: curationStatus().notNull().default("pending"),
    visibility: curationVisibility().notNull().default("private"),
    featured: boolean().notNull().default(false),
    qualityLabel: text(),
    notes: text(),
    meta: jsonb().notNull().default({}),
    ...timestamps
  },
  (table) => [
    uniqueIndex("curations_server_level_idx")
      .on(table.serverId)
      .where(sql.raw('"server_version_id" is null')),
    uniqueIndex("curations_version_level_idx")
      .on(table.serverId, table.serverVersionId)
      .where(sql.raw('"server_version_id" is not null')),
    index("curations_status_visibility_idx").on(table.status, table.visibility)
  ]
);

export const tags = pgTable(
  "tags",
  {
    id,
    slug: text().notNull(),
    name: text().notNull(),
    ...timestamps
  },
  (table) => [uniqueIndex("tags_slug_idx").on(table.slug)]
);

export const serverTags = pgTable(
  "server_tags",
  {
    serverId: integer()
      .notNull()
      .references(() => servers.id, { onDelete: "cascade" }),
    tagId: integer()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" })
  },
  (table) => [
    primaryKey({ columns: [table.serverId, table.tagId] }),
    index("server_tags_tag_idx").on(table.tagId)
  ]
);

export const syncRuns = pgTable(
  "sync_runs",
  {
    id,
    sourceId: integer()
      .notNull()
      .references(() => registrySources.id, { onDelete: "cascade" }),
    mode: syncMode().notNull(),
    status: syncStatus().notNull(),
    startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp({ withTimezone: true }),
    cursor: text(),
    updatedSince: timestamp({ withTimezone: true }),
    serversSeen: integer().notNull().default(0),
    versionsSeen: integer().notNull().default(0),
    error: text()
  },
  (table) => [
    index("sync_runs_source_idx").on(table.sourceId),
    index("sync_runs_status_idx").on(table.status)
  ]
);
