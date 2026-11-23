# Changelog

All notable changes are recorded here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Added — Phase 1: catalogue database & API
- Schema (migration 0001): data sources, families, brands, perfumers, notes + aliases, accords, perfumes, variants,
  pyramid/accord/perfumer links; check constraints, FK rules, provenance and synthetic flags.
- Endpoints for perfumes (filters, sort, cursor pagination), brands, notes (alias lookup), accords, perfumers,
  families, data sources and cross-catalogue search (pg_trgm + unaccent: accent- and typo-tolerant).
- Reference data: 75 notes (70 aliases), 16 accords. Synthetic demo catalogue: 8 brands, 5 perfumers, 24 perfumes.
- Idempotent seed (`python -m app.seed`) as a compose service and local kind Job; refuses production.
- CI: migrations up/down/up + `alembic check`; compose stack must serve the 24 seeded perfumes.
- `DB_POOLING=none` for serverless hosting.

### Changed
- Hosting plan: local → free cloud preview (Vercel Hobby + Neon Free, `perfume.pambydesign.net`) → AWS (ADR 0007).
- "Dupes" becomes **Similar Perfumes** (ADR 0006).

### Added — Phase 0: walking skeleton and delivery pipeline
- API skeleton: `/health`, `/health/ready` (database + migration revision), `/api/v1/meta`, `/metrics`; JSON logs
  with request IDs; Alembic baseline; 11 tests.
- Website skeleton: home page showing live API status; `/healthz`; Vitest and Playwright (mobile + desktop, axe).
- Typed API client generated from OpenAPI.
- Dockerfiles (multi-stage, non-root) and Docker Compose stack (db → migrate → api → web).
- GitHub Actions: CI, image build/scan/SBOM/sign to GHCR, CodeQL, Dependabot.
- Kubernetes: Kustomize base and local/staging/production overlays, Gateway API routing, network policies,
  migration Job as Argo CD PreSync hook, Argo CD Applications, kind-based local cluster.
- Docs: architecture, DevOps design, ADRs 0001–0006, roadmap.
