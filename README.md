# The Perfume Dictionary

A global fragrance encyclopedia, community and data/API platform. This repository is a monorepo built
**DevOps-first**: every feature ships through the same pipeline — pull request → CI → signed container images →
GitOps deploy to Kubernetes.

> **Status:** Phase 2 — the website: perfume, house, note, accord and perfumer pages plus search, on the catalogue API (synthetic demo data). Hosting: local now; free cloud preview at
> `perfume.pambydesign.net` in Phase 3; AWS later (see `docs/implementation-roadmap.md`, ADR 0007).

## What's here

| Path | What it is |
|---|---|
| `apps/api` | FastAPI service (Python 3.12, SQLAlchemy 2, Alembic). Health, readiness, metrics, JSON logs. |
| `apps/web` | Next.js 16 website (App Router, standalone output). |
| `packages/api-client` | Typed TypeScript client generated from the API's OpenAPI schema. |
| `docker-compose.yml` | Full local stack: Postgres → migrations → API → web. |
| `deploy/k8s` | Kustomize base + `local` / `staging` / `production` overlays. |
| `deploy/argocd` | Argo CD Applications (GitOps) for staging and production. |
| `deploy/local` | kind cluster config for local Kubernetes. |
| `.github/workflows` | CI (tests, e2e, scans, manifest validation), image build/sign, CodeQL. |
| `infrastructure/terraform` | Cloud infrastructure (Phase 3). |
| `docs` | PRD, architecture, decisions (ADRs), runbooks, roadmap, progress. |

## Quick start

**Option A — everything in containers** (needs Docker):

```bash
cp .env.example .env
make up            # builds images, starts db → migrate → api → web
open http://localhost:3000        # page shows "Connected to API …"
open http://localhost:8000/docs   # API docs
make e2e           # Playwright against the running stack
make down
```

**Option B — run the apps directly** (needs Python 3.12, Node 22, PostgreSQL 16):

```bash
cp .env.example .env
make install
make dev-api       # http://localhost:8000
make dev-web       # http://localhost:3000
make test
```

**Option C — local Kubernetes** (needs Docker, kind, kubectl):

```bash
make k8s-up        # kind cluster + Gateway API + Envoy Gateway + CloudNativePG + the app
kubectl -n envoy-gateway-system port-forward svc/<printed-name> 8080:80
open http://perfume.localhost:8080
make k8s-down
```

## How code reaches users

```
branch ─► PR ─► CI: lint · unit · integration · build images · e2e on real images · scans · manifest checks
                 │
           merge to main
                 ▼
     build.yml: build ► scan ► SBOM + provenance ► cosign sign ► push ghcr.io/…:sha-<short>
                 ▼
     staging overlay image tag bumped ► Argo CD syncs staging (PreSync: migrations) ► smoke tests
                 ▼
     tag vX.Y.Z ► production overlay bumped by PR ► manual Argo CD sync ► smoke tests
```

Staging/production deploys start in Phase 3, once the cloud account and cluster exist. See
`docs/architecture/devops-design.md`.

## Website pages

| Page | What it shows |
|---|---|
| `/` | Search, newest perfumes, accords to browse |
| `/perfumes`, `/perfumes/{slug}` | Browse with filters (note, accord, family, house, concentration, years, sort); profile with note pyramid, main accords, bottles, provenance |
| `/brands`, `/notes`, `/accords`, `/perfumers` (+ `/{slug}`) | Indexes and detail pages; note aliases resolve (`/notes/orris` → Iris) |
| `/search?q=` | Everything at once; accent- and typo-tolerant |
| `/sitemap.xml`, `/robots.txt` | Built from the live catalogue; previews are kept out of search engines (`ALLOW_INDEXING`) |

Every page type is covered by Playwright (mobile + desktop, axe accessibility checks) and by Lighthouse budgets in CI.

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /health` | Liveness — the process is up. Never touches the database. |
| `GET /health/ready` | Readiness — database reachable and migrations applied (returns the revision). 503 otherwise. |
| `GET /api/v1/meta` | Name, version, git SHA, environment — proves which build is running. |
| `GET /metrics` | Prometheus metrics (request count and latency by route template). |
| `GET /api/v1/perfumes` | Filter (`q`, `brand`, `note`, `accord`, `family`, `perfumer`, `concentration`, `year_from/to`), sort, cursor-paginate. |
| `GET /api/v1/perfumes/{slug or id}` | Profile: pyramid, accords (1–100), variants, perfumers, data source. |
| `GET /api/v1/brands`, `/brands/{slug}` | Houses and their perfumes. |
| `GET /api/v1/notes`, `/notes/{slug or alias}` | Notes dictionary; `orris` resolves to Iris. |
| `GET /api/v1/accords`, `/accords/{slug}` | Accords and the perfumes where each is most prominent. |
| `GET /api/v1/perfumers`, `/perfumers/{slug}`, `/families`, `/data-sources` | People, families, provenance. |
| `GET /api/v1/search?q=` | Across everything; accent- and typo-tolerant (`caffe` → Caffè, `vanila` → Vanilla). |

All catalogue data in this repo is **synthetic** (fictional brands and perfumes, `is_synthetic: true`). Errors always
look like `{"error": {"code", "message", "details"}}`.
| web `GET /healthz` | Website liveness. |

## Contributing

Trunk-based with short-lived branches and Conventional Commits — see `CONTRIBUTING.md`. Project rules for anyone
(human or AI) working in this repo are in `CLAUDE.md`.
