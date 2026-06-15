import { curatedSeedDocumentSchema, type CuratedSeed } from "./curated-seed";

export interface CuratedValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    servers: number;
    approvedPublic: number;
    remoteServers: number;
    packageServers: number;
  };
}

const forbiddenKeys = [
  "enabled",
  "runtimeEnabled",
  "approvedForRuntime",
  "secretValue",
  "tokenValue",
  "gatewayPolicy",
  "routingPolicy",
  "workspacePermissions"
];

export function validateCuratedSeed(input: unknown): CuratedValidationResult {
  const parsed = curatedSeedDocumentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      warnings: [],
      summary: {
        servers: 0,
        approvedPublic: 0,
        remoteServers: 0,
        packageServers: 0
      }
    };
  }

  return validateParsedSeed(parsed.data);
}

function validateParsedSeed(seed: CuratedSeed): CuratedValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let approvedPublic = 0;
  let remoteServers = 0;
  let packageServers = 0;

  for (const [index, entry] of seed.servers.entries()) {
    const label = `${entry.server.name}@${entry.server.version}`;
    const remotes = entry.server.remotes ?? [];
    const packages = entry.server.packages ?? [];
    const verification = verificationMeta(entry);

    if (entry.curation.status === "approved" && entry.curation.visibility === "public") {
      approvedPublic += 1;

      if (!verification) {
        errors.push(`${label}: approved public records must include curation.meta.verification`);
      } else {
        const status = stringValue(verification.status);
        if (!status) errors.push(`${label}: verification.status is required`);
        if (!stringValue(verification.ownership)) errors.push(`${label}: verification.ownership is required`);
        if (!stringValue(verification.sourceUrl)) errors.push(`${label}: verification.sourceUrl is required`);
        if (!stringValue(verification.verifiedAt)) errors.push(`${label}: verification.verifiedAt is required`);
        if (status === "needs_confirmation") {
          warnings.push(`${label}: endpoint verification still needs confirmation`);
        }
      }
    }

    if (remotes.length) remoteServers += 1;
    if (packages.length) packageServers += 1;

    if (!remotes.length && !packages.length) {
      errors.push(`${label}: server must include at least one remote or package`);
    }

    if (!entry.tags.length) {
      errors.push(`${label}: curated records must include tags`);
    }

    for (const [remoteIndex, remote] of remotes.entries()) {
      if (!remote.url) errors.push(`${label}: remotes[${remoteIndex}].url is required`);
      if (!remote.type) errors.push(`${label}: remotes[${remoteIndex}].type is required`);
    }

    const forbiddenPaths = findForbiddenFields(entry);
    for (const path of forbiddenPaths) {
      errors.push(`${label}: forbidden runtime field ${path}`);
    }

    if (index > 0 && seed.servers.findIndex((other) => other.server.name === entry.server.name) !== index) {
      errors.push(`${label}: duplicate server name`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      servers: seed.servers.length,
      approvedPublic,
      remoteServers,
      packageServers
    }
  };
}

function verificationMeta(entry: CuratedSeed["servers"][number]) {
  const meta = entry.curation.meta;
  return isRecord(meta?.verification) ? meta.verification : null;
}

function findForbiddenFields(value: unknown, path = "$"): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findForbiddenFields(item, `${path}[${index}]`));
  }

  if (!isRecord(value)) {
    return [];
  }

  const hits: string[] = [];

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    if (forbiddenKeys.includes(key)) {
      hits.push(childPath);
    }
    hits.push(...findForbiddenFields(child, childPath));
  }

  return hits;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}
