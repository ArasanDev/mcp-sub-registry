FROM oven/bun:1.3.3

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY tsconfig.json drizzle.config.ts ./
COPY drizzle ./drizzle
COPY apps ./apps
COPY packages ./packages
COPY data ./data
RUN bun run build:web

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 CMD ["bun", "-e", "const response = await fetch('http://127.0.0.1:8080/health'); process.exit(response.ok ? 0 : 1);"]

CMD ["bun", "run", "start"]
