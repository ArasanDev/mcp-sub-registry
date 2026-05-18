import { metaKeys, type GatewayCompatibility } from "../../../../packages/shared/src";
import type { JsonValue, ServerResponse } from "../schemas/mcp-registry";

export const gatewayCompatibilityMetaKey = metaKeys.gatewayCompatibility;

const hostedGatewayTransports = new Set(["streamable-http", "sse"]);
const connectorRuntimeTransports = new Set(["stdio", "process", "container"]);

export function computeGatewayCompatibility(
  response: ServerResponse
): GatewayCompatibility {
  const curation = objectMeta(response._meta?.[metaKeys.curation]);
  const supportedTransports = unique([
    ...packageTransports(response.server.packages ?? []),
    ...remoteTransports(response.server.remotes ?? [])
  ]);
  const approvedPublic =
    stringValue(curation.status) === "approved" &&
    stringValue(curation.visibility) === "public";
  const packageRuntimeRequired =
    (response.server.packages ?? []).length > 0 ||
    supportedTransports.some((transport) => connectorRuntimeTransports.has(transport));
  const remoteHostedCandidate =
    supportedTransports.some((transport) => hostedGatewayTransports.has(transport)) &&
    !(response.server.packages ?? []).length;
  const hostedGateway = approvedPublic && remoteHostedCandidate && !packageRuntimeRequired;
  const requiresConnectorRuntime = packageRuntimeRequired;

  return {
    hosted_gateway: hostedGateway,
    requires_connector_runtime: requiresConnectorRuntime,
    supported_transports: supportedTransports,
    reason: compatibilityReason({
      approvedPublic,
      hostedGateway,
      packageRuntimeRequired,
      remoteHostedCandidate,
      supportedTransports
    })
  };
}

export function withGatewayCompatibility(response: ServerResponse): ServerResponse {
  return {
    ...response,
    _meta: {
      ...response._meta,
      [gatewayCompatibilityMetaKey]: computeGatewayCompatibility(response) as unknown as JsonValue
    }
  };
}

function compatibilityReason(input: {
  approvedPublic: boolean;
  hostedGateway: boolean;
  packageRuntimeRequired: boolean;
  remoteHostedCandidate: boolean;
  supportedTransports: string[];
}) {
  if (!input.approvedPublic) {
    return "Only approved public records can be hosted by the Gateway.";
  }

  if (input.hostedGateway) {
    return "Approved public remote Streamable HTTP/SSE server can be imported directly by hosted Gateway.";
  }

  if (input.packageRuntimeRequired) {
    return "Package or stdio transport requires Connector Runtime before Gateway import.";
  }

  if (input.remoteHostedCandidate) {
    return "Remote transport is eligible for Gateway import, but additional runtime planning is still required.";
  }

  if (input.supportedTransports.length === 0) {
    return "No supported Gateway transport metadata is available.";
  }

  return "Remote transport is not a hosted Gateway candidate.";
}

function packageTransports(packages: Array<Record<string, JsonValue>>) {
  return packages.flatMap((serverPackage) => {
    const transport = normalizeTransportValue(
      objectMeta(serverPackage.transport).type ?? stringValue(serverPackage.transport) ?? "stdio"
    );

    return transport ? [transport] : [];
  });
}

function remoteTransports(remotes: Array<Record<string, JsonValue>>) {
  return remotes.flatMap((remote) => {
    const transport = normalizeTransportValue(remote.type ?? "unknown");

    return transport ? [transport] : [];
  });
}

function normalizeTransportValue(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace(/_/g, "-");
  return normalized || null;
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function objectMeta(value: unknown) {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, JsonValue>)
    : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : null;
}
