import { createHash } from "node:crypto";
import { metaKeys } from "../../../../packages/shared/src";
import type { JsonValue, ServerResponse } from "../schemas/mcp-registry";
import type { GatewayCompatibility } from "../../../../packages/shared/src";
import type { Database } from "../db/client";
import { getCatalog } from "./curation-catalog";
import {
  computeGatewayCompatibility,
  gatewayCompatibilityMetaKey
} from "./gateway-compatibility";
import { countServerTools } from "./tools";

export interface GatewayCatalogOptions {
  limit?: number;
  cursor?: string | null;
}

export interface GatewayCatalogItem {
  catalogItemId: string;
  name: string;
  version: string;
  isLatest: boolean;
  title: string;
  description: string;
  lifecycleStatus: string;
  updatedAt: string;
  contentHash: string;
  tags: string[];
  qualityLabel: string | null;
  gatewayCompatibility: GatewayCompatibility;
  readiness: Record<string, JsonValue>;
  requiredSecrets: string[];
  requiredConfig: string[];
  packages: Array<Record<string, JsonValue>>;
  remotes: Array<Record<string, JsonValue>>;
  toolsUrl: string;
  toolCount: number;
  provenance: Record<string, JsonValue>;
  verification: Record<string, JsonValue> | null;
  curation: Record<string, JsonValue>;
  _meta: Record<string, JsonValue>;
}

export interface GatewayCatalogResponse {
  generatedAt: string;
  nextCursor: string | null;
  items: GatewayCatalogItem[];
}

const defaultLimit = 50;
const maxLimit = 100;

export async function getGatewayCatalog(
  db: Database,
  options: GatewayCatalogOptions = {}
): Promise<GatewayCatalogResponse> {
  const catalog = await getCatalog(db);
  const limit = normalizeLimit(options.limit);
  const start = parseCursor(options.cursor);
  const projected = catalog.servers
    .filter((row) => lifecycleMeta(row).status !== "deleted")
    .map((row) => row);
  const page = projected.slice(start, start + limit);
  const nextIndex = start + limit;

  return {
    generatedAt: new Date().toISOString(),
    nextCursor: nextIndex < projected.length ? String(nextIndex) : null,
    items: await Promise.all(page.map((row) => projectItem(db, row)))
  };
}

async function projectItem(db: Database, row: ServerResponse): Promise<GatewayCatalogItem> {
  const server = row.server;
  const curation = objectMeta(row._meta[metaKeys.curation]);
  const readiness = objectMeta(row._meta[metaKeys.readiness]);
  const gatewayCompatibility = gatewayCompatibilityObject(
    row._meta[gatewayCompatibilityMetaKey],
    row
  );
  const serverMeta = objectMeta(row._meta[metaKeys.server]);
  const versionMeta = lifecycleMeta(row);
  const tags = arrayOfStrings(curation.tags);
  const verification = objectMeta(objectMeta(curation.meta).verification);
  const packages = (server.packages ?? []) as Array<Record<string, JsonValue>>;
  const remotes = (server.remotes ?? []) as Array<Record<string, JsonValue>>;
  const updatedAt = stringValue(versionMeta.updatedAt) ?? new Date(0).toISOString();
  const qualityLabel = stringValue(curation.qualityLabel) ?? stringValue(serverMeta.qualityLabel);
  const itemWithoutHash = {
    name: server.name,
    version: server.version,
    packages,
    remotes,
    curation,
    gatewayCompatibility,
    readiness,
    versionMeta,
    serverMeta
  };

  return {
    catalogItemId: stableCatalogItemId(server.name, server.version),
    name: server.name,
    version: server.version,
    isLatest: booleanValue(versionMeta.isLatest) ?? false,
    title: server.title ?? server.name,
    description: server.description,
    lifecycleStatus: stringValue(versionMeta.status) ?? "active",
    updatedAt,
    contentHash: `sha256:${hashJson(itemWithoutHash)}`,
    tags,
    qualityLabel,
    gatewayCompatibility,
    readiness,
    requiredSecrets: arrayOfStrings(readiness.requiredSecrets),
    requiredConfig: arrayOfStrings(readiness.requiredConfig),
    packages: packages.map((pkg, index) => projectPackage(pkg, index)),
    remotes: remotes.map((remote, index) => projectRemote(remote, index)),
    toolsUrl: `/v0.1/servers/${encodeURIComponent(server.name)}/tools?version=${encodeURIComponent(server.version)}`,
    toolCount: await countServerTools(db, server.name, server.version),
    provenance: {
      source: versionMeta.source ?? null,
      sourceNames: serverMeta.sourceNames ?? [],
      isOfficial: serverMeta.isOfficial ?? false,
      upstreamUrl: versionMeta.source ?? null,
      updatedAt,
      publishedAt: versionMeta.publishedAt ?? null
    } as Record<string, JsonValue>,
    verification: Object.keys(verification).length ? verification : null,
    curation,
    _meta: row._meta
  };
}

function projectPackage(pkg: Record<string, JsonValue>, index: number): Record<string, JsonValue> {
  return {
    id: `pkg_${index + 1}`,
    registryType: pkg.registryType ?? null,
    packageName: pkg.identifier ?? null,
    version: pkg.version ?? null,
    transport: objectMeta(pkg.transport).type ?? pkg.transport ?? "stdio",
    runtimeHint: pkg.runtimeHint ?? null,
    command: pkg.runtimeHint ?? null,
    args: pkg.runtimeArguments ?? pkg.packageArguments ?? [],
    envSchema: normalizeEnvSchema(pkg.environmentVariables),
    configSchema: [],
    source: {
      type: "registry",
      url: pkg.registryBaseUrl ?? null
    } as Record<string, JsonValue>,
    original: pkg
  };
}

function projectRemote(remote: Record<string, JsonValue>, index: number): Record<string, JsonValue> {
  const headers = normalizeHeaderSchema(remote.headers);

  return {
    id: `remote_${index + 1}`,
    transport: normalizeTransport(stringValue(remote.type) ?? "unknown"),
    url: remote.url ?? null,
    hosted: !hasTemplatedHost(stringValue(remote.url)),
    auth: inferAuth(headers),
    headersSchema: headers,
    urlVariables: normalizeVariables(remote.variables),
    configSchema: [],
    original: remote
  };
}

function normalizeEnvSchema(value: unknown): JsonValue[] {
  const entries = Array.isArray(value) ? value : [];
  return entries
    .filter(isRecord)
    .map((entry) => ({
      name: stringValue(entry.name) ?? "",
      required: booleanValue(entry.isRequired) ?? true,
      secret: booleanValue(entry.isSecret) ?? looksSecret(stringValue(entry.name)),
      description: stringValue(entry.description) ?? ""
    }));
}

function normalizeHeaderSchema(value: unknown): JsonValue[] {
  const entries = Array.isArray(value) ? value : [];
  if (entries.length) {
    return entries.filter(isRecord).map((entry) => ({
      name: stringValue(entry.name) ?? stringValue(entry.key) ?? "",
      required: booleanValue(entry.isRequired) ?? true,
      secret: booleanValue(entry.isSecret) ?? looksSecret(stringValue(entry.name) ?? stringValue(entry.key)),
      template: stringValue(entry.template) ?? null
    }));
  }

  if (isRecord(value)) {
    return Object.keys(value).map((name) => ({
      name,
      required: true,
      secret: looksSecret(name),
      template: null
    }));
  }

  return [];
}

function normalizeVariables(value: unknown): JsonValue[] {
  if (!isRecord(value)) return [];
  return Object.entries(value).map(([name, variable]) => ({
    name,
    required: isRecord(variable) ? booleanValue(variable.isRequired) ?? true : true,
    description: isRecord(variable) ? stringValue(variable.description) ?? "" : ""
  }));
}

function inferAuth(headers: JsonValue[]): Record<string, JsonValue> {
  const secretHeader = headers.find((header) => isRecord(header) && header.secret === true);
  const name = isRecord(secretHeader) ? stringValue(secretHeader.name) : null;

  if (!name) {
    return { type: "none" };
  }

  return {
    type: name.toLowerCase() === "authorization" ? "bearer" : "header",
    requiredSecret: name
  };
}

function normalizeTransport(value: string) {
  return value.replace(/-/g, "_");
}

function hasTemplatedHost(value: string | null) {
  if (!value) return false;
  try {
    return /\{[^}]+}/.test(new URL(value).host);
  } catch {
    return /\{[^}]+}/.test(value);
  }
}

function stableCatalogItemId(name: string, version: string) {
  return `srv_${hashJson({ name, version }).slice(0, 24)}`;
}

function hashJson(value: unknown) {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function normalizeLimit(limit: number | undefined): number {
  if (!limit || Number.isNaN(limit)) return defaultLimit;
  return Math.min(Math.max(Math.trunc(limit), 1), maxLimit);
}

function parseCursor(cursor: string | null | undefined) {
  if (!cursor) return 0;
  const parsed = Number(cursor);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

function gatewayCompatibilityObject(
  value: unknown,
  response: ServerResponse
): GatewayCompatibility {
  const compatibility = objectMeta(value);

  if (Object.keys(compatibility).length > 0) {
    return {
      hosted_gateway: booleanValue(compatibility.hosted_gateway) ?? false,
      requires_connector_runtime:
        booleanValue(compatibility.requires_connector_runtime) ?? false,
      supported_transports: arrayOfStrings(compatibility.supported_transports),
      reason: stringValue(compatibility.reason) ?? ""
    };
  }

  return computeGatewayCompatibility(response);
}

function arrayOfStrings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function lifecycleMeta(row: ServerResponse) {
  return objectMeta(row._meta[metaKeys.serverVersion]);
}

function objectMeta(value: unknown): Record<string, JsonValue> {
  return isRecord(value) ? (value as Record<string, JsonValue>) : {};
}

function arrayOfStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : null;
}

function booleanValue(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function looksSecret(name: string | null) {
  return name ? /token|secret|key|password|credential|authorization/i.test(name) : false;
}
