import { z } from "zod";

export const officialRegistryBaseUrl = "https://registry.modelcontextprotocol.io";

const upstreamListSchema = z
  .object({
    servers: z.array(z.unknown()),
    metadata: z
      .object({
        count: z.number().optional(),
        nextCursor: z.string().nullable().optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();

export interface FetchServersOptions {
  baseUrl?: string;
  cursor?: string | null;
  limit?: number;
  updatedSince?: string | null;
  includeDeleted?: boolean;
  latestOnly?: boolean;
  fetchFn?: typeof fetch;
}

export interface UpstreamServerPage {
  servers: unknown[];
  nextCursor: string | null;
}

export async function fetchServerPage(
  options: FetchServersOptions = {}
): Promise<UpstreamServerPage> {
  const baseUrl = options.baseUrl ?? officialRegistryBaseUrl;
  const url = new URL("/v0.1/servers", baseUrl);

  if (options.limit) {
    url.searchParams.set("limit", String(options.limit));
  }

  if (options.cursor) {
    url.searchParams.set("cursor", options.cursor);
  }

  if (options.updatedSince) {
    url.searchParams.set("updated_since", options.updatedSince);
  }

  if (options.includeDeleted) {
    url.searchParams.set("include_deleted", "true");
  }

  if (options.latestOnly) {
    url.searchParams.set("version", "latest");
  }

  const response = await (options.fetchFn ?? fetch)(url);

  if (!response.ok) {
    throw new Error(`Upstream registry request failed with ${response.status}`);
  }

  const parsed = upstreamListSchema.parse(await response.json());

  return {
    servers: parsed.servers,
    nextCursor: parsed.metadata?.nextCursor ?? null
  };
}
