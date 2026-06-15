import type { JsonValue, ServerResponse } from "../schemas/mcp-registry";
import { metaKeys, type GatewayReadiness, type ReadinessStatus } from "../../../../packages/shared/src";

export const readinessMetaKey = metaKeys.readiness;
export const versionMetaKey = metaKeys.serverVersion;

export function computeReadiness(response: ServerResponse): GatewayReadiness {
  const server = response.server;
  const versionMeta = isRecord(response._meta?.[versionMetaKey])
    ? response._meta[versionMetaKey]
    : {};
  const lifecycleStatus = stringValue(versionMeta.status);

  const packages = server.packages ?? [];
  const remotes = server.remotes ?? [];
  const requiredSecrets = unique([
    ...packages.flatMap((serverPackage) =>
      requiredNames(serverPackage.environmentVariables, "secret")
    ),
    ...remotes.flatMap((remote) => requiredNames(remote.headers, "secret"))
  ]);
  const requiredConfig = unique([
    ...packages.flatMap((serverPackage) =>
      requiredNames(serverPackage.environmentVariables, "config")
    ),
    ...remotes.flatMap((remote) => requiredNames(remote.headers, "config")),
    ...remotes.flatMap((remote) => variableNames(remote.variables)),
    ...remotes.flatMap((remote) => templatedNames(remote.url))
  ]).filter((name) => !requiredSecrets.includes(name));
  const hasPackage = packages.length > 0;
  const hasRemote = remotes.length > 0;
  const installType = hasPackage && hasRemote
    ? "mixed"
    : hasPackage
      ? "package"
      : hasRemote
        ? "remote"
        : "unknown";
  const reasons: string[] = [];
  let status: ReadinessStatus = "unknown";

  if (lifecycleStatus === "deleted") {
    status = "deleted";
    reasons.push("Upstream status is deleted.");
  } else if (lifecycleStatus === "deprecated") {
    status = "deprecated";
    reasons.push("Upstream status is deprecated.");
  } else if (requiredSecrets.length) {
    status = "needs_secret";
    reasons.push(...requiredSecrets.map((name) => `Requires secret: ${name}`));
  } else if (requiredConfig.length) {
    status = "needs_config";
    reasons.push(...requiredConfig.map((name) => `Requires config: ${name}`));
  } else if (hasRemote) {
    status = hasPackage ? "ready" : "remote_only";
    reasons.push(hasPackage ? "Remote and package metadata are available." : "Remote metadata is available.");
  } else if (hasPackage) {
    status = "package_only";
    reasons.push("Package metadata is available; gateway must launch a local runtime.");
  } else {
    reasons.push("No package or remote metadata is available.");
  }

  return {
    status,
    reasons,
    installType,
    hasPackage,
    hasRemote,
    requiredSecrets,
    requiredConfig
  };
}

export function withReadiness(response: ServerResponse): ServerResponse {
  return {
    ...response,
    _meta: {
      ...response._meta,
      [readinessMetaKey]: computeReadiness(response) as unknown as JsonValue
    }
  };
}

function requiredNames(value: unknown, mode: "secret" | "config") {
  const entries = Array.isArray(value) ? value : [];
  const names: string[] = [];

  for (const entry of entries) {
    if (!isRecord(entry)) {
      continue;
    }

    const name = stringValue(entry.name) ?? stringValue(entry.key);
    const isRequired = booleanValue(entry.isRequired) ?? true;
    const isSecret = booleanValue(entry.isSecret) ?? looksSecret(name);

    if (!name || !isRequired) {
      continue;
    }

    if (mode === "secret" && isSecret) {
      names.push(name);
    }

    if (mode === "config" && !isSecret) {
      names.push(name);
    }
  }

  return names;
}

function variableNames(value: unknown) {
  if (!isRecord(value)) {
    return [];
  }

  return Object.entries(value)
    .filter(([, variable]) => {
      if (!isRecord(variable)) {
        return true;
      }

      return booleanValue(variable.isRequired) ?? true;
    })
    .map(([name]) => name);
}

function templatedNames(value: unknown) {
  if (typeof value !== "string") {
    return [];
  }

  return [...value.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function looksSecret(name: string | null) {
  return name
    ? /token|secret|key|password|credential|authorization/i.test(name)
    : false;
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
