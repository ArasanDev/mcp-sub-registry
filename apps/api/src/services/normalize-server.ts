import {
  metaSchema,
  serverDetailSchema,
  serverResponseSchema,
  type ServerResponse
} from "../schemas/mcp-registry";

export interface NormalizedServerRecord {
  rawJson: unknown;
  normalizedJson: ServerResponse;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeServerRecord(input: unknown): NormalizedServerRecord {
  if (isObject(input) && "server" in input) {
    return {
      rawJson: input,
      normalizedJson: serverResponseSchema.parse(input)
    };
  }

  const server = serverDetailSchema.parse(input);
  const meta = isObject(server._meta) ? metaSchema.parse(server._meta) : {};

  return {
    rawJson: input,
    normalizedJson: {
      server,
      _meta: meta
    }
  };
}
