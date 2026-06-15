import "dotenv/config";
import { createDatabaseConnection } from "./db/client";
import { applyCuratedSeed, loadCuratedSeed } from "./services/curated-seed";

const connection = createDatabaseConnection();

try {
  const seedPath = process.argv[2] || "data/default-curated-servers.json";
  const result = await applyCuratedSeed(connection.db, await loadCuratedSeed(seedPath));
  console.log(JSON.stringify({ seeded: result }, null, 2));
} finally {
  await connection.queryClient.end();
}
