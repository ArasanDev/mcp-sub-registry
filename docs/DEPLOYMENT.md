# Deployment Notes

Deployment is not part of the first coding task, but the implementation should keep these requirements in mind.

## Required Runtime Inputs

Expected environment variables:

```text
DATABASE_URL
ADMIN_API_KEY
PORT
NODE_ENV
```

Local development should use Docker Postgres by default. Hosted preview/staging can use Neon through `DATABASE_URL`.

Later:

```text
OFFICIAL_REGISTRY_URL
SYNC_INTERVAL_MINUTES
```

## Production Shape

Minimum production components:

```text
HTTP service
PostgreSQL database
migration command
health check
logs
```

## Database Strategy

Use one code path for all environments:

```text
DATABASE_URL
```

Recommended environments:

- Local: Docker Postgres.
- Preview/staging: Neon managed Postgres.
- Production: managed Postgres, likely Neon unless deployment needs change.

When Neon MCP is available, use it to manage hosted preview/staging branches and migration checks. Do not use hosted Neon as the default local test loop.

## Health Check

Use:

```text
GET /health
```

The endpoint should not require auth.

## Deployment Checklist

- Database is reachable.
- Migrations are applied.
- `ADMIN_API_KEY` is set.
- In production, `ADMIN_API_KEY` is at least 32 characters.
- Service starts.
- `/health` returns `ok`.
- A manual server can be added.
- Catalog endpoint returns expected records.

## Container

Build the production image:

```sh
docker build -t mcp-sub-registry .
```

The production image includes the repository `data/` directory so curated seed
and validation commands continue to work inside the container during launch and
maintenance operations.

Run migrations as an explicit deployment step before starting or promoting the service:

```sh
docker run --rm \
  -e DATABASE_URL="$DATABASE_URL" \
  mcp-sub-registry \
  bun run db:migrate
```

Run the HTTP service:

```sh
docker run --rm \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e ADMIN_API_KEY="$ADMIN_API_KEY" \
  mcp-sub-registry
```

## Production Docker Compose

For a complete, isolated private hosted deployment on a VPS, use the provided `docker-compose.prod.yml`:

```sh
# Create a .env file with your production secrets
echo "ADMIN_API_KEY=your_secure_random_key_here_32_chars_min" > .env
echo "POSTGRES_PASSWORD=your_secure_db_password" >> .env

# Start the stack
docker compose -f docker-compose.prod.yml up -d --build
```

This stack publishes port `8080` on the host so a same-VPS reverse proxy
container can reach the service. Keep `8080` private with the VPS firewall and
point the edge proxy at the published host port.

Health check:

```sh
curl http://localhost:8080/health
```

If the edge proxy runs in a container on the same VPS, a host-only loopback bind is not sufficient. Publish the service on the host interface for the proxy hop and rely on the VPS firewall to keep `8080` private.

## Backup and Restore

The Sub-Registry provides logical backup and restore APIs protected by the `ADMIN_API_KEY`.

### Logical Backup Export

Export the entire registry database (sources, server versions, curations, tags, and tools) to a single JSON file:

```sh
curl -H "Authorization: Bearer <ADMIN_API_KEY>" \
     -o mcp-registry-backup.json \
     https://registry.toolhost.online/admin/backup
```

### Logical Backup Import

Restore the database from a previously exported backup JSON file:

```sh
curl -X POST \
     -H "Authorization: Bearer <ADMIN_API_KEY>" \
     -H "Content-Type: application/json" \
     -d @mcp-registry-backup.json \
     https://registry.toolhost.online/admin/backup/import
```
