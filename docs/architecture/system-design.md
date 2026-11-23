# System design

## Components (Phase 0)

```
Browser ──HTTPS──► Gateway (Envoy Gateway, Gateway API)
                     ├── www.*  ─► perfume-web  (Next.js, server-rendered; calls the API server-side)
                     └── api.*  ─► perfume-api  (FastAPI)  ─► PostgreSQL (managed in cloud / CloudNativePG locally)
```

- **perfume-web** renders pages on the server and calls the API over the cluster network (`API_URL`), using the
  typed client in `packages/api-client`. It never talks to the database.
- **perfume-api** owns all business logic and the database schema. It is the public developer API too
  (`api.` hostname, `/api/v1`).
- **PostgreSQL** is the only stateful component. Schema changes go through Alembic.

Later phases add: a worker (data pipelines, price ingestion), Redis (cache/queues), object storage (images), a search
index if Postgres full-text proves insufficient, and the AI mixer service (initially inside the API).

## Request lifecycle
1. Gateway terminates TLS and routes by hostname.
2. The API middleware assigns/propagates `x-request-id`, times the request, records Prometheus metrics labelled by
   route template, and writes one JSON log line.
3. Readiness (`/health/ready`) fails if the database is unreachable or migrations have not been applied, so
   Kubernetes stops sending traffic to that pod.

## Configuration
All settings are environment variables (see `.env.example`, `apps/api/app/core/config.py`). `postgresql://` URLs are
normalised to the psycopg driver so managed-database URLs can be used as-is.
