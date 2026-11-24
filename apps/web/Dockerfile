# syntax=docker/dockerfile:1.7
# The Perfume Dictionary website image. Build context: the REPO ROOT (needs packages/api-client):
#   docker build -f apps/web/Dockerfile -t perfume-web .
# API_URL is read at run time; NEXT_PUBLIC_* values are baked in at build time.

FROM node:22-slim AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY packages/api-client/package.json packages/api-client/
RUN npm ci --workspace apps/web --include-workspace-root --no-audit --no-fund

# Build on top of `deps` so every node_modules folder npm created is kept — workspaces can put packages in
# apps/web/node_modules and packages/*/node_modules, not only the root (copying just the root one broke the build).
FROM deps AS build
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
COPY packages/api-client ./packages/api-client
COPY apps/web ./apps/web
RUN npm run build -w apps/web

FROM node:22-slim AS runtime
ARG APP_VERSION=0.0.0-dev
ARG GIT_SHA=unknown
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 \
    APP_VERSION=${APP_VERSION} GIT_SHA=${GIT_SHA}
LABEL org.opencontainers.image.title="perfume-web" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${GIT_SHA}"
WORKDIR /app
COPY --from=build --chown=1000:1000 /repo/apps/web/.next/standalone ./
COPY --from=build --chown=1000:1000 /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=1000:1000 /repo/apps/web/public ./apps/web/public
USER 1000
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "apps/web/server.js"]
