import "dotenv/config";
import { createApp } from "./app";
import { loadAdminConfig, loadConfig } from "./config";
import { createDatabaseClient } from "./db/client";

const config = loadConfig();
const adminConfig = loadAdminConfig();
const db = createDatabaseClient();

Bun.serve({
  fetch: createApp({
    adminApiKey: adminConfig.ADMIN_API_KEY,
    db
  }).fetch,
  port: config.PORT
});

console.log(`MCP Sub-Registry listening on http://localhost:${config.PORT}`);
