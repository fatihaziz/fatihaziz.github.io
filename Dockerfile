# syntax=docker/dockerfile:1

# ---- build stage: compile better-sqlite3 for linux + build the node-server output ----
FROM node:22-bookworm-slim AS build
WORKDIR /app

# better-sqlite3 builds a native addon -> needs python3 + a C/C++ toolchain.
# python-is-python3 lets the repo's `ensure-atlases` (invokes `python`) step run.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python-is-python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Pin pnpm to the version that authored pnpm-lock.yaml so --frozen-lockfile matches.
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

# pnpm-workspace.yaml carries the allowBuilds config -- must be present at install time.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# Default Nitro preset = node-server (NOT github_pages). Emits .output/server/index.mjs.
RUN pnpm build

# ---- runtime stage: only the built output (which bundles the linux native addon) ----
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080 \
    HOST=0.0.0.0 \
    DB_PATH=/data/journal.db

COPY --from=build /app/.output ./.output

# Non-root user; SQLite lives on the Fly volume mounted at /data. Create + own
# the mount point BEFORE switching user so the volume inherits app ownership on
# first mount (standard flyio-deployment Pattern 3).
RUN groupadd --system app \
  && useradd --system --gid app --home-dir /app app \
  && mkdir -p /data \
  && chown -R app:app /data /app
USER app

EXPOSE 8080

# Node-based health check (slim image has no curl); matches /api/health + fly.toml.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
