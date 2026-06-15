import { loadCuratedSeed } from "./services/curated-seed";
import { validateCuratedSeed } from "./services/curated-validation";

const seedPath = process.argv[2] || "data/default-curated-servers.json";
const result = validateCuratedSeed(await loadCuratedSeed(seedPath));

console.log(JSON.stringify(result, null, 2));

if (!result.valid) {
  process.exit(1);
}
