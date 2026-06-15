import type { Database } from "../db/client";
import type { NormalizedServerRecord } from "./normalize-server";
import { ingestServerRecord } from "./server-ingest";

export async function createManualServer(
  db: Database,
  input: unknown
): Promise<NormalizedServerRecord> {
  return ingestServerRecord(db, {
    sourceName: "manual",
    sourceType: "manual",
    input,
    upstreamStatus: "active"
  });
}
